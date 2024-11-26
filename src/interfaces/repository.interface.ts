import {Organization} from "./organization.interface.ts";
import {User} from "./member.interface.ts";

interface Repository {
  type?: string,
  is_member?: boolean,
  visibility: number,
  uid: string,
  slug: string,
  title: string,
  // subtitle: string,
  description: string,
  commodity: string | string[],
  industry: string | string[],
  technology_category: string,
  technology_status: string,
  technology_readiness_level: string,
  rpt: string,
  funding_agency: string | string[],
  transfer_plan: string,
  technology_transfer_status: string,
  technology_generator: string,
  project_component: string,
  com_extra: Object |string,
  commercialization?: Commercialization,
  adaptors: string,
  location: string,
  affiliation: string | string[],
  tags: string | string[],
  // start_date: Date,
  // end_date: Date,
  start_date: string,
  end_date: string,
  tech_owner: string,
  organization: string | null,
  priority_level: string,
  is_deleted: boolean,
  image?: File | string,
  geojson: any,
  is_active: boolean,
  is_approved: boolean,
  created_at?: string,
  updated_at?: string,
  owner_id?: string,
  owner_data?: User,
  org_data?: Organization
  files?: Attachment[],
  sectors?: string[],
}

interface RepoMemberAccess {
  membership_uid: string,
  user: string,
  repo: string,
  access_level: string,
  is_deleted: string,
}

// interface RepositoryData {
//   visibility: number,
//   uid: string,
//   slug: string,
//   title: string,
//   // subtitle: string,
//   description: string,
//   commodity: string,
//   industry: string,
//   technology_category: string,
//   technology_status: string,
//   technology_readiness_level: string,
//   rpt: string,
//   funding_agency: string,
//   transfer_plan: string,
//   technology_transfer_status: string,
//   technology_generator: string,
//   project_component: string,
//   adopters: string,
//   location: string,
//   affiliation: string,
//   tags: string,
//   // start_date: Date,
//   // end_date: Date,
//   start_date: string,
//   end_date: string,
//   tech_owner: string,
//   organization: string | null,
//   priority_level: string,
//   is_deleted: boolean,
//   geojson: any,
//   is_active: boolean,
//   is_approved: boolean
// }

interface Commercialization{
  ipType: string,
  ipStatus: string,
  regNo: string,
  modeStatus: string,
  adopterStatus: string,
  currentStatus: string
}

interface Attachment{
  uid?: string,
  file: File | null,
  repository: string,
  attachment?: File | string,
  file_type?: string,
  mime_type?: string,
  name?: string,
  description?: string,
  created_at?: string,
  updated_at?: string,
  is_deleted?: boolean,
  deleted_at?: string,
  visibility?: number,
  type: string,
  errorMessage?: string
  showFiles?: boolean,
  isDescriptionUpdated?: boolean
  isFileUpdated?: boolean
  isNameUpdated?: boolean
}




export type {Repository, Commercialization, Attachment, RepoMemberAccess};