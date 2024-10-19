import {Organization} from "./organization.interface.ts";
import {User} from "./member.interface.ts";

interface Repository {
  is_member?: boolean,
  visibility: number,
  uid: string,
  slug: string,
  title: string,
  // subtitle: string,
  description: string,
  commodity: string,
  industry: string,
  technology_category: string,
  technology_status: string,
  technology_readiness_level: string,
  rpt: string,
  funding_agency: string,
  transfer_plan: string,
  technology_transfer_status: string,
  technology_generator: string,
  project_component: string,
  com_extra: Object |string,
  commercialization?: Commercialization,
  adaptors: string,
  location: string,
  affiliation: string,
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
  owner?: User,
  organizationData?: Organization
  files?: FileData[],
  sectors?: string[],
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


interface FileData {
  name: string,
  description: string
}



export type {Repository, FileData, Commercialization};