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
    },
    data() {
        return {
            ChinchillaTitle: "祈菈‧貝希毛絲的語音按鈕",
            ChinchillaContent: "純粹推廣可愛帥氣迷人性感的遜炮毛絲鼠用",
            ChinchillaPicture: "https://pbs.twimg.com/media/FAss4LSVkAIm7hV?format=jpg&name=4096x4096"
        }
    },
    head() {
        return {
            // creates a title tag in header.
            title() {
                return {
                    inner: this.getTitle()
                }
            },
            meta: [
                // creates a meta description tag in header.
                { name: 'description', content: this.getTitle(), id: 'desc' },
                // Twitter
                { name: 'twitter:title', content: this.getTitle() },
                { name: 'twitter:description', content: this.getContent() },

                // Google+ / Schema.orgthis.title'Content Title' },
                { itemprop: 'description', content: this.getContent() },

                // Facebook / Open Graph
                { property: 'og:title', content: this.getTitle() },
                { property: 'og:description', content: this.getContent() },
                { property: 'og:image', content: this.getPicture() },
            ],
            // link tags
            link: [
                { rel: 'canonical', href: 'http://example.com/#!/contact/', id: 'canonical' },
                { rel: 'author', href: 'Leo Li(達克鴨子)', undo: false }, // undo property - not to remove the element 
            ],
        }
    },
    methods: {
        init: function() {
            console.log("%c祈菈我婆", "color:red; font-size: 50px");
        },
        getTitle: function() {
            return this.ChinchillaTitle;
        },
        getContent: function() {
            return this.ChinchillaContent;
        },
        getPicture: function() {
            return this.ChinchillaPicture;
        }
    },
    beforeMount() {
        this.init()
    },
}
</script>