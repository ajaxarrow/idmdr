import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive, ref} from "vue";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {server} from "../../../plugins/axios.ts";

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}


export const useOrganizationMembersServices = () => {
  const errorMessageIntialState = reactive({
    name: '',
    access_level: '',
  });
  const loading = ref(false);
  const errorMessage = reactive({ ...errorMessageIntialState });
  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageIntialState });
  };


  const mapOrgMembers = async (rawData: any): Promise<OrgMember[]> => {
    return rawData.map((member: any) => {
      return {
        membership_uid: member.membership_uid,
        user: {
          uid: member.user.uid,
          username: member.user.username,
          email: member.user.email,
          profile_picture: member.user.profile_picture
        },
        access_level: member.access_level,
        is_deleted: member.is_deleted
      }
    })
  }

  const fetchOrgMembers = async (orgID: string): Promise<OrgMember[]> => {
    try {
      const res = await server.get(`/org-users/${orgID}`, { headers: authorizationHeader });
      return mapOrgMembers(res.data.results);
    } catch (e) {
       return []
    }
  }

  return {
    loading, errorMessage, clearErrorMessage, fetchOrgMembers
  }
}