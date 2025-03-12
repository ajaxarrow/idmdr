const publicRoutes = [
    {
        path: '/',
        name: 'landing',
        // @ts-ignore
        component: () => import('../../modules/public/views/LandingView.vue')
    },
    {
        path: '/about',
        name: 'about',
        // @ts-ignore
        component: () => import('../../modules/public/views/AboutView.vue')
    },
    {
        path: '/stakeholders',
        name: 'stakeholders',
        // @ts-ignore
        component: () => import('../../modules/public/views/StakeholdersView.vue')
    },
    {
        path: '/news-updates',
        name: 'news-updates',
        // @ts-ignore
        component: () => import('../../modules/public/views/NewsUpdatesView.vue'),
    },
    {
        path: '/news-updates/:slug',
        name: 'news-updates-detail',
        // @ts-ignore
        component: () => import('../../modules/public/views/NewsUpdatesDetailsView.vue')
    },
    {
        path: '/help',
        name: 'help',
        // @ts-ignore
        component: () => import('../../modules/public/views/HelpCenterView.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        // @ts-ignore
        component: () => import('../../modules/public/views/ContactsView.vue')
    },
    {
        path: '/kmhub',
        name: 'kmhub',
        // @ts-ignore
        component: () => import('../../modules/public/views/LINNKSView.vue')
    },
    {
        path: '/cmis',
        name: 'cmi',
        // @ts-ignore
        component: () => import('../../modules/public/views/CMIsView.vue')
    },
    {
        path: '/cmis/:slug',
        name: 'cmi-details',
        // @ts-ignore
        component: () => import('../../modules/public/views/CMIDetailsView.vue')
    },
    {
        path: '/about-kmhub',
        name: 'about-kmhub',
        // @ts-ignore
        component: () => import('../../modules/public/views/AboutLINNKSView.vue')
    },
]

export default publicRoutes