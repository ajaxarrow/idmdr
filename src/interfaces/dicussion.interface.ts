interface Topic{
  repository: string,
  title: string,
  description: string,
  id: string,
  owner: string,
  ownerImage: string,
}

interface Comment {
  content: string,
  id: string,
  topicID: string,
  owner: string,
  ownerImage: string,
}

export type {Topic, Comment}