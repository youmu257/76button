import { shallowMount } from '@vue/test-utils'
import TagSummarySearch from '@/components/TagSummarySearch.vue'

// mounted() 會呼叫 loadFilterOptions() 去抓 CSV，這裡讓它一直 pending，
// 這樣測試只驗證 applyVideoTagsCsv 這個純解析/統計方法，不會真的觸發任何網路行為。
jest.mock('@/utils/csvCache', () => ({
  readCsvCache: jest.fn(() => null),
  fetchCsvFresh: jest.fn(() => new Promise(() => {})),
}))

describe('TagSummarySearch applyVideoTagsCsv', () => {
  it('正常統計每種類型標籤的出現次數', () => {
    const wrapper = shallowMount(TagSummarySearch)
    const csv = [
      'time,title,url,tag',
      '2026-01-01,標題1,abc123,"[{""t"":1,""n"":""雜談""}]"',
      '2026-01-02,標題2,def456,"[{""t"":1,""n"":""雜談""},{""t"":4,""n"":""祈菈""}]"',
    ].join('\n')

    wrapper.vm.applyVideoTagsCsv(csv)

    expect(wrapper.vm.streamTypes).toEqual([{ name: '雜談', count: 2 }])
    expect(wrapper.vm.characters).toEqual([{ name: '祈菈', count: 1 }])
  })

  it('regression：CRLF 換行且某列標籤欄位是空的，不會中斷後續列的統計', () => {
    const wrapper = shallowMount(TagSummarySearch)
    // 第一列標籤欄位留空（尚未標記），第二列有正常標籤，CRLF 換行
    const csv = [
      'time,title,url,tag',
      '2026-01-01,標題1,abc123,',
      '2026-01-02,標題2,def456,"[{""t"":1,""n"":""雜談""}]"',
    ].join('\r\n')

    expect(() => wrapper.vm.applyVideoTagsCsv(csv)).not.toThrow()
    expect(wrapper.vm.streamTypes).toEqual([{ name: '雜談', count: 1 }])
  })
})
