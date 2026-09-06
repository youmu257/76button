import { readCsvCache, fetchCsvFresh } from '@/utils/csvCache'

// 對應 csvCache.js 內部的 CACHE_PREFIX，模組沒有對外匯出這個常數，
// 但要模擬「localStorage 裡已經有毀損內容」時，只能照同樣的 key 格式寫入。
const CACHE_KEY_PREFIX = 'csvCache:'
const TTL_MS = 5 * 60 * 1000

const url = 'https://example.com/data.csv'

function mockFetchOnce(text) {
  global.fetch.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(text) })
}

beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn()
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2024-01-01T00:00:00Z'))
})

afterEach(() => {
  jest.useRealTimers()
})

describe('readCsvCache', () => {
  it('本地尚未有任何快取時回傳 null', () => {
    expect(readCsvCache(url)).toBeNull()
  })

  it('localStorage 內容不是合法 JSON 時回傳 null', () => {
    localStorage.setItem(CACHE_KEY_PREFIX + url, '{not valid json')

    expect(readCsvCache(url)).toBeNull()
  })

  it('讀取 localStorage 拋出例外時（例如無痕模式）回傳 null', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    expect(readCsvCache(url)).toBeNull()
  })
})

describe('fetchCsvFresh', () => {
  it('本地沒有快取時會呼叫 fetch，並把結果寫入快取', async () => {
    mockFetchOnce('csv-content-v1')

    const result = await fetchCsvFresh(url)

    expect(result).toBe('csv-content-v1')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(readCsvCache(url)).toBe('csv-content-v1')
  })

  it('快取仍在 5 分鐘 TTL 內時直接回傳快取內容，不會再打 fetch', async () => {
    mockFetchOnce('csv-content-v1')
    await fetchCsvFresh(url)
    global.fetch.mockClear()

    jest.advanceTimersByTime(TTL_MS - 1)
    const result = await fetchCsvFresh(url)

    expect(result).toBe('csv-content-v1')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('快取超過 TTL 後會重新呼叫 fetch 取得最新內容', async () => {
    mockFetchOnce('csv-content-v1')
    await fetchCsvFresh(url)
    global.fetch.mockClear()

    jest.advanceTimersByTime(TTL_MS + 1)
    mockFetchOnce('csv-content-v2')
    const result = await fetchCsvFresh(url)

    expect(result).toBe('csv-content-v2')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(readCsvCache(url)).toBe('csv-content-v2')
  })

  it('同一個 URL 短時間內重複呼叫時，共用同一個 in-flight 請求，只打一次 fetch', async () => {
    let resolveFetch
    global.fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )

    const promise1 = fetchCsvFresh(url)
    const promise2 = fetchCsvFresh(url)
    resolveFetch({ ok: true, text: () => Promise.resolve('shared-content') })

    const [result1, result2] = await Promise.all([promise1, promise2])

    expect(result1).toBe('shared-content')
    expect(result2).toBe('shared-content')
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('HTTP 回應非 ok 時會 reject，且不會寫入快取', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 })

    await expect(fetchCsvFresh(url)).rejects.toThrow('HTTP error! status: 404')
    expect(readCsvCache(url)).toBeNull()
  })

  it('fetch 失敗後，in-flight 記錄會被清除，下一次呼叫能重新嘗試', async () => {
    global.fetch.mockRejectedValueOnce(new Error('network down'))
    await expect(fetchCsvFresh(url)).rejects.toThrow('network down')

    mockFetchOnce('recovered-content')
    const result = await fetchCsvFresh(url)

    expect(result).toBe('recovered-content')
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('localStorage 寫入失敗時（例如容量已滿）仍能正常回傳抓到的資料', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    mockFetchOnce('csv-content')

    const result = await fetchCsvFresh(url)

    expect(result).toBe('csv-content')
  })
})
