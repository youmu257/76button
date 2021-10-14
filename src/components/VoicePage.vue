<template>
    <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
        祈菈的資訊<br>
        <a href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about" target="_blank" rel="noopener">Youtube</a><br>
        <a href="https://twitter.com/Chilla_Storia" target="_blank" rel="noopener">Twitter</a>
    </p>
    <h3>Button</h3>
    <VoiceButton
        voiceFileName="subaru-1"
        buttonName="語音1" />
    <VoiceButton
        voiceFileName="subaru-3"
        buttonName="語音3" />
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
    }
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
</style>
