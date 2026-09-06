import { shallowMount } from '@vue/test-utils'
import VideoSearch from '@/components/VideoSearch.vue'

// mounted() 會呼叫 loadAllData() 去抓 CSV，這裡讓它一直 pending，
// 這樣測試只驗證 parseCSV 這個純解析方法，不會真的觸發任何網路行為。
jest.mock('@/utils/csvCache', () => ({
  readCsvCache: jest.fn(() => null),
  fetchCsvFresh: jest.fn(() => new Promise(() => {})),
}))

function createWrapper() {
  return shallowMount(VideoSearch, {
    global: {
      mocks: {
        $route: { query: {} },
      },
    },
  })
}

describe('VideoSearch parseCSV', () => {
  it('正常解析一列 CSV（含標籤 JSON）', () => {
    const wrapper = createWrapper()
    const csv = 'time,title,url,tag\n2026-01-01,標題,abc123,"[{""t"":1,""n"":""雜談""}]"'

    expect(wrapper.vm.parseCSV(csv)).toEqual([
      { time: '2026-01-01', title: '標題', url: 'abc123', tag: [{ t: 1, n: '雜談' }] },
    ])
  })

  it('CRLF 換行且標籤欄位有值時仍能正確解析', () => {
    const wrapper = createWrapper()
    const csv = 'time,title,url,tag\r\n2026-01-01,標題,abc123,"[{""t"":1,""n"":""雜談""}]"\r\n'

    expect(wrapper.vm.parseCSV(csv)).toEqual([
      { time: '2026-01-01', title: '標題', url: 'abc123', tag: [{ t: 1, n: '雜談' }] },
    ])
  })

  it('regression：CRLF 換行且標籤欄位是空的（尚未標記任何標籤的影片）不應該噴出解析錯誤', () => {
    const wrapper = createWrapper()
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    // 標籤欄位留空，CRLF 換行會讓這個欄位在修正前變成單獨一個 "\r" 字元
    const csv = 'time,title,url,tag\r\n2026-01-01,標題,abc123,\r\n'

    const result = wrapper.vm.parseCSV(csv)

    expect(result).toEqual([
      { time: '2026-01-01', title: '標題', url: 'abc123', tag: [] },
    ])
    expect(warnSpy).not.toHaveBeenCalled()
  })
})
