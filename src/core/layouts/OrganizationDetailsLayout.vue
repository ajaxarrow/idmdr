<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {computed, ref} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {PropType} from "vue";
import {Organization} from "../../interfaces/organization.interface.ts";
import {onMounted} from "vue";
import NotFound from "../../assets/images/404.svg";
import {useScreenStore} from "../stores/screen-size.store.ts";
import {PhArrowLeft} from "@phosphor-icons/vue";

const path = ref('organizations')
const tab = ref("about");
const {router, route} = useRouting();
const {isSmall} = useScreenStore();
const props = defineProps({
  organization: {
    type: Object as PropType<Organization | null | undefined>,
  },
  activeTab: {
    type: String
  }
});

const tabs = [
  { name: "About" },
  { name: "Repositories" },
  { name: 'Settings'}
];

// Create a computed property that maps over the tabs array
const computedTabs = computed(() => {
  return tabs.map(tab => {
    let linkName;

    if (tab.name === "About") {
      linkName = path.value === 'organizations' ? 'organization-data' : 'my-organization-data';
    } else if (tab.name === "Repositories") {
      linkName = path.value === 'organizations' ? 'organization-repositories' : 'my-organization-repositories';
    } else if (tab.name === "Settings") {
      linkName = path.value === 'organizations' ? 'organization-settings' : 'my-organization-settings';
    }

    return {
      ...tab,
      linkName,
    };
  });
});


const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

onMounted(()=>{
  if(props.activeTab){
    tab.value = props.activeTab
  }
  path.value = getFirstPath(<string>route.path)
})
</script>

<template>
  <MainLayout title="Organization Details">
    <div v-if="organization" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <RouterLink
            :to="{
          name: path == 'organizations' ?  'organizations' : 'my-organizations'
        }"
            class="text-decoration-none text-none">
          <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
            <PhArrowLeft size="14" class="mr-1"/>
            Back To {{path == 'organizations' ?  'Organizations' : 'My Organizations'}}
          </p>
        </RouterLink>
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-repository-heading d-flex align-center">
                {{organization.name}} ({{organization.acronym}})
              </p>
              <p class="text-subtitle">{{ organization.president }}</p>
              <p class="text-subtitle text-gs20">{{organization.tel_phone}} | {{organization.phone}} | {{organization.email}}</p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0" v-if="!isSmall">
            <VRow class="ma-0" justify="end">
              <VImg
                  style="border-radius: 15px"
                  cover
                  height="125px"
                  width="250px"
                  :src="organization?.image ? organization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
              />
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VTabs
        class="mx-6"
        color="primary"
        v-model="tab"
      >
        <VTab
          v-for="tab in computedTabs"
          class="tab-title text-none mx-2"
          :value="tab.name.toLowerCase()"
          @click="navigateTo(<string>tab.linkName)"
        >
          {{tab.name}}
        </VTab>
      </VTabs>
      <VDivider/>
      <slot/>
    </div>
    <div v-else style="height: 100%">
      <div style="height:60vh" class="d-flex flex-column justify-center align-center">
        <VImg
            :src="NotFound"
            width="400px"
        />
        <p class="text-h4 font-weight-black">Organization Not Found</p>
      </div>
    </div>
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
  width: 195px;
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #d3e6ef;
}
</style>