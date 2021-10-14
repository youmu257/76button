<template>
    <audio
        :ref="voiceFileName"
        class="sound-play"
        :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
        controls
        preload
        ></audio>
    <div
        :class="'paused toggle-' + voiceFileName"
        pauseStatus @click="play()"
        >{{ buttonName }}</div>
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
<style scoped>
.sound-play {
    display: none;
}
</style>