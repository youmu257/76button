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
            btnMap: [
                {
                    category: "祈哥",
                    btnList: [
                        {
                            fileName: "76-1",
                            btnName: "起司我了",
                            sourceUrl: "https://youtu.be/XDPvn0oDuEI?t=1"
                        },
                        {
                            fileName: "76-2",
                            btnName: "起司我了2",
                            sourceUrl: "https://youtu.be/XDPvn0oDuEI?t=1"
                        }
                    ]
                }
            ]
        }
    },
}
</script>
<style scoped src="../css/VoiceButton.css"></style>