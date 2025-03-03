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
  file?: File | null,
  uid?: string,
  image?: File | string,
  post?: string,
  type?: string,
  created_at?: string,
  updated_at?: string,
  is_deleted?: boolean,
  previewImage?: string;
}

export type {Post, PostImage}