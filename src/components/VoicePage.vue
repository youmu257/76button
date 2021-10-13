<template>
    <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
        祈菈的資訊<br>
        <a href="https://www.youtube.com/c/STORIANarrator%E9%81%8A%E6%88%B2%E5%B7%A5%E4%BD%9C%E5%AE%A4/about" target="_blank" rel="noopener">Youtube</a><br>
        <a href="https://twitter.com/Chilla_Storia" target="_blank" rel="noopener">Twitter</a>
    </p>
    <h3>Button</h3>
    <audio ref="subaru-1"
        class="sound-play"
        :src="require('@/assets/sound/subaru-1.mp3')"
        controls
        preload
        ></audio>
    <div class="toggle-subaru-1 paused" @click="play('subaru-1')">播放/暫停1</div>
    <audio ref="subaru-3"
        class="sound-play"
        :src="require('@/assets/sound/subaru-3.mp3')"
        controls
        preload
        ></audio>
    <div class="toggle-subaru-3 paused" @click="play('subaru-3')">播放/暫停3</div>
    </div>
</template>

<script>
export default {
    name: 'VideoPage',
    props: {
        msg: String
    },
    methods: {
        play(id) {
            let audio = this.$refs[id];
            if (audio.paused && document.querySelector(".toggle-" + id).classList.contains("paused")) {
                console.log("play it");
                audio.play();
                document.querySelector(".toggle-" + id).classList.remove("paused");
            } else {
                // TODO: 暫停操作上感覺怪怪的 之後調整
                console.log("pause it");
                audio.pause();
                document.querySelector(".toggle-" + id).classList.add("paused");
            }
        }
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
.sound-play {
    display: none;
}
</style>
