import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {routes} from "./routes.ts";
import {useLoadingStore} from "../core/stores/progress-bar.store.ts";
import {useAuthStore} from "../modules/auth/stores/auth.store.ts";
import {useMiddleware} from "../middlewares/middlewares.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

const {handleLogout} = useAuthStore();
const {checkAuth, checkIfAuthenticated} = useMiddleware();
const protectedPages = [
    'settings', 'my-organizations', 'settings-account', 'settings-organizations', 'sectors', 'repository-settings', 'my-organization-settings', 'organization-settings', 'new-organization', 'edit-organization', 'new-organization-my', 'edit-organization-my', 'new-repository', 'edit-repository', 'notifications',
];

router.beforeEach(async (to, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    const {isLoading} = useLoadingStore();
    isLoading.value = true;
    window.scrollTo({top: 0, behavior: 'smooth'});

    if (to.name === 'signout') {
        await handleLogout();
        return {name: 'landing'}
    }
    next()
})

router.beforeResolve((to) => {
    if (protectedPages.includes(<string>to.name)) {
        checkIfAuthenticated();
    }
    if(to.name === 'auth'){
        checkAuth();
    }
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