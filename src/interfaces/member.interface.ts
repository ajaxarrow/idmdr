import {AccessLevel} from "./enums/accesslevels.enum.ts";

interface Member{
  name: string,
  avatar: string,
  email: string,
  access?: AccessLevel
}

export type {Member}