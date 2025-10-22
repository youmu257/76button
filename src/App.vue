<template>
  <div
    id="app"
    :class="{ 'content-shifted': isSidebarOpen }"
  >
    <CollapseSidebar @sidebar-toggle="handleSidebarToggle" />
    <div class="main-content">
      <!-- 用於渲染路由對應的組件 -->
      <router-view v-bind="{ msg: getTitle() }" />
      <VoicePageFooter />
    </div>
  </div>
</template>

<script>
import { createRouter, createWebHashHistory } from 'vue-router'
import CollapseSidebar from './components/CollapseSidebar.vue'
import VoicePage from './components/VoicePage.vue'
import FeedbackForm from './components/FeedbackForm.vue'
import ContributorsPage from './components/ContributorsPage.vue'
import TimelinePage from './components/Timeline.vue'
import VoicePageFooter from './components/VoicePageFooter.vue'

export default {
  name: 'App',
  components: {
    CollapseSidebar,
    VoicePageFooter,
  },
  data() {
    return {
      chillaTitle: '祈菈‧貝希毛絲博物館',
      chillaContent: '純粹推廣可愛帥氣迷人性感的遜炮毛絲鼠用',
      chillaPicture: 'https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096',
      isSidebarOpen: true,
    }
  },
  head() {
    return {
      // creates a title tag in header.
      title() {
        return {
          inner: this.getTitle(),
        }
      },
      meta: [
        // creates a meta description tag in header.
        { name: 'description', content: this.getTitle(), id: 'desc' },
        // Twitter
        { name: 'twitter:title', content: this.getTitle() },
        { name: 'twitter:description', content: this.getContent() },

        // Google+ / Schema.orgthis.title'Content Title' },
        { itemprop: 'description', content: this.getContent() },

        // Facebook / Open Graph
        { property: 'og:title', content: this.getTitle() },
        { property: 'og:description', content: this.getContent() },
        { property: 'og:image', content: this.getPicture() },
      ],
      // link tags
      link: [
        { rel: 'canonical', href: 'http://example.com/#!/contact/', id: 'canonical' },
        { rel: 'author', href: 'Leo Li(達克鴨子)', undo: false }, // undo property - not to remove the element
      ],
    }
  },
  created() {
    var self = this
    window.addEventListener('keydown', function (e) {
      if (e.code === 'F12') {
        self.chillaTitle = '歡迎加入大鼠維埃共婆黨'
      }
    })
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init: function () {
      console.log('%c祈菈我婆', 'color:red; font-size: 50px')
    },
    getTitle: function () {
      return this.chillaTitle
    },
    getContent: function () {
      return this.chillaContent
    },
    getPicture: function () {
      return this.chillaPicture
    },
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen
    },
  },
}

// 路由配置
const routes = [
  { path: '/', component: VoicePage }, // 預設路徑
  { path: '/voice', component: VoicePage },
  { path: '/feedback', component: FeedbackForm },
  { path: '/contributors', component: ContributorsPage },
  { path: '/timeline', component: TimelinePage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router }
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main-content {
  transition: margin-left 0.3s ease;
  margin-left: 60px; /* 預設邊距等於折疊側邊欄寬度 */
}

.content-shifted .main-content {
  margin-left: 250px; /* 側邊欄打開時的邊距 */
}
</style>
