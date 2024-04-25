// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
// @ts-ignore
import authRoutes from "./routes/auth.routes.ts";
// @ts-ignore
import repositoryRoutes from "./routes/repository.routes.ts";
// @ts-ignore
import DashboardView from "../views/User/DashboardView.vue";
// @ts-ignore
import MapView from "../views/Map/MapView.vue";
// @ts-ignore
import SectorView from "../views/Sector/SectorView.vue";
import organizationRoutes from "./routes/organization.routes.ts";
// @ts-ignore
import SettingsOrganizationView from "../views/User/SettingsOrganizationView.vue";
// @ts-ignore
import SettingsAccountView from "../views/User/SettingsAccountView.vue";
// @ts-ignore
import Error404View from "../views/Public/Error404View.vue";

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
    component: SettingsOrganizationView
  },
  {
    path: '/settings/account',
    name: 'settings-account',
    component: SettingsAccountView
  },
  {
    path: '/settings/organization',
    name: 'settings-organization',
    component: SettingsOrganizationView
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
  {
    path: '/:pathMatch(.*)*',
    name: 'error404',
    component: Error404View
  },
  ...authRoutes,
  ...repositoryRoutes,
  ...organizationRoutes
]