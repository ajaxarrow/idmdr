const authRoutes = [
  {
    path: '/auth',
    name: 'auth',
    // @ts-ignore
    component: () => import('../../modules/auth/views/AuthView.vue'),
  }
]

export default authRoutes