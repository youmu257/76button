<template>
  <!-- 貢獻者頁面容器 -->
  <div class="contributors-container">
    <!-- 頁面標題 -->
    <PageHeader
      msg="祈菈‧貝希毛絲博物館"
      :img-src="require('@/assets/esu_chilla.png')"
      title="感謝名單"
    />
    <hr>

    <!-- 貢獻者卡片網格 -->
    <div class="contributors-grid">
      <!--
        遍歷貢獻者列表
        使用 index 作為 key（如果資料有 id 欄位，建議改用 contributor.id）
      -->
      <div
        v-for="(contributor, index) in contributorsList"
        :key="contributor.id || index"
        class="contributor-card"
      >
        <!-- 貢獻者資訊內容 -->
        <div class="contributor-info">
          <!-- 貢獻者名稱 -->
          <h3>{{ contributor.name }}</h3>

          <!-- 貢獻項目列表（同一人可能提供多項貢獻） -->
          <ul class="contributor-contributions">
            <li
              v-for="(item, itemIndex) in contributor.contributions"
              :key="itemIndex"
            >
              <p>{{ item.text }}</p>
              <!-- 外部連結（如果有提供） -->
              <!-- rel="noopener noreferrer" 防止安全漏洞 -->
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="contributor-link"
                :aria-label="`前往 ${contributor.name} 的 ${item.linkText || '連結'}`"
              >
                {{ item.linkText }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader.vue'
import contributorsList from '@/assets/contributors-list.json'

/**
 * ContributorsPage 組件
 *
 * 功能說明：
 * - 顯示專案貢獻者列表
 * - 以卡片網格形式呈現貢獻者資訊
 * - 同一人可能有多項貢獻，每項各自可帶外部連結
 * - 資料來源為 JSON 檔案，方便維護更新
 *
 * 資料結構範例（contributors-list.json）：
 * [
 *   {
 *     "name": "貢獻者名稱",
 *     "contributions": [
 *       {
 *         "text": "貢獻描述",
 *         "link": "https://example.com",
 *         "linkText": "查看作品"
 *       }
 *     ]
 *   }
 * ]
 *
 * @component
 */
export default {
  name: 'ContributorsPage',
  components: {
    PageHeader,
  },
  data() {
    return {
      /**
       * 貢獻者列表資料
       * 從 JSON 檔案中匯入
       * 每筆包含貢獻者名稱與一組貢獻項目
       * @type {Array<Object>}
       */
      contributorsList,
    }
  },
}
</script>

<!-- 引入外部樣式表 -->
<!-- scoped 確保樣式只作用於此組件 -->
<style scoped src="../css/ContributorsPage.css"></style>
