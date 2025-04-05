import {AccessLevel} from "./enums/accesslevels.enum.ts";

interface Member{
  name: string,
  avatar: string,
  email: string,
  access?: AccessLevel
}

interface OrgMember {
  membership_uid: string,
  user: User,
  access_level: string,
  is_deleted: boolean
}

interface User{
  uid?: string,
  first_name?: string,
  last_name?: string,
  username: string,
  email: string,
  profile_picture?: string
}

interface CustomUserData{
  type?: string
  data?: User
}
interface CustomUser{
  type?: string,
  id?: string
}

export type {Member, OrgMember, User, CustomUser, CustomUserData}