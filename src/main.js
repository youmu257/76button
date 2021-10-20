import { createApp } from 'vue'
import App from './App.vue'
import VueHead from '@morr/vue3-head'
import 'bootstrap/dist/css/bootstrap.css'

require('@/css/App.css');

createApp(App)
    .use(VueHead)
    .mount('#app')
