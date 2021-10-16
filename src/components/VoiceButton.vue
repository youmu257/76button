<template>
    <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        controls
        preload
        ></audio>
    <a 
        href="#"
        :class="'paused voiceButton toggle-' + voiceFileName"
        pauseStatus
        @click="play()">{{ buttonName }}</a>
</template>
<script>
export default {
    name: 'VoiceButton',
    props: {
        voiceFileName: String,
        buttonName: String,
    },
    methods: {
        play() {
            let audio = this.$refs[this.voiceFileName];
            let classlist = document.querySelector(".toggle-" + this.voiceFileName).classList;
            if (audio.paused && classlist.contains("paused")) {
                console.log("play it");
                audio.play();
                classlist.remove("paused");
            } else {
                console.log("pause it");
                audio.pause();
                classlist.add("paused");
            }
        }
    }
}
</script>
<style scoped src="../css/VoiceButton.css"></style>