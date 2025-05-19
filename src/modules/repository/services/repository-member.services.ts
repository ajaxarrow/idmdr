import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {ref} from "vue";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";
import {CustomUserData, OrgMember} from "../../../interfaces/member.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRepositoryServices} from "./repository.services.ts";
import {useNotificationsServices} from "../../user/services/notifications.services.ts";
import {useOrganizationExpertsServices} from "../../organization/services/organization-experts.services.ts";

export const useRepositoryMemberServices = () => {
  const { userData, user } = useUserStore();
  const { showSnackbarMessage } = useSnackbarStore();
  const authorizationHeader = user.value
    ? { Authorization: `Bearer ${userData.accessToken}` }
    : {};
  const {addNotification} = useNotificationsServices()
  const loading = ref(false);

  const {mapOrgMembers} = useOrganizationMembersServices();
  const {fetchRepositoryData} = useRepositoryServices()
  const {fetchUsers} = useOrganizationMembersServices();
  const {fetchAllExperts} = useOrganizationExpertsServices();

  const fetchCustomUsers = async (): Promise<CustomUserData[]> => {
    try {
      const users = await fetchUsers();
      const experts = await fetchAllExperts();

      const userList = users.map((user) => ({
        type: 'user',
        data: user
      }));

      const expertList = experts.map((expert) => ({
        type: 'expert',
        data: {
          uid: expert.uid,
          // @ts-ignore
          username: `${expert.name.first_name ?? ''} ${expert.name.middle_name ?? ''} ${expert.name.last_name ?? ''} ${expert.name.extension ?? ''}`.trim(),
          // @ts-ignore
          first_name: expert.name.first_name ?? '',
          // @ts-ignore
          last_name: expert.name.last_name ?? '',
          email: ''
        }
      }));

      return [...userList, ...expertList]; // Merging both lists
    } catch (e: any) {
      console.error(e);
      return [];
    }
  };




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

      const repo = await fetchRepositoryData(repoID)

      await addNotification({
        sender: userData.uid,
        receiver: member.user.uid,
        title: 'Access Level Changed for Membership from Repository',
        message: `Your membership in ${repo?.title} has been changed. Your access level has been changed to ${member.access_level}.`,
        type: 'Repository',
        object_id: repoID,
        content_type: 9999,
        is_read: false,
        is_deleted: false
      })
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

      const repo = await fetchRepositoryData(repoID)

      await addNotification({
        sender: userData.uid,
        receiver: member.user.uid,
        title: 'Membership Removed from Repository',
        message: `Your membership in ${repo?.title} has been removed. You are no longer a member of this repository.`,
        type: 'Repository',
        object_id: repoID,
        content_type: 9999,
        is_read: false,
        is_deleted: false
      })
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

    const repo = await fetchRepositoryData(repoID)

    await addNotification({
      sender: userData.uid,
      receiver: member.user.uid,
      title: 'Added to Repository',
      message: `You have been added to ${repo?.title} with ${member.access_level} access level`,
      type: 'Repository',
      object_id: repoID,
      content_type: 9999,
      is_read: false,
      is_deleted: false
    })
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

    const repo = await fetchRepositoryData(repoID)

    await addNotification({
      sender: userData.uid,
      receiver: member.user.uid,
      title: 'Added to Repository',
      message: `You have been added to ${repo?.title} with ${member.access_level} access level`,
      type: 'Repository',
      object_id: repoID,
      content_type: 9999,
      is_read: false,
      is_deleted: false
    })
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
    removeRepoMember,
    fetchCustomUsers,
  }

}