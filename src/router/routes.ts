// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
import authRoutes from "./routes/auth.routes.ts";
import repositoryRoutes from "./routes/repository.routes.ts";
// @ts-ignore
import DashboardView from "../views/User/DashboardView.vue";
// @ts-ignore
import SettingsView from "../views/User/SettingsView.vue";

export const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  ...authRoutes,
  ...repositoryRoutes
]