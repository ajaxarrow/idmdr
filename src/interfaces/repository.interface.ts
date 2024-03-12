interface Repository {
  title: string;
  subtitle: string;
  slug: string;
  owner: string;
  date: Date;
  image?: string;
  tags?: string[];
  about?: string;
}

export type {Repository};