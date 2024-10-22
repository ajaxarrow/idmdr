
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

interface SectorInfo {
  uid: string,
  title: string,
  description?: string,
  geojson?: any,
  tags?: string[] | string,
  object_type?: string,
  object_id?: string,
  organization?: string | null,
  repository?: string | null
}

export type {Sector, SectorInfo}