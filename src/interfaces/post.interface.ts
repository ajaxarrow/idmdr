interface Post{
  uid?: string,
  title?: string,
  description: string,
  created_by?: string,
  is_draft?: boolean,
  is_published?: boolean,
  created_at?: string,
  updated_at?: string,
  is_deleted?: boolean,
  images?: PostImage[]
}

interface PostImage{
  uid?: string,
  image?: string,
  post?: string,
  created_at?: string,
  updated_at?: string,
  is_deleted?: boolean
}

export type {Post, PostImage}