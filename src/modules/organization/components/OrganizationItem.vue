<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, PropType, ref} from "vue";
import {Organization} from "../../../interfaces/organization.interface.ts";

const path = ref('/organizations')
const props = defineProps({
  organization: {
    type: Object as PropType<Organization>
  }
})

const {isDesktop} = useScreenStore();
const {router, route} = useRouting()

const goToOrganizationDetails = () => {
  router.push({
    name: path.value == '/organizations' ?  'organization-data' : 'my-organization-data',
    params: { slug: props.organization?.slug }
  });
}

onMounted(() => {
  path.value = <string>route.path
})
</script>

<template>
  <div class="mb-2 cursor-pointer" @click="goToOrganizationDetails()">
    <VRow justify="space-between" align="center" class="ma-0" >
      <div class="d-flex align-center">
        <VImg
            style="border-radius: 8px"
            cover
            height="40px"
            width="40px"
            :src="props.organization?.image ? <string>props.organization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
        />
        <div class="ml-2">
          <p class="organization-title">{{ props.organization?.name }} ({{props.organization?.acronym}})</p>
          <p class="organization-subtitle">{{ props.organization?.president }} · {{ props.organization?.email }}</p>
        </div>
      </div>
      <VBtn
          :to="{ name: path == '/organizations' ?  'organization-data' : 'my-organization-data', params: { slug: props.organization?.slug } }"
          class="text-none bg-background view-details-btn"
          height="35px"
          width="95px"
          rounded="xl"
          v-if="isDesktop"
      >
        View Details
      </VBtn>
    </VRow>
    <VDivider class="mt-2"/>
  </div>

</template>

<style scoped>
  .organization-title{
    font-weight: 600;
  }
  
  .organization-subtitle{
    font-size: 14px;
  }
  
  .view-details-btn{
    font-size: 14px;
    letter-spacing: 0;
  }
  
  .v-btn--variant-elevated{
    box-shadow: 0 0 7px 0 #dae5f4;
  }
</style>