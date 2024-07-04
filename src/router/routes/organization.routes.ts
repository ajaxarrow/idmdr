const organizationRoutes = [
  {
    path: '/organizations',
    name: 'organizations',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationsView.vue')
  },
  {
    path: '/organizations/new',
    name: 'new-organization',
    // @ts-ignore
    component: () => import('../../modules/organization/views/NewOrganizationView.vue')
  },
  {
    path: '/organizations/:slug',
    name: 'organization-data',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsAboutView.vue'),
  },
  {
    path: '/organizations/:slug/repositories',
    name: 'organization-repositories',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsRepositoryView.vue'),
  }
]

export default organizationRoutes