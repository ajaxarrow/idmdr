<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {ref} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {PropType} from "vue";
import {Organization} from "../interfaces/organization.interface.ts";
import {onMounted} from "vue";
import NotFound from "../assets/images/404.svg";
import {useScreenStore} from "../stores/screenSizeStore.ts";

const tab = ref("about");
const {router} = useRouting();
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
  {
    name: "About",
    linkName: "organization-data"
  },
  {
    name: "Repositories",
    linkName: "organization-repositories"
  },
]

const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

onMounted(()=>{
  if(props.activeTab){
    tab.value = props.activeTab
  }
})
</script>

<template>
  <MainLayout title="Repository Details">
    <div v-if="organization" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-repository-heading d-flex align-center">
                {{organization.name}} ({{organization.acronym}})
              </p>
              <p class="text-subtitle">{{ organization.president }}</p>
              <p class="text-subtitle text-gs20">{{organization.tel}} | {{organization.phone}} | {{organization.email}}</p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0" v-if="!isSmall">
            <VImg
                style="border-radius: 15px"
                cover
                height="125px"
                width="250px"
                :src="organization?.image ? organization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
            />
          </VCol>
        </VRow>
      </div>
      <VTabs
          class="mx-6"
          color="primary"
          v-model="tab"
      >
        <VTab
            v-for="tab in tabs"
            class="tab-title text-none mx-2"
            :value="tab.name.toLowerCase()"
            @click="navigateTo(tab.linkName)"
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
  width: 730px;
  height: 618px;
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
</style>