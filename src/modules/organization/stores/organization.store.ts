import {ref} from "vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {createGlobalState} from "@vueuse/core";

const organization = ref<Organization | null | undefined>();
const selectedOrganization = ref<Organization | null>(null);
const searchedMapOrganizations = ref<Organization[]>([]);
const mapOrganizations = ref<Organization[]>([]);
const myOrganizations = ref<Organization[]>([]);
const allOrganizations = ref<Organization[]>([]);

const selectOrganization = (organization: Organization) => {
  if(selectedOrganization.value === organization) {
    removeSelectedOrganization()
    return;
  }
  selectedOrganization.value = organization;
}

const filterOrganizations = (title: string) => {
  if(title) {
    searchedMapOrganizations.value = mapOrganizations.value.filter(organization => organization.name.toLowerCase().includes(title.toLowerCase().trim()));
  } else {
    searchedMapOrganizations.value = mapOrganizations.value
  }
}

const removeSelectedOrganization = () => {
  selectedOrganization.value = null;
}

const fetchOrganizationData = (slug: string, organizationData: Organization[]): Organization | null => {
  const organization = organizationData.find(org => org.slug === slug);
  if (organization) {
    return organization;
  } else {
    console.error('no org')
    return null;
  }
}

const setOrganizationData = (slug: string, organizationData: Organization[]) => {
  organization.value = fetchOrganizationData(slug, organizationData);
}



export const useOrganizationStore = createGlobalState(() => ({setOrganizationData, filterOrganizations, selectedOrganization, selectOrganization, removeSelectedOrganization, organization, myOrganizations, allOrganizations, mapOrganizations, searchedMapOrganizations}));