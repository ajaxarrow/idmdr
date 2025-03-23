const atbiRoutes = [
    {
        path: '/atbi',
        name: 'atbi',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBIIndex.vue')
    },
    {
        path: '/atbi/:slug',
        name: 'atbi-details',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBIDetailsView.vue')
    }
]

export default atbiRoutes;