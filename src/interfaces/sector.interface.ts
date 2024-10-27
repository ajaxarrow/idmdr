
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
  name: string,
  address?: string,
  description?: string,
  geojson?: any,
  image?: File | string
  tags?: string[] | string,
  object_type?: string,
  object_id?: string,
  organization?: string | null,
  repository?: string | null,
  slug?: string,
  bbox?: [number, number, number, number],
  visibility?: number,
  created_at?: string,
  updated_at?: string
  parent?: string,
  parent_id?: string,
  owner_id?: string,
  owner?: string,
  parent_obj?: string
}

export type {Sector}