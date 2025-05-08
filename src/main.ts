import './styles/style.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import { createApp } from 'vue'
import vuetify from "./plugins/vuetify.ts";
import PhosphorIcons from "@phosphor-icons/vue";
import router from './router'
import VueApexCharts from "vue3-apexcharts";
// @ts-ignore
import App from './App.vue'
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(PhosphorIcons);
app.use(VueApexCharts);
app.mount('#app')
document.title = `NOMCAARRD - ${import.meta.env.VITE_BASE_API_URL_DJANGO}`;
console.log(import.meta.env.VITE_BASE_API_URL_DJANGO);

