// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
// @ts-ignore
import authRoutes from "./routes/auth.routes.ts";
// @ts-ignore
import repositoryRoutes from "./routes/repository.routes.ts";
// @ts-ignore
import DashboardView from "../views/User/DashboardView.vue";
import SettingsView from "../views/User/SettingsView.vue";
import MapView from "../views/Map/MapView.vue";

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
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
  ...authRoutes,
  ...repositoryRoutes
]