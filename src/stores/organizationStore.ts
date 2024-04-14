import {ref} from "vue";
import {Organization} from "../interfaces/organization.interface.ts";
import organizations from "../data/organizations.ts";
import {createGlobalState} from "@vueuse/core";

const organization = ref<Organization | null | undefined>();

const fetchOrganizationData = (slug: string): Organization | null => {
  const organization = organizations.find(org => org.slug === slug);
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

export const useOrganizationStore = createGlobalState(() => ({setOrganizationData, organization}));