<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, PropType, ref} from "vue";
import {Expert, Organization} from "../../../interfaces/organization.interface.ts";

const path = ref('/organizations')
const props = defineProps({
  expert: {
    type: Object as PropType<Expert>
  }
})

const {isDesktop} = useScreenStore();
const {route} = useRouting()

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}
// const goToOrganizationDetails = () => {
//   router.push({
//     name: path.value == '/organizations' ?  'organization-data' : 'my-organization-data',
//     params: { slug: props.organization?.slug }
//   });
// }

onMounted(() => {
  path.value = getFirstPath(<string>route.path)
  console.log(path.value)
})
</script>

<template>
  <RouterLink v-if="typeof props.expert?.organization === 'object'" class="mb-2 cursor-pointer text-decoration-none" :to="{ name: path == '/organizations' ?  'organization-experts-details' : 'my-organization-experts-details', params: { slug: props.expert?.organization?.slug, expert: props.expert?.uid } }">
    <VRow justify="space-between" align="center" class="ma-0 data-list-item" >
      <div class="d-flex align-center">
<!--        <VImg-->
<!--            style="border-radius: 8px"-->
<!--            cover-->
<!--            height="40px"-->
<!--            width="40px"-->
<!--            :src="props.organization?.image ? <string>props.organization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"-->
<!--        />-->
        <div class="ml-2">
          <p class="organization-title">
            {{
              typeof props.expert?.name === 'object'
                  ? `${props.expert?.name?.first_name || ''} ${props.expert?.name?.middle_name || ''} ${props.expert?.name?.last_name || ''} ${props.expert?.name?.extension || ''}`.trim()
                  : props.expert?.name || ''
            }}
          </p>

          <p class="organization-subtitle">{{ typeof props.expert?.organization === 'object' ? `${props.expert.organization.name} (${props.expert.organization.acronym})` : ''}}</p>
        </div>
      </div>
      <VBtn
          v-if="typeof props.expert?.organization === 'object' || isDesktop" :to="{ name: path == '/organizations' ?  'organization-experts-details' : 'my-organization-experts-details', params: { slug: props.expert?.organization?.slug, expert: props.expert?.uid  } }"
          class="text-none bg-background view-details-btn"
          height="35px"
          width="95px"
          rounded="xl"
      >
        View Details
      </VBtn>
    </VRow>
    <VDivider class="mt-2"/>
  </RouterLink>

</template>

<style scoped>
.organization-title{
  font-weight: 600;
  color: black !important;
}

.organization-subtitle{
  font-size: 14px;
  color: black !important;
}

.view-details-btn{
  font-size: 14px;
  letter-spacing: 0;
}

.v-btn--variant-elevated{
  box-shadow: 0 0 7px 0 #dae5f4;
}
</style>