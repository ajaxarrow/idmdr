import { useUserStore } from "../../../core/stores/user.store.ts";
import {ref } from "vue";
import {OrgMember, User} from "../../../interfaces/member.interface.ts";
import { server } from "../../../plugins/axios.ts";
import { Status } from "../../../interfaces/enums/status.enum.ts";
import { useSnackbarStore } from "../../../core/stores/snackbar.store.ts";
import {useNotificationsServices} from "../../user/services/notifications.services.ts";
import {useOrganizationServices} from "./organization.services.ts";

export const useOrganizationMembersServices = () => {
  // Store access and helper constants
  const { userData, user } = useUserStore();
  const { showSnackbarMessage } = useSnackbarStore();
  const authorizationHeader = user.value
    ? { Authorization: `Bearer ${userData.accessToken}` }
    : {};
  const {addNotification} = useNotificationsServices()
  const {fetchOrganizationData} = useOrganizationServices()
  const loading = ref(false);


  const mapOrgMembers = (rawData: any): OrgMember[] => {
    return rawData.map((member: any) => ({
      membership_uid: member.membership_uid,
      user: {
        uid: member.user.uid,
        username: member.user.username,
        first_name: member.user.first_name,
        last_name: member.user.last_name,
        email: member.user.email,
        profile_picture: member.user.profile_picture,
      },
      access_level: member.access_level,
      is_deleted: member.is_deleted,
    }));
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const res = await server.get(`/users/`, {
        headers: authorizationHeader,
      });

      return res.data.results
        .filter((user: any) => user.is_approved && user.is_active)
        .map((user: any) => ({
          uid: user.uid,
          username: user.username ?? `${user.first_name} ${user.last_name}`,
          first_name: user.first_name ?? user.username,
          last_name: user.last_name,
          email: user.email,
          is_active: user.is_active,
          is_approved: user.is_approved,
          profile_picture: user.profile_picture ?? 'https://mighty.tools/mockmind-api/content/abstract/46.jpg',
        }));
    } catch {
      return [];
    }
  }



  const fetchUser = async (uid: string): Promise<User | null> => {
    try {
      const res = await server.get(`/users/${uid}`, {
        headers: authorizationHeader,
      });

      return res.data.results
        .filter((user: any) => user.username)
        .map((user: any) => ({
          uid: user.uid,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_picture: user.profile_picture,
        }))[0];
    } catch (e){
      console.log(e)
      return null;
    }
  }

  // API Functions
  const fetchOrgMembers = async (orgID: string): Promise<OrgMember[]> => {
    try {
      const res = await server.get(`/org-users/${orgID}`, {
        headers: authorizationHeader,
      });
      return mapOrgMembers(res.data.results);
    } catch {
      return [];
    }
  };

  const addOrgMember = async (orgID: string, member: OrgMember) => {
    const orgMembers = await fetchOrgMembers(orgID);
    const existingMember = orgMembers.find((m) => m.user.uid === member.user.uid);

    try {
      if (existingMember) {
        if (existingMember.is_deleted) {
          await restoreOrgMember(orgID, existingMember, member.access_level);
          return;
        }
      } else {
        await createOrgMember(orgID, member);
      }
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const updateOrgMember = async (orgID: string, member: OrgMember) => {
    try {
      await server.put(
        `/v1/user/organizations/update/${member.membership_uid}`,
        {
          organization: orgID,
          membership_uid: member.membership_uid,
          user: member.user.uid,
          access_level: member.access_level,
          is_deleted: false,
        },
        { headers: authorizationHeader }
      );

      const org = await fetchOrganizationData(orgID)

      await addNotification({
        sender: userData.uid,
        receiver: member.user.uid,
        title: 'Access Level Changed for Membership from Organization',
        message: `Your membership in ${org?.name} has been changed. Your access level has been changed to ${member.access_level}.`,
        type: 'Organization',
        object_id: orgID,
        content_type: 14,
        is_read: false,
        is_deleted: false
      })
    } catch (e: any) {
      handleApiError(e);
    }
  };

  const removeOrgMember = async (orgID: string, member: OrgMember) => {
    try {
      await server.put(
        `/v1/user/organizations/update/${member.membership_uid}`,
        {
          organization: orgID,
          user: member.user.uid,
          access_level: member.access_level,
          membership_uid: member.membership_uid,
          is_deleted: true,
        },
        { headers: authorizationHeader }
      );

      const org = await fetchOrganizationData(orgID)

      await addNotification({
        sender: userData.uid,
        receiver: member.user.uid,
        title: 'Membership Removed from Organization',
        message: `Your membership in ${org?.name} has been removed. You are no longer a member of this organization.`,
        type: 'Organization',
        object_id: orgID,
        content_type: 14,
        is_read: false,
        is_deleted: false
      })

    } catch (e: any) {
      handleApiError(e);
    }
  };

  // Helper Functions
  const createOrgMember = async (orgID: string, member: OrgMember) => {
    await server.post(
      `/v1/user/${userData.uid}/organizations`,
      {
        user: member.user.uid,
        organization: orgID,
        access_level: member.access_level,
      },
      { headers: authorizationHeader }
    );

    const org = await fetchOrganizationData(orgID)

    await addNotification({
      sender: userData.uid,
      receiver: member.user.uid,
      title: 'Added to Organization',
      message: `You have been added to ${org?.name} with ${member.access_level} access level`,
      type: 'Organization',
      object_id: orgID,
      content_type: 14,
      is_read: false,
      is_deleted: false
    })
  };

  const restoreOrgMember = async (orgID: string, member: OrgMember, newAccessLevel: string) => {
    await server.put(
      `/v1/user/organizations/update/${member.membership_uid}`,
      {
        membership_uid: member.membership_uid,
        user: member.user.uid,
        organization: orgID,
        access_level: newAccessLevel,
        is_deleted: false,
      },
      { headers: authorizationHeader }
    );

    const org = await fetchOrganizationData(orgID)

    await addNotification({
      sender: userData.uid,
      receiver: member.user.uid,
      title: 'Added to Organization',
      message: `You have been added to ${org?.name} with ${member.access_level} access level`,
      type: 'Organization',
      object_id: orgID,
      content_type: 14,
      is_read: false,
      is_deleted: false
    })
  };

  const handleApiError = (e: any) => {
    showSnackbarMessage("OOPS! Something went wrong", Status.error);
    console.error(e.response || e.message);
  };

  return {
    mapOrgMembers,
    loading,
    fetchOrgMembers,
    addOrgMember,
    updateOrgMember,
    removeOrgMember,
    fetchUsers,
    fetchUser
  };
};
