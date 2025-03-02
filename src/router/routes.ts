import authRoutes from "./routes/auth.routes.ts";
import repositoryRoutes from "./routes/repository.routes.ts";
import organizationRoutes from "./routes/organization.routes.ts";
import sectorRoutes from "./routes/sector.routes.ts";

export const routes = [
  {
    path: '/',
    name: 'landing',
    // @ts-ignore
    component: () => import('../modules/public/views/LandingView.vue')
  },
  {
    path: '/seed',
    name: 'seed',
    // @ts-ignore
    component: () => import('../core/views/SeedView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // @ts-ignore
    component: () => import('../modules/public/views/AboutView.vue')
  },
  {
    path: '/stakeholders',
    name: 'stakeholders',
    // @ts-ignore
    component: () => import('../modules/public/views/StakeholdersView.vue')
  },
  {
    path: '/news-updates',
    name: 'news-updates',
    // @ts-ignore
    component: () => import('../modules/public/views/NewsUpdatesView.vue'),
  },
  {
    path: '/news-updates/:slug',
    name: 'news-updates-detail',
    // @ts-ignore
    component: () => import('../modules/public/views/NewsUpdatesDetailsView.vue')
  },
  {
    path: '/help',
    name: 'help',
    // @ts-ignore
    component: () => import('../modules/public/views/HelpCenterView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    // @ts-ignore
    component: () => import('../modules/public/views/ContactsView.vue')
  },
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
    path: '/posts',
    name: 'posts',
    // @ts-ignore
    component: () => import('../modules/posts/views/PostsView.vue')
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
  ...authRoutes,
  ...repositoryRoutes,
  ...organizationRoutes,
  ...sectorRoutes
]