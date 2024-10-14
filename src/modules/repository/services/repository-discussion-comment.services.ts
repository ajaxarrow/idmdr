import {Comment} from "../../../interfaces/discussion.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRepositoryDiscussionTopicServices} from "./repository-discussion-topic.services.ts";

const {fetchUser} = useOrganizationMembersServices()
const {fetchDiscussionTopicByID} = useRepositoryDiscussionTopicServices();
const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();

export const useRepositoryDiscussionCommentServices = () => {

  const fetchCommentsByDiscussion = async (id: string): Promise<Comment[]> => {
    const data = await fetchDiscussionTopicByID(id)
    // @ts-ignore
    return Promise.all(data.comments.map(async (comment) => {
      const ownerData = await fetchUser(comment.user)
      return {
        id: comment.id,
        comment_content: comment.comment_content,
        date_created: comment.date_created,
        date_updated: comment.date_updated,
        userData: ownerData,
        user: comment.user
      }
    }))
  }

  const saveDiscussionTopicComment = async (comment: Comment, endpoint: string, type: string) => {
    try {
      await (type === 'create' ? server.post : server.put)(
        endpoint,
        comment,
        {
          headers: authorizationHeader
        }
      );
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      return;
    }
  }

  const addDiscussionTopicComment = async(comment: Comment, id: string) => {
    await saveDiscussionTopicComment(comment, `/v1/discussions/${id}/comments/`, 'create');
  }

  const updateDiscussionTopicComment = async(comment: Comment, id: string) => {
    await saveDiscussionTopicComment(comment, `/comments/${id}/`, 'create');
  }

  const deleteDiscussionTopicComment = async(id: string) => {
    try{
      await server.delete(`/v1/comments/${id}/`, {
        headers: authorizationHeader
      });
    } catch (e: any) {
      console.log(e)
    }
  }

  return {
    fetchCommentsByDiscussion,
    addDiscussionTopicComment,
    updateDiscussionTopicComment,
    deleteDiscussionTopicComment
  }
}