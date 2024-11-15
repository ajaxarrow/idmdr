import {
  PhAirplaneLanding,
  PhBell,
  PhCloud, PhUserCircle,
  PhUsersFour,
} from "@phosphor-icons/vue";
import {useUserStore} from "../core/stores/user.store.ts";

const {user} = useUserStore()

export const profileNavlinks = [
  ...(user.value ? [
    {
      name: "My Repositories",
      link: "/my-repositories",
      icon: PhCloud,
    },
    {
      name: 'My Organizations',
      link: '/my-organizations',
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
  },]),
]