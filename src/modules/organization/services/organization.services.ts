import {Organization} from "../../../interfaces/organization.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive} from "vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";

// Function to transform representative data
const transformRepData = (rep: any) => ({
  full_name: rep?.name,
  email: rep?.email,
  phone: rep?.phone,
});

export const useOrganizationServices = () => {
  const { userData } = useUserStore();
  const {showSnackbarMessage} = useSnackbarStore();
  const {router} = useRouting()

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

      await router.push({name: 'my-organizations'});
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
    await saveOrganization(organization, `/v1/organization/${userData.uid}/`);
  };

  const updateOrganization = async (organization: Organization, id: string) => {
    await saveOrganization(organization, `/v1/organization/${id}/update`);
  };


  return {
    addOrganization,
    updateOrganization,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages
  };
};
