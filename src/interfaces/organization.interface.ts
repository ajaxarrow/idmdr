import {ClusterType} from "./enums/organization.enum";

interface Organization {
  is_deleted?: boolean,
  is_member?: boolean,
  uid?: string,
  access_level?: string,
  name: string,
  acronym?: string,
  slug: string,
  description: string,
  geojson?: any,
  image?: string,
  org_type?: number,
  sub_org_type?: number,
  visibility?: number,
  website?: string,
  address?: string,
  tel_phone?: string,
  phone?: string,
  email?: string,
  president?: string,
  rd_rep: Representative,
  tt_rep: Representative,
  ic_rep: Representative,
  sc_rep: Representative,
  additional_info?: string,
  // clusterRepresentatives: ClusterRepresentative[]
}

interface Expert{
  uid?: string,
  name?: Name | string,
  expertise?: string | string [],
  organization?: string | Organization,
  contact: Contact,
  additional_info?: string,
  is_deleted?: boolean
  created_at?: string
  created_by?: string
  updated_at?: string
}

interface Name{
  first_name?: '',
  middle_name?: '',
  last_name?: '',
  extension?: ''
}

interface Contact{
  value: string,
  is_displayed: boolean
}
interface ClusterRepresentative{
  type: ClusterType,
  name: string,
  email?: string
}

interface Representative{
  full_name: string,
  email?: string,
  phone?: string
}

export type {Organization, ClusterRepresentative, Representative, Expert}