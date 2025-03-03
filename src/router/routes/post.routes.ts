const postRoutes = [
  {
    path: '/posts',
    name: 'posts',
    // @ts-ignore
    component: () => import('../../modules/posts/views/PostsView.vue')
  },
  {
    path: '/posts/new',
    name: 'new-post',
    // @ts-ignore
    component: () => import('../../modules/posts/views/PostFormView.vue')
  },
  {
    path: '/posts/edit/:slug',
    name: 'edit-post',
    // @ts-ignore
    component: () => import('../../modules/posts/views/PostFormView.vue')
  },
]

export default postRoutes;