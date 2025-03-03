import {useUserStore} from "../../../core/stores/user.store.ts";
import {ref} from "vue";
import {Expert} from "../../../interfaces/organization.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useOrganizationServices} from "./organization.services.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";


const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {fetchOrganizationByUser} = useOrganizationServices()
const {stringToArray} = useStringArrayHelper()

export const useOrganizationExpertsServices = () => {
  const loading = ref(false);

  const saveExpert = async (expert: Expert, endpoint: string, type: string, orgID: string, id: string = '') => {
    loading.value = true;
    try {
      await (type === 'create' ? server.post : server.put)(
        endpoint,
        expert, {
          headers: authorizationHeader
        }
      );

      if(type === 'create'){
        setTimeout(async function() {
          window.location.href = `/my-organizations/${orgID}/experts/`;
        }, 3000);
      } else {
        setTimeout(async function() {
          window.location.href = `/my-organizations/${orgID}/experts/${id}`;
        }, 3000);
      }

      await localStorage.setItem('snackbarmessage', JSON.stringify({
        message: `CMI Expert ${type === 'create' ? 'added' : 'updated'}  successfully`,
        status: 'success'
      }))

      // loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  };

  const addExpert = async (expert: Expert, orgID: string, ) => {
    await saveExpert(expert, '/experts/', 'create', orgID);
  };

  const updateExpert = async (expert: Expert, id: string, orgID: string) => {
    await saveExpert(expert, `/experts/${id}/`, 'update', orgID, id);
  };

  const deleteExpert = async (id: string) => {
    try {
      await server.delete(`/experts/${id}/`, {
        headers: authorizationHeader
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const mapExpertData = (expert: Expert): Expert => {
    return {
      uid: expert.uid,
      name: JSON.parse(expert.name as string),
      contact: expert.contact,
      expertise: expert.expertise ? stringToArray(<string>expert.expertise) : '',
      organization: expert.organization,
      additional_info: expert.additional_info || '',
      is_deleted: expert.is_deleted,
      created_at: expert.created_at,
      updated_at: expert.updated_at,
      created_by: expert.created_by
    }
  }

  const fetchExpertById = async (id: string) => {
    try{
      const res = await server.get(`/experts/${id}/`, {
        headers: authorizationHeader
      })
      return mapExpertData(res.data)
    } catch (e: any) {
      console.log(e)
    }
  };

  const fetchExpertsByOrganization = async (slug: string): Promise<Expert[]> => {
    try{
      const res = await server.get(`/experts/?organization=${slug}`, {
          headers: authorizationHeader
      })
      return res.data.map((expert: any) => {
        return mapExpertData(expert)
      })
    } catch (e: any) {
      console.log(e)
      return []
    }
  }

  const fetchAllExperts = async (): Promise<Expert[]> => {
    try {
      const userOrg = await fetchOrganizationByUser();
      const userOrgUids = userOrg.map((org: any) => org.uid);
      const res = await server.get(`/experts/`, {
        headers: authorizationHeader,
      });
      return res.data
        .map((expert: Expert) => mapExpertData(expert))
        // @ts-ignore
        .filter((expert: Expert) => userOrgUids.includes(expert.organization.uid as string));
    } catch (e: any) {
      console.error(e);
      return [];
    }
  };

  return { addExpert, updateExpert, deleteExpert, loading, fetchExpertById, fetchAllExperts, fetchExpertsByOrganization }
}