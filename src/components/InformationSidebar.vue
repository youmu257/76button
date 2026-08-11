<template>
  <!-- 社群媒體連結容器 -->
  <div class="social-media-container">
    <!-- YouTube 連結 -->
    <a
      href="https://www.youtube.com/@ChillaBehemos"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 YouTube 頻道"
      class="social-link"
    >
      <i
        class="bi bi-youtube"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >YouTube</span>
    </a>

    <!-- 官方網站連結 -->
    <a
      href="https://lit.link/zh-tw/ChillaBehamos"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="lit.link"
      class="social-link"
    >
      <img
        width="32"
        height="32"
        src="https://lit.link/favicon.ico"
        alt="lit.link"
        loading="lazy"
      >
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >官方網站</span>
    </a>

    <!-- Twitch 連結 -->
    <a
      href="https://www.twitch.tv/vtuberchilla76"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Twitch 頻道"
      class="social-link"
    >
      <i
        class="bi bi-twitch"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Twitch</span>
    </a>

    <!-- Twitter 連結 -->
    <a
      href="https://x.com/ChillaBehemos"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Twitter"
      class="social-link"
    >
      <i
        class="bi bi-twitter"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >X (Twitter)</span>
    </a>

    <!-- Discord 連結 -->
    <a
      href="https://discord.gg/cAhnWs9a"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="加入 Discord 伺服器"
      class="social-link"
    >
      <i
        class="bi bi-discord"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Discord</span>
    </a>

    <!-- Facebook 粉絲專頁連結 -->
    <a
      href="https://www.facebook.com/Chilla76?locale=zh_TW"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Facebook 粉絲專頁"
      class="social-link"
    >
      <i
        class="bi bi-facebook"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Facebook</span>
    </a>

    <!-- Facebook 毛絲專頁連結 -->
    <a
      href="https://www.facebook.com/mao.si.924237/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Facebook 毛絲專頁"
      class="social-link"
    >
      <i
        class="bi bi-facebook"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Facebook</span>
    </a>

    <!-- Plurk 連結 -->
    <a
      href="https://www.plurk.com/Chilla76"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Plurk"
      class="social-link"
    >
      <img
        width="32"
        height="32"
        :src="require('@/assets/plurk.png')"
        alt="Plurk"
        loading="lazy"
      >
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Plurk</span>
    </a>

    <!-- Bluesky 連結 -->
    <a
      href="https://bsky.app/profile/chillabehemos.bsky.social"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往 Bluesky"
      class="social-link"
    >
      <img
        width="32"
        height="32"
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bluesky_Logo.svg"
        alt="Bluesky"
        loading="lazy"
      >
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >Bluesky</span>
    </a>

    <!-- 買動漫連結 -->
    <a
      href="https://www.myacg.com.tw/seller_market.php?seller=244163"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往買動漫"
      class="social-link"
    >
      <img
        width="32"
        height="32"
        src="https://cdn.myacg.com.tw/images/favicon.ico"
        alt="MyACG"
        loading="lazy"
      >
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >買動漫</span>
    </a>

    <!-- 三視圖連結 -->
    <a
      href="https://bsky.app/profile/chillabehemos.bsky.social/post/3l6p664qkim25"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Views of Objects"
      class="social-link"
    >
      <img
        width="32"
        height="32"
        src="https://chilla76cheese.com/favicon.ico"
        alt="Views of Objects"
        loading="lazy"
      >
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >三視圖</span>
    </a>

    <!-- 舊 YouTube 頻道連結 -->
    <a
      href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="前往舊 YouTube 頻道"
      class="social-link"
    >
      <i
        class="bi bi-youtube"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >舊 YT 頻道</span>
    </a>

    <!-- 舊 Discord 連結 -->
    <a
      href="https://discord.gg/Y4fp3k2"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="加入 Discord 伺服器"
      class="social-link"
    >
      <i
        class="bi bi-discord"
        aria-hidden="true"
      />
      <span
        v-if="isSidebarOpen"
        class="social-name"
      >舊 DC</span>
    </a>
  </div>
</template>

<script>
/**
 * InformationSidebar 組件
 *
 * 用途：
 * - 顯示社群媒體連結
 * - 支援側邊欄收合狀態，動態顯示/隱藏社群名稱
 *
 * @component
 * @prop {Boolean} isSidebarOpen - 側邊欄是否展開
 */
export default {
  name: 'InformationSidebar',

  props: {
    /**
     * 側邊欄開啟狀態
     * @type {Boolean}
     * @required
     */
    isSidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style scoped src="../css/CollapseSidebar.css"></style>
