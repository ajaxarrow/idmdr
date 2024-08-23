import { Organization } from "../../../interfaces/organization.interface.ts";
import { server } from "../../../plugins/axios.ts";
import { useUserStore } from "../../../core/stores/user.store.ts";
import { reactive } from "vue";

// Function to transform representative data
const transformRepData = (rep: any) => ({
  full_name: rep?.name,
  email: rep?.email,
  phone: rep?.phone,
});

export const useOrganizationServices = () => {
  const { userData } = useUserStore();

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

      console.log(res.data);
    } catch (e: any) {
      console.log(e.response?.data);
      handleError(e.response?.data);
      // clearErrorMessage();
      // handleDynamicErrorMapping(e.response?.data, errorMessage);
    }
  };

  const addOrganization = async (organization: Organization) => {
    await saveOrganization(organization, '/v1/organization/');
  };

  const updateOrganization = async (organization: Organization, id: string) => {
    await saveOrganization(organization, `/v1/organization/${id}/update`);
  };

  return {
    addOrganization,
    updateOrganization,
    errorMessage,
    clearErrorMessage,
  };
};
