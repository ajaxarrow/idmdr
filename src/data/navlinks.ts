import {PhCloud, PhGearSix, PhHouse, PhMapPinLine, PhSignOut, PhTag, PhUsersThree} from "@phosphor-icons/vue";

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
    name: 'Sector Tagging',
    link: '/sectors',
    icon: PhTag
  },
  {
    name: 'Map',
    link: '/map',
    icon: PhMapPinLine
  },
  {
    name: 'Organizations',
    link: '/organizations',
    icon: PhUsersThree
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: PhGearSix
  },
  {
    name: 'Signout',
    link: '/signout',
    icon: PhSignOut
  }
]