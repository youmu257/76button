<template>
  <div class="container">
    <PageHeader
      ref="pageHeader"
      :msg="msg"
      :img-src="headerImgSrc"
      :title="infoBlockTitle"
    />
    <iframe
      ref="rick-roll"
      :class="{ hidden: !f12push }"
      width="560"
      height="315"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <hr>
    <b>播放規則</b><br>
    語音預設不重疊播放，播放時再次點擊語音按鈕(同一顆或其他顆)會蓋掉原本的聲音<br>
    可以點擊下方按鈕打開重疊播放<br>
    <s>如果覺得太吵</s>可以按<b>空白鍵</b>停止播放(<b>重疊播放時會全部停止</b>)<br>
    備註: 按鈕旁邊有音訊檔來源(Youtube)，如果是推特符號表示為推特音訊(所以沒有記錄檔，想聽更多去追蹤推特)<br>
    <img
      v-for="item in photobombList"
      :key="item.key"
      ref="photobomb"
      class="img-circle"
      height="150"
      weight="150"
      :style="item"
      :src="require('@/assets/photobomb_chilla.png')"
    >
    <button
      class="btn btn-danger"
      @click="switchOverlapPlayback()"
    >
      <input
        type="checkbox"
        :checked="getOverlapPlaybackStatus()"
      >勾選開啟重疊播放
    </button>
    <hr>
    <!-- 語音按鈕區塊 -->
    <div
      v-for="(item, index) in btnDataList"
      id="accordionExample"
      :key="index"
      class="d-flex flex-column background accordion"
    >
      <!-- 亂入王祈菈區塊 -->
      <div
        v-if="item.type == 'photobomb'"
      >
        <h3>
          {{ item.category }}
        </h3>
        <a>
          註: 一次會亂入10隻祈菈，最多200隻祈菈，祈菈會慢慢消失
        </a>
      </div>
      <!-- 正常語音按鈕區塊 -->
      <div
        v-if="item.type != 'photobomb'"
        class="accordion-item"
      >
        <h2 class="accordion-header">
          <button
            type="button"
            class="accordion-button text-center w-100 clickable"
            data-toggle="collapse"
            :data-target="'#collapseRegion_' + index"
            aria-expanded="true"
            :aria-controls="'collapseRegion_' + index"
          >
            <h3>
              {{ item.category }}
            </h3>
          </button>
        </h2>
      </div>
      <div
        :id="'collapseRegion_' + index"
        class="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body">
          <VoiceButton2
            v-for="(btnData, btnIndex) in item.btnList"
            :key="btnIndex"
            :voice-file-name="btnData.fileName"
            :button-name="btnData.btnName"
            :source-url="btnData.sourceUrl"
            :source-type="btnData.sourceType"
            @displayOther="(audio) => item.type == 'photobomb' ? photobombVoice(audio) : displayOtherVoice(audio)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VoiceButton2 from './buttons/VoiceButton2.vue'
import PageHeader from './PageHeader.vue'
import btnList from '../assets/button-list.json'

export default {
  name: 'VoicePage',
  components: {
    VoiceButton2,
    PageHeader,
  },
  props: {
    msg:  {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      btnDataList: btnList,
      playNow: null,
      playNowList: [],
      f12push: false,
      infoBlockTitle: '祈菈的資訊',
      headerImgSrc: 'https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096',
      overlapPlayback: false,
      photobombList: new Map(),
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    }
  },
  created() {
    var self = this
    window.addEventListener('keydown', function(e) {
      if (e.code === 'Space') {
        self.stopPlay(true)
        e.preventDefault()
      } else if (self.f12push == false && e.code === 'F12') {
        // 進入 F12 模式就祈菈搖
        window.scrollTo(0,0)
        self.f12push = true
        self.$refs['rick-roll']['src'] = 'https://www.youtube.com/embed/O1FWa6vRFTA?start=19&autoplay=1&mute=0'
        self.headerImgSrc = require('@/assets/chiila_is_our_wife.png')
        self.infoBlockTitle = '毛主祈萬歲'
        setTimeout(function () {
          console.log('%c請看向左邊祈菈搖', 'color:red; font-size: 50px')
          console.log('%c←←←←←←', 'color:red; font-size: 50px')
        }, 1000)
        setTimeout(function () {
          self.$refs['rick-roll']['src'] = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&rel=0'
          console.log('%c按 F12 想做啥(́◕◞౪◟◕‵)', 'color:black; font-size: 20px')
        }, 5000)
      }
    })
  },
  methods:{
    displayOtherVoice(playVoice) {
      if (this.getOverlapPlaybackStatus()) {
        this.playNowList.push(playVoice)
      } else {
        this.stopPlay()
        this.playNow = playVoice
      }
    },
    photobombVoice(playVoice) {
      // 王祈菈亂入圖產生
      this.displayOtherVoice(playVoice)
      for (var i of Array(10)) {
        this.generatePhotobomb(i)
      }
    },
    generatePhotobomb(num = 1) {
      // 最多 200 張亂入圖
      if (this.photobombList.size > 200) {
        return
      }
      // 產生一張亂入圖
      const x = this.getRandom(100)
      const y = this.getRandom(100)
      const isCenterX = x >= 40 && x <= 50
      const isCenterY = y >= 40 && y <= 50

      const randomX = ((isCenterX ? x - 15 : x) / 100) * this.windowWidth
      const randomY = ((isCenterY ? y - 15 : y) / 100) * this.windowHeight

      // 設定初始樣式
      const mapKey = this.getRandom(99999 + num)
      const positionStyle = `z-index: 10; position: absolute; right: ${randomX}px; top: ${randomY}px;`
      this.photobombList.set(mapKey, positionStyle)

      // 開始倒數動畫
      this.startFadeOut(mapKey, positionStyle)
    },
    startFadeOut(mapKey, baseStyle) {
      const fadeDuration = 3000 // 總消失時間 (毫秒)
      const steps = 10 // 消失過程的步數
      const interval = fadeDuration / steps

      for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
          if (!this.photobombList.has(mapKey)) return // 如果已刪除，直接跳過

          if (i === steps) {
            // 移除圖片
            this.photobombList.delete(mapKey)
          } else {
            // 漸變透明度
            const opacity = (steps - i) / steps
            this.photobombList.set(mapKey, `${baseStyle} opacity: ${opacity};`)
          }
        }, i * interval)
      }
    },
    getRandom(x) {
      return Math.floor(Math.random()*x) + 1
    },
    stopPlay(stopAll = false) {
      if (this.getOverlapPlaybackStatus()) {
        this.stopPlayList()
      } else if (this.playNow != null) {
        this.stopPlayList()
        // 停止播放上一個聲音
        this.playNow.pause()
      }
      // 按空白鍵進入要觸發的事件
      if (stopAll) {
        // 清空亂入圖
        this.photobombList.clear()
      }
    },
    stopPlayList() {
      if (this.playNowList.length == 0) {
        return
      }
      this.playNowList.forEach(function(item) {
        item.pause()
      })
      this.playNowList = []
    },
    getInfoBlockTitle() {
      return this.infoBlockTitle
    },
    getOverlapPlaybackStatus() {
      return this.overlapPlayback
    },
    switchOverlapPlayback() {
      this.overlapPlayback = !this.overlapPlayback
    },
  },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>
<style scoped src="../css/VoiceButton2.css"></style>
<style>
.img-circle{
  border-radius: 50%;
}

.accordion-button h3 {
  flex: 1; /* 確保內部的 h3 填滿按鈕 */
  margin: 0; /* 移除預設外邊距 */
}
</style>