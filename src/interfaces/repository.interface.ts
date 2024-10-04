interface Repository {
  title: string;
  subtitle: string;
  slug: string;
  organization: string;
  owner: string;
  date: Date;
  sectors?: string[];
  image?: string;
  tags?: string[];
  about?: string;
  files?: FileData[]
}

interface RepositoryData {
  visibility: number,
  slug: string,
  title: string,
  subtitle: string,
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
  commercialization_status: string,
  ip_status: string,
  ip_registration_number: string,
  adaptor_status: string,
  technology_generator: string,
  tech_owner: string,
  organization: string,
  priority_level: string,
  is_deleted: boolean,
  geojson: any,
  is_private: boolean,
  is_active: boolean,
}


interface FileData {
  name: string,
  description: string
}



export type {Repository, FileData, RepositoryData};