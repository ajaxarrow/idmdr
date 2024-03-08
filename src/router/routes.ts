// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
import authRoutes from "./routes/auth.routes.ts";
import DashboardView from "../views/User/DashboardView.vue";

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
  ...authRoutes
]