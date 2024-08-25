const organizationRoutes = [
  {
    path: '/organizations',
    name: 'organizations',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationsView.vue')
  },
  {
    path: '/my-organizations',
    name: 'my-organizations',
    // @ts-ignore
    component: () => import('../../modules/organization/views/MyOrganizationsView.vue')
  },
  {
    path: '/my-organizations/:slug',
    name: 'my-organization-data',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsAboutView.vue'),
  },
  {
    path: '/my-organizations/:slug/repositories',
    name: 'my-organization-repositories',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsRepositoryView.vue'),
  },
  {
    path: '/organizations/new',
    name: 'new-organization',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationFormView.vue')
  },
  {
    path: '/organizations/edit/:slug',
    name: 'edit-organization',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationFormView.vue')
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