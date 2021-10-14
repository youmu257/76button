<template>
    <img alt="Vue logo" src="./assets/logo.png">
    <VoicePage msg="祈菈‧貝希毛絲的語音按鈕"/>
</template>

<script>
import VoicePage from './components/VoicePage.vue'

export default {
    name: 'App',
    components: {
        VoicePage,
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
