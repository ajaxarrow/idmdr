interface Repository {
  title: string;
  slug: string;
  owner: string;
  date: Date;
  image?: string;
  tags?: string[];
  about?: string;
}

export type {Repository};