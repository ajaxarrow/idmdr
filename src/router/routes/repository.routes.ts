const repositoryRoutes = [
  {
    path: '/repositories',
    name: 'repositories',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoriesView.vue')
  },
  {
    path: '/repository/new',
    name: 'new-repository',
    // @ts-ignore
    component: () => import('../../modules/repository/views/NewRepositoryView.vue')
  },
  {
    path: '/repository/:slug',
    name: 'repository-data',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsView.vue')
  },
  {
    path: '/repository/:slug/discussions',
    name: 'repository-discussions',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionView.vue')
  },
  {
    path: '/repository/:slug/discussions/:topic',
    name: 'repository-discussions-topic',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionTopicView.vue')
  },
  {
    path: '/repository/:slug/settings',
    name: 'repository-settings',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsSettingsView.vue')
  }
]

export default repositoryRoutes