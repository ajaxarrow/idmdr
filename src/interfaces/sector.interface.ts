interface Sector {
  title: string
  description?: string
  geojson?: any
  tags: string[]
  image?: string
  slug: string
  bbox?: [number, number, number, number]
  [key: string]: any;
}

export type {Sector}