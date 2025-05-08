const adminRoutes = [
    {
        path: '/users',
        name: 'users',
        // @ts-ignore
        component: () => import('../../modules/admin/views/UsersView.vue'),
    }, {
        path: '/e-library',
        name: 'e-library',
        // @ts-ignore
        component: () => import('../../modules/repository/views/RepositoriesView.vue'),
    }
]

export default adminRoutes