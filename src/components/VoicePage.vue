<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <InformationBlock></InformationBlock>
        <hr>
        <div
            class="background"
            v-for="(item, index) in btnMap"
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
            btnMap: btnList
        }
    },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>