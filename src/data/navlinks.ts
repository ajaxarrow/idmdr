import {
  PhCloud,
  PhGearSix,
  PhHouse,
  PhMapPinLine,
  PhSignOut,
  PhUsersFour,
  PhUsersThree,
  PhAirplaneLanding
} from "@phosphor-icons/vue";
import {useUserStore} from "../core/stores/user.store.ts";

const {user} = useUserStore()
export const navLinks = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: PhHouse
  },
  {
    name: 'Repositories',
    link: '/repositories',
    icon: PhCloud
  },
  {
    name: 'Organizations',
    link: '/organizations',
    icon: PhUsersThree
  },
  {
    name: 'Map',
    link: '/map',
    icon: PhMapPinLine
  },
  // Conditionally include "My Organizations" and "Settings" links
  ...(user.value ? [
    {
      name: 'My Repositories',
      link: '/my-repositories',
      icon: PhCloud
    },
    {
      name: 'My Organizations',
      link: '/my-organizations',
      icon: PhUsersFour
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: PhGearSix
    }
  ] : []),
  {
    name: user.value ? 'Signout' : 'Back to Landing',
    link: user.value ? '/signout' : '/',
    icon: user.value ? PhSignOut : PhAirplaneLanding
  }
];