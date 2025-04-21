import {
  PhCloud,
  PhHouse,
  PhMapPinLine,
  PhSignOut,
  PhUsersFour,
  PhUsersThree,
  PhAirplaneLanding, PhUserCircle, PhLightbulbFilament, PhUsers, PhPen, PhCalendar, PhLeaf, PhFolderUser
} from "@phosphor-icons/vue";
import {useUserStore} from "../core/stores/user.store.ts";

const {user, userData} = useUserStore()
export const navLinks = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: PhHouse
  },
  {
    name: 'Projects',
    link: '/repositories',
    icon: PhCloud
  },
  {
    name: 'IP Technologies',
    link: '/ip-technologies',
    icon: PhLightbulbFilament
  },
  {
    name: 'ATBI',
    link: '/atbi',
    icon: PhLeaf
  },
  {
    name: 'CMIs',
    link: '/organizations',
    icon: PhUsersThree
  },
  {
    name: 'Map',
    link: '/map',
    icon: PhMapPinLine
  },
  ...(userData.is_superuser ? [
    {
      name: 'User Management',
      link: '/users',
      icon: PhFolderUser
    }
  ] : []),
  ...(user.value && !userData.is_superuser && userData.is_approved? [
    {
      name: 'My Projects',
      link: '/my-repositories',
      icon: PhCloud
    },
    {
      name: 'My CMIs',
      link: '/my-organizations',
      icon: PhUsersFour
    },
    {
      name: 'Experts',
      link: '/experts',
      icon: PhUsers
    }
  ] : []),
  ...((user.value && userData.is_approved ) || userData.is_superuser? [
    {
      name: 'Posts',
      link: '/posts',
      icon: PhPen
    },
    {
      name: 'Calendar',
      link: '/events',
      icon: PhCalendar
    }
  ] : []),
  ...(user.value && !userData.is_superuser && userData.is_approved? [
    {
      name: 'Calendar',
      link: '/events',
      icon: PhCalendar
    },
    {
      name: "My Profile",
      link: "/profile",
      icon: PhUserCircle,
    }
  ] : []),
  {
    name: user.value ? 'Signout' : 'Back to Landing',
    link: user.value ? '/signout' : '/',
    icon: user.value ? PhSignOut : PhAirplaneLanding
  }
];