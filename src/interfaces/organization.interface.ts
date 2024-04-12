import {OrganizationType, ClusterType} from "./enums/organization.enum";


interface Organization {
  name: string,
  acronym?: string,
  slug: string,
  description: string,
  image?: string,
  type: OrganizationType,
  address?: string,
  tel?: string,
  phone?: string,
  email?: string,
  president: string,
  clusterRepresentatives: ClusterRepresentative[]
}

interface ClusterRepresentative{
  type: ClusterType,
  name: string,
  email: string
}

export type {Organization, ClusterRepresentative}