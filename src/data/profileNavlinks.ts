import {
  PhAirplaneLanding,
  PhBell,
  PhCloud, PhFingerprint, PhKey, PhUserCircle,
  PhUsersFour,
} from "@phosphor-icons/vue";
import {useUserStore} from "../core/stores/user.store.ts";

const {user, userData} = useUserStore()

export const profileNavlinks = [
  ...(user.value && userData.is_approved ? [
    {
      name: "Projects",
      link: "/repositories",
      icon: PhCloud,
    },
    {
      name: 'Organizations',
      link: '/organizations',
      icon: PhUsersFour
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: PhBell,
    },
    {
      name: "My Profile",
      link: "/profile",
      icon: PhUserCircle,
    },
    // {
    //   name: "Account Settings",
    //   link: "/settings/account",
    //   icon: PhUserCircleGear,
    // },
  ] : [  {
    name: "Back to Landing",
    link: "/",
    icon: PhAirplaneLanding,
  },
  {
    name: "Login",
    link: "/auth?tab=login",
    icon: PhFingerprint,
  },
  {
    name: "Register",
    link: "/auth?tab=register",
    icon: PhKey,
  }
  ]),
]