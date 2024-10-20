import {Topic} from "../../../interfaces/discussion.interface.ts";
import {reactive, ref} from "vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {server} from "../../../plugins/axios.ts";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";

const {fetchUser} = useOrganizationMembersServices()
const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();

export const useRepositoryDiscussionTopicServices = () => {
  const errorMessageIntialState = reactive({
    topic_title: '',
    topic_content: '',
  })

  const loading = ref(false);

  const errorMessage = reactive({ ...errorMessageIntialState });

  const hasErrorMessages = (errorMessage: any): boolean => {
    // Iterate over each key in the errorMessage object
    return Object.keys(errorMessage).some(key => {
      const value = errorMessage[key];

      // If value is an object, recursively check its properties
      if (typeof value === 'object' && !Array.isArray(value)) {
        return hasErrorMessages(value);
      }

      // Check if the value is a non-empty string (error message present)
      return typeof value === 'string' && value.trim().length > 0;
    });
  };

  const handleDynamicErrorMapping = (data: any, target: any) => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        handleDynamicErrorMapping(data[key], target[key]);
      } else {
        target[key] = data[key]?.[0] ?? target[key];
      }
    });
  };

  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageIntialState });
  };

  const saveDiscussionTopic = async (topic: Topic, endpoint: string, type: string) => {
    clearErrorMessage()
    loading.value = true;
    try {
      await (type === 'create' ? server.post : server.put)(
        endpoint,
        topic, {
          headers: authorizationHeader
        }
      );
      // if(type == 'create'){
      //   await localStorage.setItem('snackbarmessage', JSON.stringify({
      //     message: 'Discussion topic created successfully',
      //     status: 'success'
      //   }))
      //   setTimeout(async function() {
      //     loading.value = false;
      //     window.location.href = `/my-repositories/${topic.repo_id}/discussions`;
      //   }, 3000);
      // } else if(type == 'update'){
      //   await localStorage.setItem('snackbarmessage', JSON.stringify({
      //     message: 'Discussion topic updated successfully',
      //     status: 'success'
      //   }))
      //   setTimeout(async function() {
      //     loading.value = false;
      //     window.location.href = `/my-repositories/${topic.repo_id}/discussions/${res.data.id}`;
      //   }, 3000);
      // }
    } catch (e: any) {
      loading.value = false;
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      clearErrorMessage();
      handleDynamicErrorMapping(e.response?.data, errorMessage);
      return;
    }
  }

  const addDiscussionTopic = async (topic: Topic) => {
    await saveDiscussionTopic(topic, '/v1/discussions/', 'create');
  }


  const updateDiscussionTopic = async (topic: Topic, id: string) => {
    await saveDiscussionTopic(topic, `/v1/discussions/${id}/`, 'update');
  }

  const deleteDiscussionTopic = async (id: string) => {
    try{
      await server.delete(`/v1/discussions/${id}/`, {
        headers: authorizationHeader
      })
    } catch (e: any) {
      console.log(e)
    }
  }
  
  const fetchDiscussionTopicsByRepository = async (slug: string): Promise<Topic[]> => {
    try{
      const res = await server.get(`/v1/discussions/?repo_id=${slug}`, {
          headers: authorizationHeader
      })
      return Promise.all(
        res.data.map(async (topic: any) => {
          const ownerData = await fetchUser(topic.user)
          return {
            repo_id: topic.repo_id,
            topic_title: topic.topic_title,
            topic_content: topic.topic_content,
            id: topic.id,
            user: topic.user,
            userData: ownerData,
            date_created: topic.date_created,
            date_updated: topic.date_updated,
            comments: topic.comments
          }
        })
      )
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  const fetchDiscussionTopicByID = async (id: string): Promise<Topic | null> => {
    try{
      const res = await server.get(`/v1/discussions/${id}/`, {
        headers: authorizationHeader
      })
      const ownerData = await fetchUser(res.data.user)
      return {
        repo_id: res.data.repo_id,
        topic_title: res.data.topic_title,
        topic_content: res.data.topic_content,
        id: res.data.id,
        user: res.data.user,
        //@ts-ignore
        userData: ownerData,
        date_created: res.data.date_created,
        date_updated: res.data.date_updated,
        comments: res.data.comments
      }
    } catch (e) {
      return null;
    }
  }

  return {
    loading,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
    addDiscussionTopic,
    updateDiscussionTopic,
    deleteDiscussionTopic,
    fetchDiscussionTopicsByRepository,
    fetchDiscussionTopicByID
  }
}