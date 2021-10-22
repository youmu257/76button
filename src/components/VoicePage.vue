<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <img
            height="200"
            src="https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096">
        <InformationBlock></InformationBlock>
        <hr>
        <div
            class="background"
            v-for="(item, index) in btnDataList"
            :key="index">
            <h3>{{ item.category }}</h3>
            <VoiceButton
                v-for="(btnData, index) in item.btnList"
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
        msg: String
    },
    data() {
        return {
            btnDataList: btnList
        }
    },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>