import {Organization} from "./organization.interface.ts";
import {Repository} from "./repository.interface.ts";
import {User} from "./member.interface.ts";

interface Sector {
  uid?: string,
  name: string,
  address?: string,
  description?: string,
  geojson?: any,
  image?: File | string
  tags?: string[] | string,
  object_type?: string,
  object_id?: string,
  organization?: string | null,
  repository?: string | null,
  slug?: string,
  bbox?: [number, number, number, number],
  visibility?: number,
  created_at?: string,
  additional_info?: string,
  updated_at?: string
  parent?: string,
  parent_id?: string,
  owner_id?: string,
  owner?: User,
  parent_obj?: Organization | Repository
  orgData?: Organization
  repoData?: Repository
}

export type {Sector}