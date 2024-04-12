// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
// @ts-ignore
import authRoutes from "./routes/auth.routes.ts";
// @ts-ignore
import repositoryRoutes from "./routes/repository.routes.ts";
// @ts-ignore
import DashboardView from "../views/User/DashboardView.vue";
// @ts-ignore
import SettingsView from "../views/User/SettingsView.vue";
// @ts-ignore
import MapView from "../views/Map/MapView.vue";
// @ts-ignore
import SectorView from "../views/Sector/SectorView.vue";
import organizationRoutes from "./routes/organization.routes.ts";

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
  {
    path: '/sectors',
    name: 'sectors',
    component: SectorView
  },
  ...authRoutes,
  ...repositoryRoutes,
  ...organizationRoutes
]