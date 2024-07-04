import {Comment} from "../../../interfaces/dicussion.interface.ts";
import comments from "../../../data/comment.ts";
import {ref} from "vue";

export const useRepositoryDiscussionCommentServices = () => {

  const commentsList = ref(comments);

  const fetchCommentsByTopic = (id: string): Comment[] => {
    const commentList = comments.filter(comment => comment.topicID === id);
    if (commentList) {
      return commentList;
    } else {
      console.error('no comment')
      return [];
    }
  }

  const addComment = async (comment: Comment) => {
    commentsList.value.push(comment);
  }

  const updateComment = async (comment: Comment) => {
    const index = commentsList.value.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      commentsList.value[index] = comment;
    }
  }

  const deleteComment = async (comment: Comment) => {
    const index = commentsList.value.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      commentsList.value.splice(index, 1);
    }
  }

  return {
    fetchCommentsByTopic,
    addComment,
    updateComment,
    deleteComment
  }
}