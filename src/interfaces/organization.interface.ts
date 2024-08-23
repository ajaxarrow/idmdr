import {OrganizationType, ClusterType} from "./enums/organization.enum";


interface Organization {
  name: string,
  acronym?: string,
  slug: string,
  description: string,
  geojson?: any,
  image?: string,
  type: OrganizationType,
  address?: string,
  tel?: string,
  phone?: string,
  email?: string,
  president: string,
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
  name: string,
  email?: string,
  phone?: string
}

export type {Organization, ClusterRepresentative, Representative}