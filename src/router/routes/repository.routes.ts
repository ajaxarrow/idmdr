// @ts-ignore
import RepositoriesView from "../../views/Repository/RepositoriesView.vue";
// @ts-ignore
import NewRepositoryView from "../../views/Repository/NewRepositoryView.vue";
// @ts-ignore
import RepositoryDetailsView from "../../views/Repository/RepositoryDetailsView.vue";

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
    name: 'repository',
    component: RepositoryDetailsView
  }
]

export default repositoryRoutes