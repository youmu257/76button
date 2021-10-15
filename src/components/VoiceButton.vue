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
<style scoped>
.sound-play {
    display: none;
}

.voiceButton {
	box-shadow: 3px 4px 0px 0px #1564ad;
	background:linear-gradient(to bottom, #79bbff 5%, #378de5 100%);
	background-color:#79bbff;
	border-radius:5px;
	border:1px solid #337bc4;
	display:inline-block;
	cursor:pointer;
    margin: 20px;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	font-weight:bold;
	padding:12px 44px;
	text-decoration:none;
	text-shadow:0px 1px 0px #528ecc;
}

.voiceButton:hover {
	background:linear-gradient(to bottom, #378de5 5%, #79bbff 100%);
	background-color:#378de5;
}

.voiceButton:active {
	position:relative;
	top:1px;
}
</style>