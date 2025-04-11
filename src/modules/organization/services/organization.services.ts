import {Organization} from "../../../interfaces/organization.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive, ref} from "vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {useCustomUsersServices} from "../../repository/services/custom-users.services.ts";
import {useOrganizationAttachmentServices} from "./organization-attachments.services.ts";

// const transformRepData = (rep: any) => ({
//   full_name: rep?.full_name,
//   email: rep?.email,
//   phone: rep?.phone,
// });
//
// const transformRepDataFromAPI = (rep: any) => ({
//   full_name: rep?.full_name,
//   email: rep?.email,
//   phone: rep?.phone,
// });
const {mapCustomUsers} = useCustomUsersServices()
const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
const {isEmptyObject} = useObjectChecker()
const {fetchAttachmentsByOrganization, addAttachment, updateAttachment} = useOrganizationAttachmentServices()
// const {router} = useRouting()
const {myOrganizations, allOrganizations, mapOrganizations, organization, searchedMapOrganizations} = useOrganizationStore();



export const useOrganizationServices = () => {
  const errorMessageIntialState = reactive({
    name: '',
    acronym: '',
    description: '',
    geojson: '',
    slug: '',
    image: '',
    website: '',
    address: '',
    tel: '',
    phone: '',
    email: '',
    president: '',
    rd_rep: '',
    tt_rep: '',
    ic_rep: '',
    sc_rep:'',
  });

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

  // const handleError = (data: any) => {
  //   clearErrorMessage();
  //   errorMessage.full_name = data.full_name?.[0] ?? errorMessage.full_name;
  //   errorMessage.acronym = data.acronym?.[0] ?? errorMessage.acronym;
  //   errorMessage.website = data.website?.[0] ?? errorMessage.website;
  //   errorMessage.address = data.address?.[0] ?? errorMessage.address;
  //   errorMessage.phone = data.phone?.[0] ?? errorMessage.phone;
  //   errorMessage.email = data.email?.[0] ?? errorMessage.email;
  //
  //   errorMessage.rd_rep = {
  //     email: data.rdc_rep?.email?.[0] ?? errorMessage.rd_rep.email,
  //     full_name: data.rdc_rep?.full_name?.[0] ?? errorMessage.rd_rep.full_name,
  //     phone: data.rdc_rep?.phone?.[0] ?? errorMessage.rd_rep.phone,
  //   };
  //
  //   errorMessage.tt_rep = {
  //     email: data.ttc_rep?.email?.[0] ?? errorMessage.tt_rep.email,
  //     full_name: data.ttc_rep?.full_name?.[0] ?? errorMessage.tt_rep.full_name,
  //     phone: data.ttc_rep?.phone?.[0] ?? errorMessage.tt_rep.phone,
  //   };
  //
  //   errorMessage.ic_rep = {
  //     email: data.icc_rep?.email?.[0] ?? errorMessage.ic_rep.email,
  //     full_name: data.icc_rep?.full_name?.[0] ?? errorMessage.ic_rep.full_name,
  //     phone: data.icc_rep?.phone?.[0] ?? errorMessage.ic_rep.phone,
  //   };
  //
  //   errorMessage.sc_rep = {
  //     email: data.scc_rep?.email?.[0] ?? errorMessage.sc_rep.email,
  //     full_name: data.scc_rep?.full_name?.[0] ?? errorMessage.sc_rep.full_name,
  //     phone: data.scc_rep?.phone?.[0] ?? errorMessage.sc_rep.phone,
  //   };
  // };

  // const handleDynamicErrorMapping = (data: any, target: any) => {
  //   Object.keys(data).forEach(key => {
  //     console.log(key)
  //     if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
  //       handleDynamicErrorMapping(data[key], target[key]);
  //     } else {
  //       target[key] = data[key]?.[0] ?? target[key];
  //     }
  //   });
  // };

  // Key mapping from data keys to target keys
  const keyMapping = {
    ttc_rep: 'tt_rep',
    icc_rep: 'ic_rep',
    scc_rep: 'sc_rep',
    rdc_rep: 'rd_rep',
  };

  const handleDynamicErrorMapping = (data: any, target: any, keyMapping: any) => {
    Object.keys(data).forEach(key => {
      const targetKey = keyMapping[key] || key; // Map key if a mapping exists, otherwise use the key as-is
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Ensure the nested object exists in the target
        if (!target[targetKey]) {
          target[targetKey] = {}; // Create the nested object if it doesn't exist
        }
        handleDynamicErrorMapping(data[key], target[targetKey], keyMapping);
      } else {
        target[targetKey] = data[key]?.[0] ?? target[targetKey];
      }
    });
  };



  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageIntialState });
  };

  const saveOrganization = async (organization: Organization, endpoint: string, type: string, id: string = '') => {
    clearErrorMessage();
    loading.value = true;
    console.log('rep')
    console.log(organization.rd_rep)
    try {
      const res = await (type === 'create' ? server.post : server.put)(
        endpoint,
        {
          tel_phone: organization.tel_phone,
          sub_org_type: organization.sub_org_type,
          description: organization.description,
          president: organization.president,
          visibility: organization.visibility,
          org_type: organization.org_type,
          name: organization.name,
          acronym: organization.acronym,
          address: organization.address,
          phone: organization.phone,
          email: organization.email,
          website: organization.website,
          rdc_rep: organization.rd_rep,
          ttc_rep: organization.tt_rep,
          icc_rep: organization.ic_rep,
          scc_rep: organization.sc_rep,
          additional_info: organization.additional_info,
          is_active: true,
          is_approved: true
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`,
          }
        }
      );

      await server.put(
        `/v1/organization/${res.data.uid}/update`,
        {
          image: organization.image,
          tel_phone: organization.tel_phone,
          sub_org_type: organization.sub_org_type,
          description: organization.description,
          president: organization.president,
          visibility: organization.visibility,
          org_type: organization.org_type,
          name: organization.name,
          acronym: organization.acronym,
          address: organization.address,
          phone: organization.phone,
          email: organization.email,
          website: organization.website,
          geojson: organization.geojson,
          additional_info: organization.additional_info,
          is_active: organization.is_active,
          is_approved: organization.is_approved
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if(type == 'create'){
        // @ts-ignore
        if(organization.files?.length > 0  && organization.files) {
          for (let i = 0; i < organization.files.length; i++) {
            organization.files[i].organization! = res.data.uid
            await addAttachment(organization.files[i]);
          }
        }
        await addMemberToOrganization(res.data.uid);
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Organization created successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/my-organizations';
        }, 3000);

        // await router.push({path: '/my-organizations'});
      } else if(type == 'update'){
        // @ts-ignore
        if(organization.files?.length > 0  && organization.files) {
          for (let i = 0; i < organization.files.length; i++) {
            organization.files[i].organization! = res.data.uid
            if(organization.files[i].type == 'create') {
              await addAttachment(organization.files[i]);
            } else {
              if(organization.files[i].isDescriptionUpdated || organization.files[i].isFileUpdated) {
                await updateAttachment(organization.files[i]);
              }
            }
          }
        }
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Organization updated successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = `/my-organizations/${id}`
        }, 3000);

        // await router.push({name: 'my-organization-data', params: {slug: organization.slug}});
      }
    } catch (e: any) {
      loading.value = false;
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      clearErrorMessage();
      console.log(e);
      handleDynamicErrorMapping(e.response?.data, errorMessage, keyMapping);
      return;
    }
  };

  const addMemberToOrganization = async(orgID: string) => {
    try {
      await server.post(`/v1/user/${userData.uid}/organizations`, {
        user: userData.uid,
        organization: orgID,
        access_level: 'owner'
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      // console.log(res.data);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      // console.log(e.response?.data);
      return;
    }
  }

  const addOrganization = async (organization: Organization) => {
    await saveOrganization(organization, `/v1/organization/`, 'create');
    // await router.push({path: '/my-organizations'});
  };

  const updateOrganization = async (organization: Organization, id: string) => {
    await saveOrganization(organization, `/v1/organization/${id}/update`, 'update', id);
  };

  const deleteOrganization = async (id: string) => {
    try {
      await server.patch(`/v1/organization/${id}/update`, {
        is_deleted: true
      },{
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      await localStorage.setItem('snackbarmessage', JSON.stringify({
        message: 'Organization deleted successfully',
        status: 'success'
      }))
      // console.log(res.data);
    } catch (e: any) {
      console.log(e.response?.data);
      return;
    }
  }

  const mapOrgFields = async (org: any, type: string, isAssociatedDataIncluded: boolean): Promise<Organization> => {
    const organization = org.organization || org;
    const baseData = {
      is_active: organization?.is_active,
      is_approved: organization?.is_approved,
      additional_info: organization?.additional_info ?? '',
      is_member: false,
      is_deleted: organization?.is_deleted,
      access_level: org?.access_level ?? '',
      visibility: organization?.visibility ?? '',
      sub_org_type: organization?.sub_org_type ?? '',
      org_type: organization?.org_type ?? '',
      uid: organization?.uid ?? '',
      acronym: organization?.acronym ?? '',
      name: organization?.name ?? '',
      address: organization?.address ?? '',
      phone: organization?.phone ?? '',
      email: organization?.email ?? '',
      website: organization?.website ?? '',
      geojson: isEmptyObject(organization?.geojson) ? {} : organization.geojson,
      is_public: organization?.is_public ?? false,
      image: organization?.image ?? 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
      type: organization?.org_type ?? '',
      tel_phone: organization?.tel_phone ?? '',
      president: organization?.president ?? '',
      slug: organization?.uid ?? '',
      description: organization?.description ?? ''
    }

    if (!isAssociatedDataIncluded) return baseData;

    const [rd_rep, tt_rep, ic_rep, sc_rep, attachments] = await Promise.all([
      mapCustomUsers(JSON.parse(organization?.rdc_rep).data),
      mapCustomUsers(JSON.parse(organization?.ttc_rep).data),mapCustomUsers(JSON.parse(organization?.icc_rep).data),
      mapCustomUsers(JSON.parse(organization?.scc_rep).data),
      fetchAttachmentsByOrganization(organization.uid, type)
    ])

    return {
      ...baseData,
      rd_repData: rd_rep,
      tt_repData: tt_rep,
      ic_repData: ic_rep,
      sc_repData: sc_rep,
      files: attachments
    }
  };

  const mapOrgData = async (rawData: any, type: string = 'create', isAssociatedDataIncluded: boolean = false): Promise<Organization[]> => {
    return Promise.all(rawData.map((org: any) => mapOrgFields(org, type, isAssociatedDataIncluded)));
  };

  const changeOrganizationVisibility = async (id: string, visibility: number) => {
    try {
      await server.patch(`/v1/organization/${id}/update`, {
        visibility: visibility
      },{
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      // console.log(res.data);
    } catch (e: any) {
      console.log(e.response?.data);
      return;
    }
  }


  // @ts-ignore
  const fetchOrganizationByUserWithPagination = async (pageNumber: number) : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/user/${userData.uid}/organizations?page=${pageNumber}&page_size=5&is_deleted=false`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results
      const organizations: Organization[] = (await mapOrgData(rawData)).filter((org: any) => !org.is_deleted && org.is_approved)
      myOrganizations.value = [...myOrganizations.value,...organizations];
      return organizations;
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const fetchOrganizationByUser = async () : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/user/${userData.uid}/organizations`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = (await mapOrgData(rawData)).filter((org: any) => !org.is_deleted && org.is_approved)
      const data = [ ...organizations];
      // myOrganizations.value = [...myOrganizations.value, ...data];
      myOrganizations.value = data
      return data;
    } catch (e) {
      return []
    }
  }

  const fetchOrganizationByAdmin = async () : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/organization`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = await mapOrgData(rawData.filter((org: any) => !org.is_deleted && org.is_approved))
      const data = [ ...organizations];
      myOrganizations.value = data
      return data;
    } catch (e) {
      return []
    }
  }

  const fetchOrganizationIDsByUser = async () : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/user/${userData.uid}/organizations`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });

      const rawData = res.data.results;
      const organizations: Organization[] = rawData.map((org: any) => {
        return {
          uid: org.organization.uid,
          slug: org.organization.uid
        }
      })
      const data = [ ...organizations];
      myOrganizations.value = data
      return data;
    } catch (e) {
      console.log(e)
      return []
    }
  }

  const fetchOrganizationsWithPagination = async (pageNumber: number): Promise<Organization[]> => {
    let data: Organization[] = [];
    try {
      if (user.value) {
        const publicOrg = await fetchPaginatedOrganizations(pageNumber, [1, 4]);
        const userDataOrg = await fetchOrganizationByUserWithPagination(pageNumber);
        let combinedData = [...publicOrg, ...userDataOrg];
        const uniqueData = Array.from(new Set(combinedData.map(org => org.slug)))
          .map(slug => combinedData.find(org => org.slug === slug));
        // @ts-ignore
        data = uniqueData ;
      } else {
        data = await fetchPaginatedOrganizations(pageNumber, [1]);
      }
      allOrganizations.value = [...allOrganizations.value, ...data];
      return data;
    } catch (e) {
      return data;
    }
  };

  const fetchPaginatedOrganizations = async (pageNumber: number, visibilities: number[]): Promise<Organization[]> => {
    const promises = visibilities.map(async (visibility) => {
      const res = await server.get(`/v1/organization?page=${pageNumber}&page_size=5&visibility=${visibility}`, {
        headers: authorizationHeader,
      });
      return mapOrgData(res.data.results);
    });

    const results = await Promise.all(promises);
    return results.flat().filter((org: any) => !org.is_deleted && org.is_active && org.is_approved);
  };


  const fetchOrganizations = async (): Promise<Organization[]> => {
    try {
      let data: Organization[] = [];
      if (user.value) {
        const visibilityData = await fetchOrganizationsByVisibility([1, 4]);
        const userOrg = await fetchOrganizationByUser();
        const filteredVisibilityData = visibilityData.flat().filter((org: any) => org.is_active && org.is_approved);
        let combinedData = [...filteredVisibilityData, ...userOrg];
        const uniqueData = Array.from(new Set(combinedData.map(org => org.slug)))
          .map(slug => combinedData.find(org => org.slug === slug));
        // @ts-ignore
        data = uniqueData ;
      } else {
        const visibilityData = await fetchOrganizationsByVisibility([1]);
        data = visibilityData[0].filter((org: any) => org.is_active && org.is_approved);
      }
      mapOrganizations.value = data.filter(org =>  !org.is_deleted && org.is_approved);
      allOrganizations.value = data.filter(org =>  !org.is_deleted && org.is_approved);
      searchedMapOrganizations.value = data.filter(org =>  !org.is_deleted && org.is_approved);
      return data;
    } catch (e) {
      return [];
    }
  };

  const fetchOrganizationsByVisibility = async (visibilities: number[]): Promise<Organization[][]> => {
    const promises = visibilities.map(async (visibility) => {
      const res = await server.get(`/v1/organization/?page_size=100&visibility=${visibility}`, {
        headers: authorizationHeader
      });
      return mapOrgData(res.data.results);
    });
    return Promise.all(promises);
  };


  const fetchOrganizationData = async (slug: string, type: string = 'create'): Promise<Organization | null> => {
    try{
      const res = await server.get(`/v1/organization/${slug}/`, {
        headers: authorizationHeader
      });
      const rawData = res.data.results;
      const organizationData: Organization = await mapOrgFields(rawData[0], type,true)
      if (organizationData) {
        organization.value = organizationData
        return organizationData
      } else {
        console.error('no org')
        return null;
      }
    } catch (e) {
      return null;
    }

  }

  const fetchAllOrganizationsBasicData = async (
      pageNumber: number,
      pageSize: number,
  ) : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/organization/?page=${pageNumber}&page_size=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = rawData.map((org: any) => {
        return {
          uid: org.uid,
          slug: org.uid,
          name: org.name,
          acronym: org.acronym
        }
      })
      const data = [ ...organizations];
      myOrganizations.value = data
      return data;
    } catch (e) {
      return []
    }
  }

  const manageOrgStatus = async (id: string, isActive: boolean) => {
    try {
      if(userData.is_superuser) {
        await server.patch(`/v1/organization/${id}/update`, {
          is_approved: true,
          is_active: isActive
        }, {
          headers: authorizationHeader
        });
      } else {
         await server.patch(`/v1/organization/${id}/update`, {
          is_active: isActive
        }, {
          headers: authorizationHeader
        });
      }
    } catch (e) {
      console.log(e)
      return;
    }
  }

  const manageOrgAdminStatus = async (id: string, isEnabled: boolean) => {
    try {
      await server.patch(`/v1/organization/${id}/update`, {
        is_approved: isEnabled
      }, {
        headers: authorizationHeader
      });
    } catch (e) {
      console.log(e)
      return;
    }
  }

  const fetchAllOrganizations = async (
      pageNumber: number,
      pageSize: number,
      searchQuery?: string,
      isApproved?: string | boolean,
      isActive?: string | boolean,
  ) : Promise<Organization[]> => {
    try{
      let url = `/v1/organization/?page=${pageNumber}&page_size=${pageSize}`;
      if (searchQuery && searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (typeof isApproved === 'boolean') {
        url += `&is_approved=${isApproved}`;
      }
      if (typeof isActive === 'boolean') {
        url += `&is_active=${isActive}`;
      }
      const res = await server.get(url, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = await mapOrgData(rawData)
      const data = [ ...organizations];
      myOrganizations.value = data
      return data;
    } catch (e) {
      return []
    }
  }

  const fetchOrganizationCount= async (
      pageNumber: number,
      pageSize: number,
      searchQuery?: string,
      isApproved?: string | boolean,
      isActive?: string | boolean,
  ) : Promise<number> => {
    try{
      let url = `/v1/organization/?page=${pageNumber}&page_size=${pageSize}`;
      if (searchQuery && searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (typeof isApproved === 'boolean') {
        url += `&is_approved=${isApproved}`;
      }
      if (typeof isActive === 'boolean') {
        url += `&is_active=${isActive}`;
      }
      const res = await server.get(url, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      return res.data.results.length;
    } catch (e) {
      return 0
    }
  }

  const fetchOrganizationVisibility = async (id: string) : Promise<number> => {
    try {
      const res = await server.get(`/v1/organizations/${id}`, {
        headers: authorizationHeader
      });

      return res.data.results[0].visibility
    } catch (e: any) {
      console.log(e)
      return 1;

    }
  }

  return {
    loading,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
    fetchOrganizationByUser,
    fetchOrganizationByAdmin,
    fetchOrganizationByUserWithPagination,
    fetchOrganizations,
    fetchOrganizationsWithPagination,
    fetchOrganizationData,
    fetchOrganizationIDsByUser,
    changeOrganizationVisibility,
    fetchAllOrganizationsBasicData,
    manageOrgStatus,
    manageOrgAdminStatus,
    fetchAllOrganizations,
    fetchOrganizationCount,
    fetchOrganizationVisibility
  };
};
