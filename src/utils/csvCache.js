/**
 * Google 試算表 CSV 的本地快取工具
 *
 * 資料來源會持續更新，所以不能只抓一次就寫死；但每次進頁面都空等
 * Google 的 /pub 端點回應太慢（實測光是等第一個位元組就要 1~2 秒）。
 * 這裡用 localStorage 快取「上一次抓到的內容」，讓頁面可以先用快取立即顯示，
 * 同時在背景重新抓最新資料並覆蓋畫面，兩者都要時就能兼顧「即時顯示」跟「資料是動態的」。
 *
 * CACHE_TTL_MS 對齊 Google 該端點自己回應的 Cache-Control（max-age=300），
 * 在這段時間內視為足夠新，不用再打一次網路請求——這樣同一份 CSV 被多個頁面
 * （例如 VideoSearch、TagSummarySearch 都會抓 VIDEO_TAGS_CSV_URL）共用時，
 * 不會每次切換頁面都重新忍受一次慢請求。
 */

const CACHE_PREFIX = 'csvCache:'
const CACHE_TTL_MS = 5 * 60 * 1000

function readCacheEntry(url) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function readCsvCache(url) {
  const entry = readCacheEntry(url)
  return entry ? entry.text : null
}

function writeCsvCache(url, text) {
  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ text, time: Date.now() }))
  } catch (e) {
    // 無痕模式或容量已滿時直接略過快取
  }
}

function isCacheFresh(url) {
  const entry = readCacheEntry(url)
  return !!entry && Date.now() - entry.time < CACHE_TTL_MS
}

// 同一份 URL 短時間內被多個元件同時請求時，共用同一個 in-flight promise，避免重複打 Google
const inFlightRequests = new Map()

export function fetchCsvFresh(url) {
  if (isCacheFresh(url)) {
    return Promise.resolve(readCsvCache(url))
  }

  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)
  }

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .then((text) => {
      writeCsvCache(url, text)
      return text
    })
    .finally(() => {
      inFlightRequests.delete(url)
    })

  inFlightRequests.set(url, promise)
  return promise
}
