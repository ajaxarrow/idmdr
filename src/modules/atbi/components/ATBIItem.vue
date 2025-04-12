<script setup lang="ts">
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, PropType, ref} from "vue";
import {ATBI} from "../../../interfaces/atbi.interface.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
const {arrayToString} = useStringArrayHelper()
const path = ref('/organizations')
const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  }
})

const {route} = useRouting()

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

onMounted(() => {
  path.value = getFirstPath(<string>route.path)
})
</script>

<template>
  <RouterLink class="mb-2 cursor-pointer text-decoration-none" :to="{ name: 'atbi-details', params: { slug: props.atbi?.uuid } }">
    <VRow justify="space-between" align="center" class="ma-0 data-list-item" >
      <div class="d-flex align-center">
        <VImg
            style="border-radius: 8px"
            cover
            height="40px"
            width="40px"
            :src="props.atbi?.logo? <string>props.atbi?.logo: 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
        />
        <div class="ml-2">
          <p class="organization-title">
            {{
             props.atbi?.name
            }}
          </p>

          <p class="organization-subtitle">Owners: <span v-if="props.atbi?.ownerData?.length == 0">N/A</span>
            <span v-else v-for="(owner, index) in props.atbi?.ownerData">
                {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != props.atbi?.ownerData?.length! - 1">, </span>B
              </span></p>
        </div>
      </div>
      <VBtn
          :to="{ name: 'atbi-details', params: { slug: props.atbi?.uuid } }"
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