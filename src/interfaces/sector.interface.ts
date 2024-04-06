interface Sector {
  title: string
  description?: string
  tags: string[]
  image?: string
  slug: string
  bbox?: [number, number, number, number]
  [key: string]: any;
}

export type {Sector}