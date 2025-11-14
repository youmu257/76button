<template>
  <button
    v-show="show"
    class="back-to-top"
    @click="scrollToTop"
  >
    <span class="arrow">^</span>
  </button>
</template>

<script>
export default {
  name: 'BackToTop',
  data() {
    return {
      show: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    /**
     * 處理滾動事件，控制按鈕的顯示
     */
    handleScroll() {
      // 當滾動超過 300px 時顯示按鈕
      this.show = window.scrollY > 300
    },
    /**
     * 平滑滾動到頁面頂端
     */
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style scoped src="../css/BackToTop.css"></style>
