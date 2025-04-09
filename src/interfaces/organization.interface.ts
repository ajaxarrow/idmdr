import {ClusterType} from "./enums/organization.enum";
import {Repository} from "./repository.interface.ts";
import {CustomUserData} from "./member.interface.ts";

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
  rd_repData?: CustomUserData[],
  tt_repData?: CustomUserData[],
  ic_repData?: CustomUserData[],
  sc_repData?: CustomUserData[],
  rd_rep?: string,
  tt_rep?: string,
  ic_rep?: string,
  sc_rep?: string,
  additional_info?: string,
  is_active?: boolean,
  is_approved?: boolean,
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

interface OrganizationEvent{
  uid?: string,
  title?: string,
  description?: string,
  repository: string,
  repositoryData?: Repository,
  organization?: string,
  organizationData?: Organization,
  start_date?: string,
  end_date?: string,
  start_date_object: {
    date: string;
    time: string;
  };
  end_date_object: {
    date: string;
    time: string;
  };
  created_at?: string,
  created_by?: string,
  updated_at?: string,
  is_deleted?: boolean

}

export type {Organization, ClusterRepresentative, Representative, Expert, OrganizationEvent}