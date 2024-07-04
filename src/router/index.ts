import {createRouter, createWebHistory} from 'vue-router'
import {routes} from "./routes.ts";
import {useLoadingStore} from "../core/stores/progress-bar.store.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

router.beforeEach(() => {
    const {isLoading} = useLoadingStore();
    isLoading.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
})

router.beforeResolve(() => {
    const {isLoading} = useLoadingStore();
    isLoading.value = false;
})


// @ts-ignore
// router.beforeEach((to, from, next) => {
//     const {start} =  useLoadingStore();
//
//     // @ts-ignore
//     if (typeof to.matched[0]?.components.default === 'function') {
//         start() // Start progress bar
//     }
//     next()
// })
//
// // @ts-ignore
// router.beforeResolve((to, from, next) => {
//     const {stop} =  useLoadingStore();
//     stop();
//     next()
// })



export default router