<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <img
            height="200"
            src="https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096">
        <InformationBlock></InformationBlock>
        <hr>
        <b>播放規則</b><br>
        語音不重疊播放，播放時再次點擊語音按鈕(同一顆或其他顆)會蓋掉原本的聲音<br>
        另外<b>空白鍵</b>可以停止播放<br>
        <hr>
        <div
            class="background"
            v-for="(item, index) in btnDataList"
            :key="index">
            <h3>{{ item.category }}</h3>
            <VoiceButton
                v-for="(btnData, index) in item.btnList"
                v-on:displayOther = 'displayOtherVoice'
                :key="index"
                :voiceFileName=btnData.fileName
                :buttonName=btnData.btnName
                :sourceUrl=btnData.sourceUrl>
            </VoiceButton>
        </div>
    </div>
</template>

<script>
import VoiceButton from './VoiceButton.vue'
import InformationBlock from './InformationBlock.vue'
import btnList from '../assets/button-list.json'

export default {
    name: 'VoicePage',
    components: {
        VoiceButton,
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