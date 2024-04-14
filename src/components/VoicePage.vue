<template>
  <div class="hello">
    <div class="d-flex flex-wrap align-items-center justify-content-center container">
      <img
        ref="img-circle"
        class="img-circle"
        height="200"
        src="https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096"
      >
      <div>
        <p class="fs-1 py-1">
          {{ msg }}
        </p>
        <InformationBlock :title="getInfoBlockTitle()" />
      </div>
    </div>
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
    <div class="container mb-5">
      <div
        v-for="(item, index) in btnDataList"
        :key="index"
        class="d-flex flex-column background"
      >
        <p class="fs-3">
          {{ item.category }}
        </p>
        <a v-if="item.type == 'photobomb'">
          註: 一次會亂入10隻祈菈，最多200隻祈菈，祈菈會慢慢消失
        </a>
        <div class="d-flex flex-wrap justify-content-center">
          <VoiceButton2
            v-for="(btnData, btnIndex) in item.btnList"
            :key="btnIndex"
            :voice-file-name="btnData.fileName"
            :button-name="btnData.btnName"
            :source-url="btnData.sourceUrl"
            :source-type="btnData.sourceType"
            @displayOther="item.type == 'photobomb' ? photobombVoice() : displayOtherVoice()"
          />
        </div>
        <hr v-if="index !== btnDataList.length - 1">
      </div>
    </div>
  </div>
</template>

<script>
import VoiceButton2 from './buttons/VoiceButton2.vue'
import InformationBlock from './InformationBlock.vue'
import btnList from '../assets/button-list.json'

export default {
  name: 'VoicePage',
  components: {
    VoiceButton2,
    InformationBlock,
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
        window.scrollTo(0,0)
        self.f12push = true
        self.$refs['rick-roll']['src'] = 'https://www.youtube.com/embed/O1FWa6vRFTA?start=19&autoplay=1&mute=0'
        self.$refs['img-circle']['src'] = 'https://media.discordapp.net/attachments/833581544223277068/901992965227048980/a945144c73db5c24.png'
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
      let x = this.getRandom(100)
      let y = this.getRandom(100)
      let positionStyle = 'z-index:10;position: absolute;'
      let centerX = x >= 40 && x <= 50
      let centerY = y >= 40 && y <= 50
      let randomX = ((centerX ? x - 15 : x)/100) * this.windowWidth
      let randomY = ((centerY ? y - 15 : y)/100) * this.windowHeight
      positionStyle += 'right:'+randomX+'px; top: '+randomY+'px;'

      let mapKey = this.getRandom(99999 + num)
      this.photobombList.set(mapKey, positionStyle)
      let styleNow = positionStyle
      let self = this
      for (let time = 10; time >= 0; time--) {
        setTimeout(function() {
          if (self.photobombList.has(mapKey) == false) {
            return
          }
          if (time == 0) {
            // 秒數倒數結束後移除圖片
            self.photobombList.delete(mapKey)
          } else {
            // 讓圖片慢慢變透明
            self.photobombList.set(mapKey, styleNow + 'opacity:' + (time / 10))
          }
        }, 300 * (10 - time))
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
</style>