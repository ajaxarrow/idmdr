import {User} from "./member.interface.ts";

interface AccessRequest {
  uid?: string,
  requestor?: string,
  requestor_user_obj?: User,
  content_type?: number,
  object_id?: string,
  is_approved?: boolean,
  is_reviewed?: boolean,
  created_at?: string,
  updated_at?: string,
  notification_sent?: boolean,
  notification_counter?: number
}

export type {AccessRequest}