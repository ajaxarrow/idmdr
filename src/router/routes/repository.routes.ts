// @ts-ignore
import RepositoriesView from "../../views/Repository/RepositoriesView.vue";
// @ts-ignore
import NewRepositoryView from "../../views/Repository/NewRepositoryView.vue";
// @ts-ignore
import RepositoryDetailsView from "../../views/Repository/RepositoryDetailsView.vue";
// @ts-ignore
import RepositoryDetailsDiscussionView from "../../views/Repository/RepositoryDetailsDiscussionView.vue";
// @ts-ignore
import RepositoryDetailsSettingsView from "../../views/Repository/RepositoryDetailsSettingsView.vue";

const repositoryRoutes = [
  {
    path: '/repositories',
    name: 'repositories',
    component: RepositoriesView
  },
  {
    path: '/repository/new',
    name: 'new-repository',
    component: NewRepositoryView
  },
  {
    path: '/repository/:slug',
    name: 'repository-data',
    component: RepositoryDetailsView
  },
  {
    path: '/repository/:slug/discussions',
    name: 'repository-discussions',
    component: RepositoryDetailsDiscussionView
  },
  {
    path: '/repository/:slug/settings',
    name: 'repository-settings',
    component: RepositoryDetailsSettingsView
  }
]

export default repositoryRoutes