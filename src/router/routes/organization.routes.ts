// @ts-ignore
import OrganizationsView from "../../views/Organization/OrganizationsView.vue";
// @ts-ignore
import OrganizationDetailsAboutView from "../../views/Organization/OrganizationDetailsAboutView.vue";
// @ts-ignore
import OrganizationDetailsRepositoryView from "../../views/Organization/OrganizationDetailsRepositoryView.vue";
// @ts-ignore
import NewOrganizationView from "../../views/Organization/NewOrganizationView.vue";

const organizationRoutes = [
  {
    path: '/organizations',
    name: 'organizations',
    component: OrganizationsView
  },
  {
    path: '/organizations/new',
    name: 'new-organization',
    component: NewOrganizationView
  },
  {
    path: '/organizations/:slug',
    name: 'organization-data',
    component: OrganizationDetailsAboutView
  },
  {
    path: '/organizations/:slug/repositories',
    name: 'organization-repositories',
    component: OrganizationDetailsRepositoryView
  }
]

export default organizationRoutes