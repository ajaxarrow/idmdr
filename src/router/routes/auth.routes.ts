const authRoutes = [
  {
    path: '/auth',
    name: 'auth',
    // @ts-ignore
    component: () => import('../../modules/auth/views/AuthView.vue'),
  },
  {
    path: '/auth/email',
    name: 'auth-email',
    // @ts-ignore
    component: () => import('../../modules/auth/views/AuthEmailView.vue'),
  }
]

export default authRoutes