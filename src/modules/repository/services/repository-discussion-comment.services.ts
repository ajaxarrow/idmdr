import {Comment} from "../../../interfaces/dicussion.interface.ts";
import comments from "../../../data/comment.ts";

export const useRepositoryDiscussionCommentServices = () => {

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
    fetchCommentsByTopic
  }
}