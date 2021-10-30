<template>
    <div class="hello">
      <div class="d-flex align-items-center justify-content-center container">
        <img
            class="img-circle"
            height="200"
            src="https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096">
        <div>
          <p class="fs-1">{{ msg }}</p>
          <InformationBlock></InformationBlock>
        </div>
      </div>
        <hr>
        <b>播放規則</b><br>
        語音不重疊播放，播放時再次點擊語音按鈕(同一顆或其他顆)會蓋掉原本的聲音<br>
        另外<b>空白鍵</b>可以停止播放<br>
        <hr>
      <div class="container mb-5">
        <div
            class="d-flex flex-column background"
            v-for="(item, index) in btnDataList"
            :key="index">
          <p class="fs-3 mr-auto">{{ item.category }}</p>
          <div class="d-flex flex-wrap voice-button-block">
            <VoiceButton2
                v-for="(btnData, index) in item.btnList"
                v-on:displayOther = 'displayOtherVoice'
                :key="index"
                :voiceFileName=btnData.fileName
                :buttonName=btnData.btnName
                :sourceUrl=btnData.sourceUrl>
            </VoiceButton2>
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
        msg: String,
    },
    created() {
        var self = this;
        window.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                self.stopPlay();
                e.preventDefault();
            }
        });
    },
    data() {
        return {
            btnDataList: btnList,
            playNow: null,
        }
    },
     methods:{
        displayOtherVoice(playVoice) {
            this.stopPlay();
            this.playNow = playVoice;
        },
        stopPlay() {
            if (this.playNow != null) {
                // 停止播放上一個聲音
                this.playNow.pause();
            }
        },
    },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>
<style>
.img-circle{
  border-radius: 50%;
}
.voice-button-block {
  /*border: 1px solid rgba(0,0,0,0.1);*/
  /*border-top-left-radius: .25rem;*/
  /*border-top-right-radius: .25rem;*/
}
</style>