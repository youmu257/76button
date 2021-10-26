<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <audio
                :ref="voiceFileName"
                class="sound-play"
                :src="require('@/assets/sound/' + voiceFileName + '.mp3')"
                controls
                preload
                ></audio>
        </div>
        <div class="panel-body">
            <button
                :class="'voiceButton toggle-' + voiceFileName"
                pauseStatus
                @click="play()">
                {{ buttonName }}
            </button>
        </div>
        <div class="panel-footer">
            <a
                :href="sourceUrl"
                target="_blank"
                class="btn btn-secondary"
                title="來源">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="#FFFFFF"
                    class="bi bi-link"
                    viewBox="0 0 16 16">
                    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"></path>
                    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"></path>
                </svg>
              </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'VoiceButton',
    props: {
        voiceFileName: String,
        buttonName: String,
        sourceUrl: String,
    },
    methods: {
        play() {
            let audio = this.$refs[this.voiceFileName];
            // 傳給 VoicePage 用來停止撥放上一個聲音
            this.$emit('displayOther', audio);
            audio.load();
            audio.play();
        }
    }
}
</script>
<style scoped src="../css/VoiceButton.css"></style>