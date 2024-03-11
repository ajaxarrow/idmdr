import {PhBell, PhMagnifyingGlass, PhUser, PhUsersThree} from "@phosphor-icons/vue";

export const profileNavlinks = [
  {
    name: 'Organization',
    link: '/organization',
    icon: PhUsersThree
  },
  {
    name: 'Search',
    link: '/search',
    icon: PhMagnifyingGlass
  },
  {
    name: 'Notifications',
    link: '/notifications',
    icon: PhBell
  },
  {
    name: 'My Account',
    link: '/account',
    icon: PhUser
  }
]