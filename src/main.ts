import { createApp } from 'vue'
import './style.css'
import vuetify from "./plugins/vuetify.ts";
import PhosphorIcons from "@phosphor-icons/vue";
// @ts-ignore
import App from './App.vue'
const app = createApp(App);

app.use(vuetify);
app.use(PhosphorIcons);
app.mount('#app')
