import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {ref} from "vue";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";

export const useRepositoryMemberServices = () => {
  const { userData, user } = useUserStore();
  const { showSnackbarMessage } = useSnackbarStore();
  const authorizationHeader = user.value
    ? { Authorization: `Bearer ${userData.accessToken}` }
    : {};

  const loading = ref(false);

  const {mapOrgMembers} = useOrganizationMembersServices();

  const fetchRepoMembers = async (repoID: string, includeDeletedMembers: boolean = false): Promise<OrgMember[]> => {
    try {
      const res = await server.get(`/repo-users/${repoID}`, {
        headers: authorizationHeader,
      });
      if(includeDeletedMembers) {
        return mapOrgMembers(res.data);
      } else {
        return mapOrgMembers(res.data.filter((member: any) => !member.is_deleted));
      }
    } catch {
      return [];
    }
  };

  const addRepoMember = async (repoID: string, member: OrgMember) => {
    const orgMembers = await fetchRepoMembers(repoID, true);
    const existingMember = orgMembers.find((m) => m.user.uid === member.user.uid);
    try {
      if (existingMember) {
        if (existingMember.is_deleted) {
          await restoreRepoMember(repoID, existingMember, member.access_level);
          return;
        }
      } else {
        await createRepoMember(repoID, member);
      }
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const updateRepoMember = async (repoID: string, member: OrgMember) => {
    try {
      await server.put(
        `/repo-users-update/${member.membership_uid}`,
        {
          repo: repoID,
          membership_uid: member.membership_uid,
          user: member.user.uid,
          access_level: member.access_level,
          is_deleted: false,
        },
        { headers: authorizationHeader }
      );
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const removeRepoMember = async (repoID: string, member: OrgMember) => {
    try {
      await server.put(
        `/repo-users-update/${member.membership_uid}`,
        {
          repo: repoID,
          user: member.user.uid,
          access_level: member.access_level,
          membership_uid: member.membership_uid,
          is_deleted: true,
        },
        { headers: authorizationHeader }
      );
    } catch (e: any) {
      handleApiError(e);
    }
  };

  // Helper Functions
  const createRepoMember = async (repoID: string, member: OrgMember) => {
    await server.post(
      `/repo-users/${repoID}`,
      {
        user: member.user.uid,
        repo: repoID,
        access_level: member.access_level,
      },
      { headers: authorizationHeader }
    );
  };

  const restoreRepoMember = async (repoID: string, member: OrgMember, newAccessLevel: string) => {
    await server.put(
      `/repo-users-update/${member.membership_uid}`,
      {
        membership_uid: member.membership_uid,
        user: member.user.uid,
        repo: repoID,
        access_level: newAccessLevel,
        is_deleted: false,
      },
      { headers: authorizationHeader }
    );
  };

  const handleApiError = (e: any) => {
    showSnackbarMessage("OOPS! Something went wrong", Status.error);
    console.error(e.response || e.message);
  };

  return{
    loading,
    fetchRepoMembers,
    addRepoMember,
    updateRepoMember,
    removeRepoMember
  }

}