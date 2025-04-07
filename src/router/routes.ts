import authRoutes from "./routes/auth.routes.ts";
import repositoryRoutes from "./routes/repository.routes.ts";
import organizationRoutes from "./routes/organization.routes.ts";
import sectorRoutes from "./routes/sector.routes.ts";
import postRoutes from "./routes/post.routes.ts";
import publicRoutes from "./routes/public.routes.ts";
import atbiRoutes from "./routes/atbi.routes.ts";
import adminRoutes from "./routes/admin.routes.ts";

export const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    // @ts-ignore
    component: () => import('../modules/user/views/DashboardView.vue')
  },
  {
    path: '/notifications',
    name: 'notifications',
    // @ts-ignore
    component: () => import('../modules/user/views/NotificationsView.vue')
  },
  {
    path: '/events',
    name: 'events',
    // @ts-ignore
    component: () => import('../modules/events/views/CalendarView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    // @ts-ignore
    component: () => import('../modules/user/views/UserProfileView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    // @ts-ignore
    component: () => import('../modules/user/views/SettingsAccountView.vue')
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
    component: () => import('../modules/sector/views/SectorView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error404',
    // @ts-ignore
    component: () => import('../core/views/Error404View.vue')
  },
  {
    path: '/signout',
    name: 'signout',
    // @ts-ignore
    component: () => import('../core/views/Error404View.vue')
  },
  ...publicRoutes,
  ...authRoutes,
  ...repositoryRoutes,
  ...organizationRoutes,
  ...sectorRoutes,
  ...postRoutes,
  ...atbiRoutes,
  ...adminRoutes
]