const adminRoutes = [
    {
        path: '/users',
        name: 'users',
        // @ts-ignore
        component: () => import('../../modules/admin/views/UsersView.vue'),
    }
]

export default adminRoutes