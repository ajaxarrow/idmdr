import {ClusterType} from "./enums/organization.enum.ts";

interface CMI {
    name: string,
    acronym: string,
    description?: string,
    cover?: string,
    representatives: CMIClusterRepresentative[],
    director?: string,
    email?: string,
    phone?: string,
    research: boolean,
    slug?: string,
    logo: string,
    withData: boolean,
    link?: string,
}

interface CMIClusterRepresentative{
    type: ClusterType,
    name: string,
    email?: string
}

export type {CMI, CMIClusterRepresentative}
