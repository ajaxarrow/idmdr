import {ref} from "vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import organizationData from "../../../data/organizations.ts";
import {createGlobalState} from "@vueuse/core";

const organization = ref<Organization | null | undefined>();
const selectedOrganization = ref<Organization | null>(null);
const organizations = ref(organizationData);

const selectOrganization = (organization: Organization) => {
  if(selectedOrganization.value === organization) {
    removeSelectedOrganization()
    return;
  }
  selectedOrganization.value = organization;
}

const filterOrganizations = (title: string) => {
  organizations.value = organizationData.filter(organization => organization.name.toLowerCase().includes(title.toLowerCase().trim()));
}

const removeSelectedOrganization = () => {
  selectedOrganization.value = null;
}

const fetchOrganizationData = (slug: string): Organization | null => {
  const organization = organizationData.find(org => org.slug === slug);
  if (organization) {
    return organization;
  } else {
    console.error('no org')
    return null;
  }
}

const setOrganizationData = (slug: string) => {
  organization.value = fetchOrganizationData(slug);
}

export const useOrganizationStore = createGlobalState(() => ({setOrganizationData, organization, filterOrganizations, selectedOrganization, selectOrganization, removeSelectedOrganization, organizations}));