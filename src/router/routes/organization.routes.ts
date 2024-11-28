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
    path: '/my-organizations/:slug/experts',
    name: 'my-organization-experts',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsExpertsView.vue'),
  },
  {
    path: '/my-organizations/:slug/reports',
    name: 'my-organization-reports',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsReportsView.vue'),
  },
  {
    path: '/my-organizations/:slug/settings',
    name: 'my-organization-settings',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsSettingsView.vue'),
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
    path: '/my-organizations/new',
    name: 'new-organization-my',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationFormView.vue')
  },
  {
    path: '/my-organizations/edit/:slug',
    name: 'edit-organization-my',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationFormView.vue')
  },
  {
    path: '/my-organizations/:slug/experts/:expert',
    name: 'my-organization-experts-details',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsExpertsDetailsView.vue'),
  },
  {
    path: '/organizations/:slug/settings',
    name: 'organization-settings',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsSettingsView.vue'),
  },
  {
    path: '/organizations/:slug/reports',
    name: 'organization-reports',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsReportsView.vue'),
  },
  {
    path: '/organizations/:slug/experts',
    name: 'organization-experts',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsExpertsView.vue'),
  },
  {
    path: '/organizations/:slug/experts/:expert',
    name: 'organization-experts-details',
    // @ts-ignore
    component: () => import('../../modules/organization/views/OrganizationDetailsExpertsDetailsView.vue'),
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
  },
  {
    path: '/experts/new',
    name: 'new-expert',
    // @ts-ignore
    component: () => import('../../modules/organization/views/ExpertsFormView.vue')
  },
  {
    path: '/experts/edit/:slug',
    name: 'edit-expert',
    // @ts-ignore
    component: () => import('../../modules/organization/views/ExpertsFormView.vue')
  },
  {
    path: '/experts',
    name: 'experts',
    // @ts-ignore
    component: () => import('../../modules/organization/views/ExpertsView.vue')
  },
]

export default organizationRoutes