import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {AccessRequest} from "../../../interfaces/access-request.interface.ts";


const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}

export const useAccessRequestServices = () => {

  const sendAccessRequest = async (accessRequest: AccessRequest, endpoint: string, type: string) => {
    try {
      await (type === 'create' ? server.post : server.patch)(
        endpoint,
        accessRequest, {
          headers: authorizationHeader
        }
      );

    } catch (e: any) {
      console.log(e)
      return;
    }
  }

  const addAccessRequest = async(accessRequest: AccessRequest) => {
    await sendAccessRequest(accessRequest, `/access_request/`, 'create');
  }

  const updateAccessRequest = async(accessRequest: AccessRequest, id: string) => {
    await sendAccessRequest(accessRequest, `/access_request/${id}/`, 'update');
  }

  const fetchAccessRequestsByRepository = async (repoID: string): Promise<AccessRequest[]> => {
    try {
      const res = await server.get(`/access_request/?object_id=${repoID}`, {
        headers: authorizationHeader
      })
      return res.data
    } catch (e: any) {
      console.log(e)
      return [];
    }
  }

  const fetchAccessRequestsByRequestor = async (userID: string,): Promise<AccessRequest[]> => {
    try {
      const res = await server.get(`/access_request/?requestor=${userID}`, {
        headers: authorizationHeader
      })
      return res.data
    } catch (e: any) {
      console.log(e)
      return [];
    }
  }

  const fetchAccessRequestsByRepositoryAndRequestor = async (userID: string, repoID: string): Promise<AccessRequest[]> => {
    try {
      const res = await server.get(`/access_request/?object_id=${repoID}&requestor=${userID}`, {
        headers: authorizationHeader
      })
      return res.data
    } catch (e: any) {
      console.log(e)
      return [];
    }
  }

  const fetchAccessRequestData = async (id: string): Promise<AccessRequest | null> => {
    try {
      const res = await server.get(`/access_request/${id}/`, {
        headers: authorizationHeader
      })
      return res.data
    } catch (e: any) {
      console.log(e)
      return null;
    }
  }


  return {
    addAccessRequest,
    updateAccessRequest,
    fetchAccessRequestsByRepository,
    fetchAccessRequestsByRepositoryAndRequestor,
    fetchAccessRequestData,
    fetchAccessRequestsByRequestor
  }

}