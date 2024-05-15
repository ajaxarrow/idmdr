import {Comment, Topic} from "../interfaces/dicussion.interface.ts";
import topics from "../data/topics.ts";
import comments from "../data/comment.ts";

export const useDiscussion = () => {
  const fetchTopicsByRepositories = (slug: string): Topic[] => {
    const topicList = topics.filter(topic => topic.repository === slug);
    if (topicList) {
      return topicList;
    } else {
      console.error('no topic')
      return [];
    }
  }

  const fetchTopicByTopicID = (id: string): Topic | null => {
    const topic = topics.find(topic => topic.id === id);
    if (topic) {
      return topic;
    } else {
      return null;
    }
  }

  const fetchCommentsByTopic = (id: string): Comment[] => {
    const commentList = comments.filter(comment => comment.topicID === id);
    if (commentList) {
      return commentList;
    } else {
      console.error('no comment')
      return [];
    }
  }

  return {
    fetchTopicsByRepositories,
    fetchCommentsByTopic,
    fetchTopicByTopicID
  }
}