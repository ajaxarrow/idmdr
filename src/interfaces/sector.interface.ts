interface Sector {
  title: string
  description?: string
  tags: string[]
  image?: string
  slug: string
  [key: string]: any;
}

export type {Sector}