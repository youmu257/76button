import { mount } from '@vue/test-utils'
import BackToTop from '@/components/BackToTop.vue'

// jsdom 的 window.scrollY 預設是唯讀 getter，測試時用 defineProperty 覆寫來模擬捲動位置
function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

afterEach(() => {
  setScrollY(0)
})

it('初始渲染時按鈕是隱藏的', () => {
  const wrapper = mount(BackToTop)

  expect(wrapper.find('button').isVisible()).toBe(false)
})

it('捲動超過 300px 後按鈕會顯示', async () => {
  const wrapper = mount(BackToTop)

  setScrollY(400)
  window.dispatchEvent(new Event('scroll'))
  await wrapper.vm.$nextTick()

  expect(wrapper.find('button').isVisible()).toBe(true)
})

it('捲動幅度未超過 300px 時按鈕維持隱藏', async () => {
  const wrapper = mount(BackToTop)

  setScrollY(150)
  window.dispatchEvent(new Event('scroll'))
  await wrapper.vm.$nextTick()

  expect(wrapper.find('button').isVisible()).toBe(false)
})

it('點擊按鈕會平滑捲動回頁面頂端', async () => {
  const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const wrapper = mount(BackToTop)

  setScrollY(400)
  window.dispatchEvent(new Event('scroll'))
  await wrapper.vm.$nextTick()
  await wrapper.find('button').trigger('click')

  expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
})

it('卸載後應該移除 scroll 監聽器，避免記憶體洩漏', () => {
  const addSpy = jest.spyOn(window, 'addEventListener')
  const removeSpy = jest.spyOn(window, 'removeEventListener')
  const wrapper = mount(BackToTop)

  const [, handler] = addSpy.mock.calls.find(([eventName]) => eventName === 'scroll')
  wrapper.unmount()

  expect(removeSpy).toHaveBeenCalledWith('scroll', handler)
})
