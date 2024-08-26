import { Organization } from "../../../interfaces/organization.interface.ts";
import { server } from "../../../plugins/axios.ts";
import { useUserStore } from "../../../core/stores/user.store.ts";
import { reactive } from "vue";
import { useSnackbarStore } from "../../../core/stores/snackbar.store.ts";
import { Status } from "../../../interfaces/enums/status.enum.ts";
import { OrganizationType } from "../../../interfaces/enums/organization.enum.ts";
import organizationData from "../../../data/organizations.ts";
import { useOrganizationStore } from "../stores/organization.store.ts";
import router from "../../../router";

// Utility function to transform representative data
const transformRepData = (rep: any, fromAPI = false) => ({
  name: fromAPI ? rep?.full_name : rep?.name,
  email: rep?.email,
  phone: rep?.phone,
});

const { userData } = useUserStore();
const { showSnackbarMessage } = useSnackbarStore();
const { myOrganizations } = useOrganizationStore();

export const useOrganizationServices = () => {
  const initialErrorState = reactive({
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
    rd_rep: { email: '', name: '', phone: '' },
    tt_rep: { email: '', name: '', phone: '' },
    ic_rep: { email: '', name: '', phone: '' },
    sc_rep: { email: '', name: '', phone: '' },
  });

  const errorMessage = reactive({ ...initialErrorState });

  const hasErrorMessages = (errors: any): boolean =>
    Object.keys(errors).some(key => {
      const value = errors[key];
      return typeof value === 'string' && value.trim().length > 0 ||
        typeof value === 'object' && !Array.isArray(value) && hasErrorMessages(value);
    });

  const handleError = (data: any) => {
    clearErrorMessage();
    errorMessage.name = data.name?.[0] ?? errorMessage.name;
    errorMessage.acronym = data.acronym?.[0] ?? errorMessage.acronym;
    errorMessage.website = data.website?.[0] ?? errorMessage.website;
    errorMessage.address = data.address?.[0] ?? errorMessage.address;
    errorMessage.phone = data.phone?.[0] ?? errorMessage.phone;
    errorMessage.email = data.email?.[0] ?? errorMessage.email;

    errorMessage.rd_rep = {
      email: data.rdc_rep?.email?.[0] ?? errorMessage.rd_rep.email,
      name: data.rdc_rep?.full_name?.[0] ?? errorMessage.rd_rep.name,
      phone: data.rdc_rep?.phone?.[0] ?? errorMessage.rd_rep.phone,
    };

    errorMessage.tt_rep = {
      email: data.ttc_rep?.email?.[0] ?? errorMessage.tt_rep.email,
      name: data.ttc_rep?.full_name?.[0] ?? errorMessage.tt_rep.name,
      phone: data.ttc_rep?.phone?.[0] ?? errorMessage.tt_rep.phone,
    };

    errorMessage.ic_rep = {
      email: data.icc_rep?.email?.[0] ?? errorMessage.ic_rep.email,
      name: data.icc_rep?.full_name?.[0] ?? errorMessage.ic_rep.name,
      phone: data.icc_rep?.phone?.[0] ?? errorMessage.ic_rep.phone,
    };

    errorMessage.sc_rep = {
      email: data.scc_rep?.email?.[0] ?? errorMessage.sc_rep.email,
      name: data.scc_rep?.full_name?.[0] ?? errorMessage.sc_rep.name,
      phone: data.scc_rep?.phone?.[0] ?? errorMessage.sc_rep.phone,
    };
  };

  const handleDynamicErrorMapping = (data: any, target: any) => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        handleDynamicErrorMapping(data[key], target[key]);
      } else {
        target[key] = data[key]?.[0] ?? target[key];
      }
    });
  };

  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...initialErrorState });
  };

  const saveOrganization = async (organization: Organization, endpoint: string) => {
    clearErrorMessage();

    try {
      const res = await server.post(endpoint, {
        is_public: organization.is_public,
        name: organization.name,
        acronym: organization.acronym,
        address: organization.address,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        geojson: organization.geojson,
        rdc_rep: transformRepData(organization.rd_rep),
        ttc_rep: transformRepData(organization.tt_rep),
        icc_rep: transformRepData(organization.ic_rep),
        scc_rep: transformRepData(organization.sc_rep),
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });

      await addMemberToOrganization(res.data.uid);
      await router.push({ path: '/my-organizations' });
      showSnackbarMessage('Organization created successfully', Status.success);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      handleError(e.response?.data);
    }
  };

  const addMemberToOrganization = async (orgID: string) => {
    try {
      await server.post(`/v1/user/${userData.uid}/organizations`, {
        user: userData.uid,
        organization: orgID,
        access_level: 'admin'
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
    }
  };

  const addOrganization = async (organization: Organization) => {
    await saveOrganization(organization, `/v1/organization/`);
  };

  const updateOrganization = async (organization: Organization, id: string) => {
    await saveOrganization(organization, `/v1/organization/${id}/update`);
  };

  const fetchOrganizations = async (url: string): Promise<Organization[]> => {
    try {
      const res = await server.get(url, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      return res.data.results.map((org: any) => ({
        uid: org.uid || org.organization.uid,
        acronym: org.acronym || org.organization.acronym,
        name: org.name || org.organization.name,
        address: org.address || org.organization.address,
        phone: org.phone || org.organization.phone,
        email: org.email || org.organization.email,
        website: org.website || org.organization.website,
        tt_rep: transformRepData(org.ttc_rep || org.organization.ttc_rep, true),
        ic_rep: transformRepData(org.icc_rep || org.organization.icc_rep, true),
        sc_rep: transformRepData(org.scc_rep || org.organization.scc_rep, true),
        rd_rep: transformRepData(org.rdc_rep || org.organization.rdc_rep, true),
        geojson: JSON.parse(org.geojson || org.organization.geojson),
        is_public: org.is_public || org.organization.is_public,
        image: 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
        type: OrganizationType.Institution,
        tel: '221-2237 ',
        president: 'Anie Joseph Cabahug',
        slug: org.uid || org.organization.uid,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla nisl non eros facilisis, a euismod lorem egestas. Integer convallis metus a elit efficitur, a viverra turpis dignissim. Mauris hendrerit nibh eu nulla consequat, non laoreet turpis venenatis. Ut vitae augue vitae lectus vehicula suscipit. Sed bibendum eros at mi convallis, non sodales nisi iaculis.

        Nunc convallis, dui a varius lacinia, odio justo consequat arcu, ut tincidunt purus dolor at libero. Duis ut cursus velit. Vivamus vel risus velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam nec dui vitae felis elementum volutpat at et lorem. Donec consectetur, sem id volutpat aliquam, nulla nunc cursus libero, sit amet viverra nulla elit a felis.`
      }));
    } catch (e) {
      return [];
    }
  };

  const fetchOrganizationByUserWithPagination = (pageNumber: number): Promise<Organization[]> => {
    return fetchOrganizations(`/v1/user/${userData.uid}/organizations?page=${pageNumber}&page_size=5`);
  };

  const fetchOrganizationByUser = async (): Promise<Organization[]> => {
    const organizations = await fetchOrganizations(`/v1/user/${userData.uid}/organizations`);
    const data = [...organizationData, ...organizations];
    myOrganizations.value = data;
    return data;
  };

  const fetchOrganizationsWithPagination = (pageNumber: number): Promise<Organization[]> => {
    return fetchOrganizations(`/v1/organization?page=${pageNumber}&page_size=5`);
  };

  return {
    addOrganization,
    updateOrganization,
    fetchOrganizationByUserWithPagination,
    fetchOrganizationByUser,
    fetchOrganizationsWithPagination,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
  };
};
