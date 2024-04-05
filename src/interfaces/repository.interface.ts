interface Repository {
  title: string;
  subtitle: string;
  slug: string;
  owner: string;
  date: Date;
  sector?: string;
  image?: string;
  tags?: string[];
  about?: string;
  files?: FileData[]
}
interface FileData {
  name: string,
  description: string
}



export type {Repository, FileData};