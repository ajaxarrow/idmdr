import {Topic} from "../../../interfaces/dicussion.interface.ts";
import topics from "../../../data/topics.ts";

export const useRepositoryDiscussionTopicServices = () => {
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

  return {
    fetchTopicsByRepositories,
    fetchTopicByTopicID
  }
}