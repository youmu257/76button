<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <p>
            祈菈的資訊<br>
            <a href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about" target="_blank" rel="noopener">Youtube</a><br>
            <a href="https://twitter.com/Chilla_Storia" target="_blank" rel="noopener">Twitter</a>
        </p>
        <div
            class="background"
            v-for="(item, index) in btnMap"
            :key="index">
            <h3>{{ item.category }}</h3>
            <VoiceButton
                v-for="(btnData, index) in item.btnList"
                :key="index"
                :voiceFileName=btnData.fileName
                :buttonName=btnData.btnName>
            </VoiceButton>
        </div>
    </div>
</template>

<script>
import VoiceButton from './VoiceButton.vue'

export default {
    name: 'VoicePage',
    components: {
        VoiceButton
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
                            btnName: "起司我了"
                        },
                        {
                            fileName: "76-2",
                            btnName: "起司我了2"
                        }
                    ]
                },
            ]
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
.background {
    background-color:#70e4d0;
    padding:10px;
    margin-bottom:5px;
    border:2px #ccc solid;
    border-radius:10px;
}
</style>
