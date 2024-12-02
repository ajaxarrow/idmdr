interface Notification {
  pk?: string,
  sender?: string,
  receiver?: string | string[],
  title?: string,
  message?: string,
  type?: string,
  content_type?: number,
  object_id?: string,
  created_at?: string,
  updated_at?: string,
  is_read?: boolean,
  is_deleted?: boolean
}

interface GroupedNotification {
  date: string;
  notifications: Notification[];
}

export type {Notification, GroupedNotification}