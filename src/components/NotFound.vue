<template>
  <div class="not-found-container">
    <PageHeader
      msg="祈菈‧貝希毛絲博物館"
      :img-src="require('@/assets/esu_chilla.png')"
      title="404 - 找不到這個頁面"
    />
    <hr>

    <div class="not-found-body">
      <p class="not-found-code">
        404
      </p>
      <p class="not-found-message">
        這個網址不存在，可能是連結打錯了，或頁面已經搬家囉
      </p>
      <router-link
        to="/voice"
        class="not-found-link"
      >
        <i class="bi bi-house-door" /> 回到語音按鈕首頁
      </router-link>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'

/**
 * NotFound 組件
 *
 * 用途：
 * - 沒有任何路由匹配時顯示的友善 404 頁面
 * - 提供回到首頁的連結
 *
 * @component
 */
export default {
  name: 'NotFound',
  components: {
    PageHeader,
  },
}
</script>

<style scoped src="../css/NotFound.css"></style>
