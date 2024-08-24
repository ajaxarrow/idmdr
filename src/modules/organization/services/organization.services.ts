import {Organization} from "../../../interfaces/organization.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive} from "vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {OrganizationType} from "../../../interfaces/enums/organization.enum.ts";
import organizationData from "../../../data/organizations.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import router from "../../../router";

// Function to transform representative data
const transformRepData = (rep: any) => ({
  full_name: rep?.name,
  email: rep?.email,
  phone: rep?.phone,
});

const transformRepDataFromAPI = (rep: any) => ({
  name: rep?.full_name,
  email: rep?.email,
  phone: rep?.phone,
});
const { userData } = useUserStore();
const {showSnackbarMessage} = useSnackbarStore();
// const {router} = useRouting()
const {myOrganizations, allOrganizations} = useOrganizationStore();

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
    rd_rep: {
      email: '',
      name: '',
      phone: '',
    },
    tt_rep: {
      email: '',
      name: '',
      phone: '',
    },
    ic_rep: {
      email: '',
      name: '',
      phone: '',
    },
    sc_rep: {
      email: '',
      name: '',
      phone: '',
    },
  });

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
    Object.assign(errorMessage, { ...errorMessageIntialState });
  };

  const saveOrganization = async (organization: Organization, endpoint: string) => {
    clearErrorMessage(); // Clear error messages before making a request

    try {
      const res = await server.post(endpoint, {
        is_public: organization.is_public,
        name: organization.name,
        acronym: organization.acronym,
        address: organization.address,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
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
      await router.push({path: '/my-organizations'});
      showSnackbarMessage('Organization created successfully', Status.success);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      handleError(e.response?.data);
      return;
      // clearErrorMessage();
      // handleDynamicErrorMapping(e.response?.data, errorMessage);
    }
  };

  const addMemberToOrganization = async(orgID: string) => {
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
      // console.log(res.data);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      // console.log(e.response?.data);
      return;
    }
  }

  const addOrganization = async (organization: Organization) => {
    await saveOrganization(organization, `/v1/organization/`);
    // await router.push({path: '/my-organizations'});
  };

  const updateOrganization = async (organization: Organization, id: string) => {
    await saveOrganization(organization, `/v1/organization/${id}/update`);
  };

  const fetchOrganizationByUserWithPagination = async (pageNumber: number) : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/user/${userData.uid}/organizations?page=${pageNumber}&page_size=5`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = rawData.map((org: any) => ({
        uid: org.organization.uid,
        acronym: org.organization.acronym,
        name: org.organization.name,
        address: org.organization.address,
        phone: org.organization.phone,
        email: org.organization.email,
        website: org.organization.website,
        tt_rep: transformRepDataFromAPI(org.organization.ttc_rep),
        ic_rep: transformRepDataFromAPI(org.organization.icc_rep),
        sc_rep: transformRepDataFromAPI(org.organization.scc_rep),
        rd_rep: transformRepDataFromAPI(org.organization.rdc_rep),
        // geojson: org.geojson,
        is_public: org.organization.is_public,
        image: 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
        type: OrganizationType.Institution,
        tel: '221-2237 ',
        president: 'Anie Joseph Cabahug',
        slug: org.organization.uid,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla nisl non eros facilisis, a euismod lorem egestas. Integer convallis metus a elit efficitur,a viverra turpis dignissim. Mauris hendrerit nibh eu nulla consequat, non laoreet turpis venenatis. Ut vitae augue vitae lectus vehicula suscipit. Sed bibendum eros at mi convallis, non sodales nisi iaculis.

        Nunc convallis, dui a varius lacinia, odio justo consequat arcu, ut tincidunt purus dolor at libero. Duis ut cursus velit. Vivamus vel risus velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam nec dui vitae felis elementum volutpat at et lorem. Donec consectetur, sem id volutpat aliquam, nulla nunc cursus libero, sit amet viverra nulla elit a felis.`
      }));
      myOrganizations.value = [...myOrganizations.value, ...organizations];
      return organizations;
    } catch (e) {
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
      const organizations: Organization[] = rawData.map((org: any) => ({
        uid: org.organization.uid,
        acronym: org.organization.acronym,
        name: org.organization.name,
        address: org.organization.address,
        phone: org.organization.phone,
        email: org.organization.email,
        website: org.organization.website,
        tt_rep: transformRepDataFromAPI(org.organization.ttc_rep),
        ic_rep: transformRepDataFromAPI(org.organization.icc_rep),
        sc_rep: transformRepDataFromAPI(org.organization.scc_rep),
        rd_rep: transformRepDataFromAPI(org.organization.rdc_rep),
        // geojson: org.geojson,
        is_public: org.organization.is_public,
        image: 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
        type: OrganizationType.Institution,
        tel: '221-2237 ',
        president: 'Anie Joseph Cabahug',
        slug: org.organization.uid,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla nisl non eros facilisis, a euismod lorem egestas. Integer convallis metus a elit efficitur,a viverra turpis dignissim. Mauris hendrerit nibh eu nulla consequat, non laoreet turpis venenatis. Ut vitae augue vitae lectus vehicula suscipit. Sed bibendum eros at mi convallis, non sodales nisi iaculis.

        Nunc convallis, dui a varius lacinia, odio justo consequat arcu, ut tincidunt purus dolor at libero. Duis ut cursus velit. Vivamus vel risus velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam nec dui vitae felis elementum volutpat at et lorem. Donec consectetur, sem id volutpat aliquam, nulla nunc cursus libero, sit amet viverra nulla elit a felis.`
      }));
      const data = [...organizationData, ...organizations];
      myOrganizations.value = [...myOrganizations.value, ...data];
      return data;
    } catch (e) {
      return []
    }
  }

  const fetchOrganizationsWithPagination = async (pageNumber: number) : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/organization?page=${pageNumber}&page_size=5/`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      console.log(rawData)
      const organizations: Organization[] = rawData.map((org: any) => ({
        uid: org.uid,
        acronym: org.acronym,
        name: org.name,
        address: org.address,
        phone: org.phone,
        email: org.email,
        website: org.website,
        tt_rep: transformRepDataFromAPI(org.ttc_rep),
        ic_rep: transformRepDataFromAPI(org.icc_rep),
        sc_rep: transformRepDataFromAPI(org.scc_rep),
        rd_rep: transformRepDataFromAPI(org.rdc_rep),
        // geojson: org.geojson,
        is_public: org.is_public,
        image: 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
        type: OrganizationType.Institution,
        tel: '221-2237 ',
        president: 'Anie Joseph Cabahug',
        slug: org.uid,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla nisl non eros facilisis, a euismod lorem egestas. Integer convallis metus a elit efficitur,a viverra turpis dignissim. Mauris hendrerit nibh eu nulla consequat, non laoreet turpis venenatis. Ut vitae augue vitae lectus vehicula suscipit. Sed bibendum eros at mi convallis, non sodales nisi iaculis.

        Nunc convallis, dui a varius lacinia, odio justo consequat arcu, ut tincidunt purus dolor at libero. Duis ut cursus velit. Vivamus vel risus velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam nec dui vitae felis elementum volutpat at et lorem. Donec consectetur, sem id volutpat aliquam, nulla nunc cursus libero, sit amet viverra nulla elit a felis.`
      }));
      allOrganizations.value = [...allOrganizations.value, ...organizations];
      return organizations;
    } catch (e) {
      return []
    }
  }

  const fetchOrganizations = async () : Promise<Organization[]> => {
    try{
      const res = await server.get(`/v1/organization/`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const organizations: Organization[] = rawData.map((org: any) => ({
        uid: org.uid,
        acronym: org.acronym,
        name: org.name,
        address: org.address,
        phone: org.phone,
        email: org.email,
        website: org.website,
        tt_rep: transformRepDataFromAPI(org.ttc_rep),
        ic_rep: transformRepDataFromAPI(org.icc_rep),
        sc_rep: transformRepDataFromAPI(org.scc_rep),
        rd_rep: transformRepDataFromAPI(org.rdc_rep),
        // geojson: org.geojson,
        is_public: org.is_public,
        image: 'https://dummyimage.com/600x400/023768/fff.png&text=Org+Image',
        type: OrganizationType.Institution,
        tel: '221-2237 ',
        president: 'Anie Joseph Cabahug',
        slug: org.uid,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla nisl non eros facilisis, a euismod lorem egestas. Integer convallis metus a elit efficitur,a viverra turpis dignissim. Mauris hendrerit nibh eu nulla consequat, non laoreet turpis venenatis. Ut vitae augue vitae lectus vehicula suscipit. Sed bibendum eros at mi convallis, non sodales nisi iaculis.

        Nunc convallis, dui a varius lacinia, odio justo consequat arcu, ut tincidunt purus dolor at libero. Duis ut cursus velit. Vivamus vel risus velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam nec dui vitae felis elementum volutpat at et lorem. Donec consectetur, sem id volutpat aliquam, nulla nunc cursus libero, sit amet viverra nulla elit a felis.`
      }));
      const data = [...organizationData, ...organizations];
      allOrganizations.value = [...allOrganizations.value, ...data];
      return data;
    } catch (e) {
      return []
    }
  }


  const fetchOrganizationData = (slug: string, organizations: Organization[]): Organization | null => {
    const organization = organizations.find(org => org.slug === slug);
    if (organization) {
      return organization;
    } else {
      console.error('no org')
      return null;
    }
  }




  return {
    addOrganization,
    updateOrganization,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
    fetchOrganizationByUser,
    fetchOrganizationByUserWithPagination,
    fetchOrganizations,
    fetchOrganizationsWithPagination,
    fetchOrganizationData,
  };
};
