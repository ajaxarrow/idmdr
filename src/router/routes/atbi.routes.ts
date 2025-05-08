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
    },
    {
        path: '/atbi/new/',
        name: 'new-atbi',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBIForm.vue')
    },
    {
        path: '/atbi/edit/:slug',
        name: 'edit-atbi',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBIForm.vue')
    },
    {
        path: '/atbi/:atbi/:type/add',
        name: 'new-atbi-entity',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBISubEntityForm.vue')
    },
    {
        path: '/atbi/:atbi/:type/edit/:slug',
        name: 'edit-atbi-entity',
        // @ts-ignore
        component: () => import('../../modules/atbi/views/ATBISubEntityForm.vue')
    },

]

export default atbiRoutes;