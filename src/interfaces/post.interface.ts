import {Organization} from "./organization.interface.ts";
import {BaseImage} from "./image.interface.ts";

interface Post{
  uid?: string,
  title?: string,
  description: string,
  created_by?: string,
  is_draft?: boolean,
  is_published?: boolean,
  is_approved?: boolean,
  organization?: string,
  organizationData?: Organization,
  created_at?: string,
  updated_at?: string,
  is_deleted?: boolean,
  images?: PostImage[]
}

interface PostImage extends BaseImage {
  post?: string;
}

export type {Post, PostImage}