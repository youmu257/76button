<template>
  <!-- 資訊區塊：顯示標題和社群媒體連結 -->
  <div class="info-block background">
    <!-- 區塊標題 -->
    <p class="fs-3">
      {{ title }}
    </p>

    <!-- 社群媒體連結容器 -->
    <div class="container">
      <!-- 第一列：YouTube, Twitter, Discord -->
      <div class="d-flex flex-wrap justify-content-center">
        <!-- YouTube 連結 -->
        <div class="col">
          <a
            href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往 YouTube 頻道"
          >
            <i
              class="bi bi-youtube"
              aria-hidden="true"
            />
          </a>
        </div>

        <!-- Twitter 連結 -->
        <div class="col">
          <a
            href="https://twitter.com/Chilla_Storia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往 Twitter"
          >
            <i
              class="bi bi-twitter"
              aria-hidden="true"
            />
          </a>
        </div>

        <!-- Discord 連結 -->
        <div class="col">
          <a
            href="https://discord.gg/Y4fp3k2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="加入 Discord 伺服器"
          >
            <i
              class="bi bi-discord"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      <!-- 第二列：Facebook, Plurk, Bluesky -->
      <div class="d-flex flex-wrap justify-content-center">
        <!-- Facebook 連結 -->
        <div class="col">
          <a
            href="https://www.facebook.com/Chilla76?locale=zh_TW"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往 Facebook 粉絲專頁"
          >
            <i
              class="bi bi-facebook"
              aria-hidden="true"
            />
          </a>
        </div>

        <!-- Plurk 連結 -->
        <div class="col">
          <a
            href="https://www.plurk.com/Chilla76"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往 Plurk"
          >
            <img
              width="48"
              height="48"
              style="margin-top: 9px"
              :src="require('@/assets/plurk.png')"
              alt="Plurk"
              loading="lazy"
            >
          </a>
        </div>

        <!-- Bluesky 連結 -->
        <div class="col">
          <a
            href="https://bsky.app/profile/chillastoria.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前往 Bluesky"
          >
            <img
              width="48"
              height="42"
              style="margin-top: 14px"
              src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bluesky_Logo.svg"
              alt="Bluesky"
              loading="lazy"
            >
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * InformationBlock 組件
 *
 * 功能說明：
 * - 顯示標題和社群媒體連結區塊
 * - 包含 YouTube, Twitter, Discord, Facebook, Plurk, Bluesky 等平台連結
 * - 使用 Bootstrap Icons 和自訂圖片
 * - 響應式佈局，自動換行
 *
 * 使用範例：
 * <InformationBlock title="追隨我們" />
 *
 * @component
 */
export default {
  name: 'InformationBlock',
  props: {
    /**
     * 區塊標題
     * 顯示在社群媒體圖示上方的標題文字
     * @type {string}
     */
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
/* YouTube 圖示樣式 */
.info-block .bi-youtube {
  font-size: 3rem;
  color: #f40; /* YouTube 品牌色 */
}

/* Twitter 圖示樣式 */
.info-block .bi-twitter {
  font-size: 3rem;
  color: #0d6efd; /* Twitter 品牌色 */
}

/* Discord 圖示樣式 */
.info-block .bi-discord {
  font-size: 3rem;
  color: #7289d9; /* Discord 品牌色 */
}

/* Facebook 圖示樣式 */
.info-block .bi-facebook {
  font-size: 3rem;
  color: #1877f2; /* Facebook 品牌色 */
}
</style>
