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
  <RouterLink class="mb-2 cursor-pointer text-decoration-none" :to="{ name: 'atbi-details', params: { slug: props.atbi?.uid } }">
    <VRow justify="space-between" align="center" class="ma-0 data-list-item" >
      <div class="d-flex align-center">
        <div class="ml-2">
          <p class="organization-title">
            {{
             props.atbi?.name
            }}
          </p>

          <p class="organization-subtitle">Owners: {{arrayToString(props.atbi?.owner as string[])}}</p>
        </div>
      </div>
      <VBtn
          :to="{ name: 'atbi-details', params: { slug: props.atbi?.uid } }"
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