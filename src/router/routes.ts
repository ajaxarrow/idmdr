// @ts-ignore
import LandingView from "../views/Public/LandingView.vue";
import authRoutes from "./routes/auth.routes.ts";

export const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  ...authRoutes
]