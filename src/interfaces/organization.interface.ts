import {ClusterType} from "./enums/organization.enum";

interface Organization {
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
  // clusterRepresentatives: ClusterRepresentative[]
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

export type {Organization, ClusterRepresentative, Representative}