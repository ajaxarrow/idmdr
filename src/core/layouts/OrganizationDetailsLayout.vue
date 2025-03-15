<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {computed, ref, watch} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {PropType} from "vue";
import {Organization} from "../../interfaces/organization.interface.ts";
import {onMounted} from "vue";
import NotFound from "../../assets/images/404.svg";
import {useScreenStore} from "../stores/screen-size.store.ts";
import {PhArrowLeft} from "@phosphor-icons/vue";
import {useUserStore} from "../stores/user.store.ts";
import {useOrganizationServices} from "../../modules/organization/services/organization.services.ts";
import Navbar from "../../modules/public/components/Landing/Navbar.vue";
import Footer from "../../modules/public/components/Footer.vue";
import OrganizationLayoutHeaderContent from "../../modules/organization/components/OrganizationLayoutHeaderContent.vue";

const {user} = useUserStore();
const {fetchOrganizationByUser} = useOrganizationServices()
const {router, route} = useRouting();
const {isSmall} = useScreenStore();

const isMember = ref(false)
const pageLoading = ref(false);
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
    ...(user.value && isMember.value ? [{ name: "Experts" }] : []),
    ...(user.value && isMember.value ? [{ name: "Posts" }] : []),
    ...(user.value && isMember.value ? [{ name: "Scheduled Events" }] : []),
    ...(user.value && isMember.value ? [{ name: "Reports" }] : []),
    ...(user.value && isMember.value && !isInPublic.value ? [{ name: "Settings" }] : [])
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
    } else if (tab.name === "Experts" && user.value && isMember.value) {
      baseName = 'experts';
    } else if (tab.name === "Posts" && user.value && isMember.value) {
      baseName = 'posts';
    } else if (tab.name === "Scheduled Events" && user.value && isMember.value) {
      baseName = 'events';
    } else if (tab.name === "Reports" && user.value && isMember.value) {
      baseName = 'reports';
    } else if (tab.name === "Settings" && user.value) {
      baseName = 'settings';
    }

    let linkName;
    if (baseName) {
      if (path.value === 'cmis') {
        linkName = `cmi-${baseName}`;
      } else {
        linkName = path.value === 'organizations' ? `organization-${baseName}` : `my-organization-${baseName}`;
      }
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

const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

const initialize = async () => {
  path.value = getFirstPath(<string>route.path);
  if (path.value === 'cmis') {
    isInPublic.value = true;
  }
  pageLoading.value = true;
  const allUserOrg = await fetchOrganizationByUser();

  if (props.organization?.visibility === 1 || props.organization?.visibility === 4) {
    isOrgAvailable.value = true;
  } else {
    isOrgAvailable.value = isSlugInOrgList(props.organization, allUserOrg);
  }

  if(isSlugInOrgList(props.organization, allUserOrg)){
    isMember.value = true
    tabs.value = getTabs()
  }

  if (props.activeTab) {
    tab.value = props.activeTab;
  }


  pageLoading.value = false;
};

onMounted(() => {
  if (props.organization) {
    initialize();
  } else {
    watch(
        () => props.organization,
        (newOrg) => {
          if (newOrg) initialize();
        },
        { immediate: true }
    );
  }
});
</script>

<template>
  <VLayout v-if="isInPublic" title="Consortium Member Institution Details">
    <div style="width: 100%">
      <Navbar />
      <VContainer fluid>
        <OrganizationLayoutHeaderContent
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
    <OrganizationLayoutHeaderContent
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
  </MainLayout>
</template>

<style scoped>
.text-repository-heading{
  font-weight: 900;
  font-size: 22px;
}

.circle::after {
  content: '';
  position: absolute;
  left: -212px;
  top: -453px;
  width: 810px;
  height: 660px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

.v-tab.v-tab.v-btn{
  min-width: 40px;
}

.v-tab{
  font-size: 16px;
  letter-spacing: .7px;
}

@media (max-width: 960px) {
  .circle::after {
    top: -490px;
  }
}

.back-button{
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #d3e6ef;
}
</style>