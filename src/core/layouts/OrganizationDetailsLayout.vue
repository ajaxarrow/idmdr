<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {computed, onUpdated, ref, watch} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {PropType} from "vue";
import {Organization} from "../../interfaces/organization.interface.ts";
import {onMounted} from "vue";
import {useScreenStore} from "../stores/screen-size.store.ts";
import {useUserStore} from "../stores/user.store.ts";
import {useOrganizationServices} from "../../modules/organization/services/organization.services.ts";
import Navbar from "../../modules/public/components/Landing/Navbar.vue";
import Footer from "../../modules/public/components/Footer.vue";
import OrganizationLayoutHeaderContent from "../../modules/organization/components/OrganizationLayoutHeaderContent.vue";
import {usePageLoadingStore} from "../stores/loading.store.ts";

const {user, userData} = useUserStore();
const {fetchOrganizationIDsByUser} = useOrganizationServices()
const {router, route} = useRouting();
const {isSmall} = useScreenStore();
const {isPageLoading} = usePageLoadingStore()
const isMember = ref(false)
const pageLoading = ref(true);
const isOrgAvailable = ref(false);
const path = ref('organizations')
const tab = ref("about");
const isInPublic = ref(false);
const props = defineProps({
  organization: {
    type: Object as PropType<Organization | null | undefined>,
  },
  activeTab: {
    type: String
  }
});

const getTabs = () => {
  return [
    { name: "About" },
    { name: "Projects" },
    { name: "Experts" },
    { name: "Posts" },
    { name: "Scheduled Events" },
    ...(user.value && isMember.value ? [{ name: "Reports" }] : []),
    ...((user.value && !isInPublic.value) || userData.is_superuser ? [{ name: "Settings" }] : [])
  ]
}

const tabs = ref(getTabs())


// Create a computed property that maps over the tabs array
const computedTabs = computed(() => {
  return tabs.value.map(tab => {
    let baseName;

    if (tab.name === "About") {
      baseName = 'data';
    } else if (tab.name === "Projects") {
      baseName = 'repositories';
    } else if (tab.name === "Experts") {
      baseName = 'experts';
    } else if (tab.name === "Posts") {
      baseName = 'posts';
    } else if (tab.name === "Scheduled Events") {
      baseName = 'events';
    } else if (tab.name === "Reports" && user.value && isMember.value) {
      baseName = 'reports';
    } else if (tab.name === "Settings" && user.value) {
      baseName = 'settings';
    } else {
      baseName = '';
    }

    let linkName;
    if (baseName) {
      if (path.value === 'cmis') {
        linkName = `cmi-${baseName}`;
      } else {
        linkName = path.value === 'organizations' ? `organization-${baseName}` : `my-organization-${baseName}`;
      }
    } else {
      linkName = '';
    }

    return {
      ...tab,
      linkName,
    };
  });
});



const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.uid === organization?.uid);
};

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const navigateTo = async (linkName: string) => {
  await router.push({
    name: linkName,
  });
  if(linkName === 'organization-settings' || linkName === 'organization-reports'){
    window.location.reload();
  }
}

const initialize = async () => {
  pageLoading.value = true; // Set first, before any other operations

  path.value = getFirstPath(<string>route.path);
  if (path.value === 'cmis') {
    isInPublic.value = true;
  }

  const allUserOrg = await fetchOrganizationIDsByUser();

  if (props.organization?.visibility === 1 || props.organization?.visibility === 4) {
    isOrgAvailable.value = true;
  } else {
    isOrgAvailable.value = userData.is_superuser ? true : isSlugInOrgList(props.organization, allUserOrg);
  }

  if(isSlugInOrgList(props.organization, allUserOrg) || userData.is_superuser){
    isMember.value = true
    tabs.value = getTabs()
  }

  if (props.activeTab) {
    tab.value = props.activeTab;
  }
  pageLoading.value = false;
};

watch(() => isPageLoading.value, () => {
  if(!isPageLoading.value){
    pageLoading.value = false
  }
})

watch(() => route.name, async () => {
  pageLoading.value = true;
  await initialize()
});

onMounted(async() => {
  path.value = getFirstPath(<string>route.path);
  if (path.value === 'cmis') {
    isInPublic.value = true;
  }
  pageLoading.value = true;
  if (props.organization) {
    await initialize();
  } else {
    watch(
        () => props.organization,
        async (newOrg) => {
          if (newOrg) await initialize();
        },
        { immediate: true }
    );
  }

  if(!isPageLoading.value){
    pageLoading.value = false
  }
});
</script>

<template>
    <VLayout v-if="isInPublic" title="Consortium Member Institution Details">
      <div style="width: 100%">
        <Navbar />
        <VContainer fluid>
          <div v-if="pageLoading" class="loading-state-container" style="height: 85vh;">
            <VProgressCircular
                indeterminate
                color="#23668b"
            ></VProgressCircular>
          </div>
          <OrganizationLayoutHeaderContent
            v-else
            :organization="organization"
            :pageLoading="pageLoading"
          :isOrgAvailable="isOrgAvailable"
          :path="path"
          :tab="tab"
          :isSmall="isSmall"
          :computedTabs="computedTabs"
          :navigateTo="navigateTo"
          >
          <slot/>
          </OrganizationLayoutHeaderContent>
        </VContainer>
        <VDivider/>
        <Footer/>
      </div>
    </VLayout>
    <MainLayout v-else>
      <div v-if="pageLoading" class="loading-state-container" style="height: 85vh;">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <OrganizationLayoutHeaderContent
        v-else
        :organization="organization"
        :pageLoading="pageLoading"
        :isOrgAvailable="isOrgAvailable"
        :path="path"
        :tab="tab"
        :isSmall="isSmall"
        :computedTabs="computedTabs"
        :navigateTo="navigateTo"
        @updatePage="initialize()"
      >
      <slot/>
      </OrganizationLayoutHeaderContent>
    </MainLayout>
</template>
