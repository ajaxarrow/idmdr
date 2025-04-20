const repositoryRoutes = [
  {
    path: '/repositories',
    name: 'repositories',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoriesView.vue')
  },
  {
    path: '/ip-technologies',
    name: 'ip-technologies',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoriesView.vue')
  },
  {
    path: '/my-repositories',
    name: 'my-repositories',
    // @ts-ignore
    component: () => import('../../modules/repository/views/MyRepositoriesView.vue')
  },
  {
    path: '/repositories/new',
    name: 'new-repository',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFormView.vue')
  },
  {
    path: '/repositories/edit/:slug',
    name: 'edit-repository',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFormView.vue')
  },
  {
    path: '/repositories/upload-files/:slug',
    name: 'upload-files-repository',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFilesUpload.vue')
  },
  {
    path: '/my-repositories/new',
    name: 'new-repository-my',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFormView.vue')
  },
  {
    path: '/my-repositories/edit/:slug',
    name: 'edit-repository-my',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFormView.vue')
  },
  {
    path: '/my-repositories/upload-files/:slug',
    name: 'upload-files-repository-my',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryFilesUpload.vue')
  },
  {
    path: '/repositories/:slug',
    name: 'repository-data',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsView.vue')
  },
  {
    path: '/repositories/:slug/discussions',
    name: 'repository-discussions',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionView.vue')
  },
  {
    path: '/repositories/:slug/discussions/:topic',
    name: 'repository-discussions-topic',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionTopicView.vue')
  },
  {
    path: '/repositories/:slug/reports',
    name: 'repository-reports',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsReportsView.vue')
  },
  {
    path: '/repositories/:slug/settings',
    name: 'repository-settings',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsSettingsView.vue')
  },
  {
    path: '/my-repositories/:slug',
    name: 'my-repository-data',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsView.vue')
  },
  {
    path: '/my-repositories/:slug/discussions',
    name: 'my-repository-discussions',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionView.vue')
  },
  {
    path: '/my-repositories/:slug/reports',
    name: 'my-repository-reports',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsReportsView.vue')
  },
  {
    path: '/my-repositories/:slug/discussions/:topic',
    name: 'my-repository-discussions-topic',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsDiscussionTopicView.vue')
  },
  {
    path: '/my-repositories/:slug/settings',
    name: 'my-repository-settings',
    // @ts-ignore
    component: () => import('../../modules/repository/views/RepositoryDetailsSettingsView.vue')
  },
  {
    path: '/my-repositories/:slug/abhs',
    name: 'my-repository-abh',
    // @ts-ignore
    component: () => import('../../modules/abh/views/RepositoryABHView.vue')
  },
  {
    path: '/repositories/:slug/abhs',
    name: 'repository-abh',
    // @ts-ignore
    component: () => import('../../modules/abh/views/RepositoryABHView.vue')
  },
  {
    path: '/abh/:repo/edit/:slug',
    name: 'edit-abh',
    // @ts-ignore
    component: () => import('../../modules/abh/views/ABHFormView.vue')
  },
  {
    path: '/abh/:repo/add',
    name: 'new-abh',
    // @ts-ignore
    component: () => import('../../modules/abh/views/ABHFormView.vue')
  },
  {
    path: '/my-repositories/:repo/abh/:slug',
    name: 'my-abh-details',
    // @ts-ignore
    component: () => import('../../modules/abh/views/RepositoryABHDetailsView.vue')
  },
  {
    path: '/repositories/:repo/abh/:slug',
    name: 'abh-details',
    // @ts-ignore
    component: () => import('../../modules/abh/views/RepositoryABHDetailsView.vue')
  }



]

export default repositoryRoutes