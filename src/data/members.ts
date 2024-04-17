import {AccessLevel} from "../interfaces/enums/accesslevels.enum.ts";
import {Member} from "../interfaces/member.interface.ts";

const orgmembers: Member[] = [
  {
    name: 'Luca Doncic',
    access: AccessLevel.readonly,
    email: 'lucamagic@gmail.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/43.jpg'
  },
  {
    name: 'Arram Pamisa',
    access: AccessLevel.moderate,
    email: 'pamisa@gmail.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/49.jpg'
  }
];

const membersData: Member[] = [
  {
    name: 'Axl Tabilla',
    email: 'axl@gmail.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/31.jpg'
  },
  {
    name: 'LeBron James',
    email: 'kingjames@yahoo.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/36.jpg'
  },
  {
    name: 'Hev Abi',
    email: 'hevabi@gmail.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/34.jpg'
  },
  {
    name: 'Stephen Curry',
    email: 'chefcurry@gmail.com',
    avatar: 'https://mighty.tools/mockmind-api/content/abstract/42.jpg'
  }
];

export {membersData, orgmembers}