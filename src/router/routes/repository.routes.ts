// @ts-ignore
import RepositoriesView from "../../views/Repository/RepositoriesView.vue";
// @ts-ignore
import NewRepositoryView from "../../views/Repository/NewRepositoryView.vue";

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
]

export default repositoryRoutes