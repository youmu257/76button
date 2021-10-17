<template>
    <img alt="Vue logo" src="./assets/logo.png">
    <VoicePage msg="祈菈‧貝希毛絲的語音按鈕"/>
    <VoicePageFooter/>
</template>

<script>
import VoicePage from './components/VoicePage.vue'
import VoicePageFooter from './components/VoicePageFooter.vue'

export default {
    name: 'App',
    components: {
        VoicePage,
        VoicePageFooter,
    }
}
</script>
