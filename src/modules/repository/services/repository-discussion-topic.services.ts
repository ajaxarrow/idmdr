import {Topic} from "../../../interfaces/dicussion.interface.ts";
import topics from "../../../data/topics.ts";
import {ref} from "vue";

export const useRepositoryDiscussionTopicServices = () => {
  
  const topicsList = ref(topics);
  
  const fetchTopicsByRepository = (slug: string): Topic[] => {
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

  const addTopic = async (topic: Topic) => {
    topicsList.value.push(topic);
  }

  const updateTopic = async (topic: Topic) => {
    const index = topicsList.value.findIndex(c => c.id === topic.id);
    if (index !== -1) {
      topicsList.value[index] = topic;
    }
  }

  const deleteTopic = async (topic: Topic) => {
    const index = topicsList.value.findIndex(c => c.id === topic.id);
    if (index !== -1) {
      topicsList.value.splice(index, 1);
    }
  }

  return {
    fetchTopicsByRepository,
    fetchTopicByTopicID,
    addTopic,
    updateTopic,
    deleteTopic
  }
}