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
  uid: string,
  username: string,
  email: string,
  profile_picture: string
}

export type {Member, OrgMember, User}