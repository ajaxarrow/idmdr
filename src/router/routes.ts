import authRoutes from "./routes/auth.routes.ts";
import repositoryRoutes from "./routes/repository.routes.ts";
import organizationRoutes from "./routes/organization.routes.ts";

export const routes = [
  {
    path: '/',
    name: 'landing',
    // @ts-ignore
    component: () => import('../modules/public/views/LandingView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // @ts-ignore
    component: () => import('../modules/public/views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // @ts-ignore
    component: () => import('../modules/user/views/DashboardView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    // @ts-ignore
    component: () => import('../modules/user/views/SettingsOrganizationView.vue')
  },
  {
    path: '/settings/account',
    name: 'settings-account',
    // @ts-ignore
    component: () => import('../modules/user/views/SettingsAccountView.vue')
  },
  {
    path: '/settings/organization',
    name: 'settings-organization',
    // @ts-ignore
    component: () => import('../modules/user/views/SettingsOrganizationView.vue')
  },
  {
    path: '/map',
    name: 'map',
    // @ts-ignore
    component: () => import('../modules/map/views/MapView.vue')
  },
  {
    path: '/sectors',
    name: 'sectors',
    // @ts-ignore
    component: () => import('../modules/sector/views/SectorView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error404',
    // @ts-ignore
    component: () => import('../core/views/Error404View.vue')
  },
  ...authRoutes,
  ...repositoryRoutes,
  ...organizationRoutes
]