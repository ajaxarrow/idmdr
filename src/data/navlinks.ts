import {
  PhCloud,
  PhGearSix,
  PhHouse,
  PhMapPinLine,
  PhSignOut,
  PhTag,
  PhUsersFour,
  PhUsersThree
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
    name: 'Sector Tagging',
    link: '/sectors',
    icon: PhTag
  },
  {
    name: 'Map',
    link: '/map',
    icon: PhMapPinLine
  },
  // Conditionally include "My Organizations" and "Settings" links
  ...(user.value ? [
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
    name: 'Signout',
    link: '/signout',
    icon: PhSignOut
  }
];