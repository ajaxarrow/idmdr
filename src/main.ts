import './styles/style.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import { createApp } from 'vue'
import vuetify from "./plugins/vuetify.ts";
import PhosphorIcons from "@phosphor-icons/vue";
import router from './router'
// @ts-ignore
import App from './App.vue'
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(PhosphorIcons);
app.mount('#app')
