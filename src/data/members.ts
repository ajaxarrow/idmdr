import {AccessLevel} from "../interfaces/enums/accesslevels.enum.ts";
import {Member} from "../interfaces/member.interface.ts";

const members: Member[] = [
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
]

export default members