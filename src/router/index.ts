import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {routes} from "./routes.ts";
import {useLoadingStore} from "../core/stores/progress-bar.store.ts";
import {useAuthStore} from "../modules/auth/stores/auth.store.ts";
import {useMiddleware} from "../middlewares/middlewares.ts";
import {useUserStore} from "../core/stores/user.store.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

const {userData} = useUserStore()

const {handleLogout} = useAuthStore();
const {checkAuth, checkIfAuthenticated} = useMiddleware();
const adminPages = ['/users'];
const protectedUserPages = [
    'my-organization-posts-details', 'my-organization-posts', 'my-organizations', 'new-organization-my', 'edit-organization-my', 'my-organization', 'my-repositories', 'my-organization-data', 'my-organization-settings', 'my-organization-repositories', 'my-repository-data', 'my-repository-settings', 'my-repository-discussions', 'my-repository-discussions-topic', 'my-organization-settings',
]
const protectedPages = [
    'settings', 'settings-account', 'settings-organizations', 'sectors', 'repository-settings', 'organization-settings', 'new-organization', 'edit-organization', 'new-repository', 'edit-repository', 'notifications', 'profile',  'organization-experts', 'my-organization-experts', 'experts', 'edit-expert', 'new-expert', 'posts', 'new-post', 'edit-post', 'post-details', 'organization-events', 'my-organization-events', 'events', 'organization-posts-details', 'organization-post', ...protectedUserPages
];

router.beforeEach(async (to, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    const {isLoading} = useLoadingStore();
    isLoading.value = true;
    window.scrollTo({top: 0, behavior: 'smooth'});

    // if (protectedUserPages.includes(to.name as string) && userData.is_superuser) {
    //     return next({ path: '/' });
    // }

    if (to.name === 'signout') {
        await handleLogout();
        return {name: 'landing'}
    }
    next()
})

router.beforeResolve((to) => {
    if(adminPages.includes(<string>to.path)){
        if(!userData.is_superuser){
            return {name: 'landing'}
        }
    }
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