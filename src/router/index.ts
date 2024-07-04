import {createRouter, createWebHistory} from 'vue-router'
import {routes} from "./routes.ts";
import $eventHub from '../core/utils/eventHub.ts'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

// @ts-ignore
router.beforeEach((to, from, next) => {
    // @ts-ignore
    if (typeof to.matched[0]?.components.default === 'function') {
        $eventHub.$emit('asyncComponentLoading', to) // Start progress bar
    }
    next()
})

// @ts-ignore
router.beforeResolve((to, from, next) => {
    $eventHub.$emit('asyncComponentLoaded') // Stop progress bar
    next()
})

export default router