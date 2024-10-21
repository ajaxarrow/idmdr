import {User} from "./member.interface.ts";

interface Topic{
  repo_id: string,
  topic_title: string,
  topic_content: string,
  id?: string,
  user: User | string,
  userData?: User,
  date_created?: string,
  date_updated?: string,
  comments?: Comment[],
}

interface Comment {
  comment_content: string,
  id?: string,
  date_created?: string,
  date_updated?: string,
  user: User | string,
  userData?: User,
  discussion: string,
}

export type {Topic, Comment}