const sectorRoutes = [
  {
    path: '/sector-tagging',
    name: 'sector-tagging',
    // @ts-ignore
    component: () => import('../../modules/sector/views/SectorView.vue'),
  },
  {
    path: '/sectors/new',
    name: 'new-sector',
    // @ts-ignore
    component: () => import('../../modules/sector/views/SectorFormView.vue')
  },
  {
    path: '/sectors/edit/:slug',
    name: 'edit-sector',
    // @ts-ignore
    component: () => import('../../modules/sector/views/SectorFormView.vue')
  },
  {
    path: '/my-sectors/new',
    name: 'new-sector-my',
    // @ts-ignore
    component: () => import('../../modules/sector/views/SectorFormView.vue')
  },
  {
    path: '/my-sectors/edit/:slug',
    name: 'edit-sector-my',
    // @ts-ignore
    component: () => import('../../modules/sector/views/SectorFormView.vue')
  }
];

export default sectorRoutes