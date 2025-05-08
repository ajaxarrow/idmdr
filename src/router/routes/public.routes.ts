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
        path: '/raise',
        name: 'raise',
        // @ts-ignore
        component: () => import('../../modules/public/views/RAISEView.vue')
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
        path: '/directors',
        name: 'directors',
        // @ts-ignore
        component: () => import('../../modules/public/views/Directors.vue')
    },
    {
        path: '/cmis',
        name: 'cmi',
        // @ts-ignore
        component: () => import('../../modules/public/views/CMIsView.vue')
    },
    {
        path: '/cmis/:slug',
        name: 'cmi-data',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsAboutView.vue')
    },
    {
        path: '/cmis/:slug/events',
        name: 'cmi-events',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsEventsView.vue'),
    },
    {
        path: '/cmis/:slug/repositories',
        name: 'cmi-repositories',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsRepositoryView.vue'),
    },
    {
        path: '/cmis/:slug/experts',
        name: 'cmi-experts',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsExpertsView.vue'),
    },
    {
        path: '/cmis/:slug/posts',
        name: 'cmi-posts',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsPostView.vue'),
    },
    {
        path: '/cmis/:slug/reports',
        name: 'cmi-reports',
        // @ts-ignore
        component: () => import('../../modules/organization/views/OrganizationDetailsReportsView.vue'),
    },
    {
        path: '/about-kmhub',
        name: 'about-kmhub',
        // @ts-ignore
        component: () => import('../../modules/public/views/AboutLINNKSView.vue')
    },
]

export default publicRoutes