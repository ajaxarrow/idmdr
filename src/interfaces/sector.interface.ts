
// interface Sector {
//   title: string
//   description?: string
//   geojson?: any
//   tags: string[]
//   image?: string
//   slug: string
//   bbox?: [number, number, number, number]
//   [key: string]: any;
// }

interface Sector {
  uid?: string,
  title: string,
  description?: string,
  geojson?: any,
  image?: File | string
  tags?: string[] | string,
  object_type?: string,
  object_id?: string,
  organization?: string | null,
  repository?: string | null,
  slug?: string
}

export type {Sector}