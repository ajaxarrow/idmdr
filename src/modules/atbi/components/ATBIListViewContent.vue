<script setup lang="ts">
import {useScroll} from "../../../core/composables/useScroll.ts";
import {onMounted, ref, watch} from "vue";
import {ATBI} from "../../../interfaces/atbi.interface.ts";
import atbi from "../../../data/atbi.ts";
import {PhHardDrives, PhInfo, PhMagnifyingGlass} from "@phosphor-icons/vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import ATBIItem from "./ATBIItem.vue";

const {scrollTop} = useScroll()

const searchQuery = ref('');
const searchedATBIs = ref<ATBI[]>([]);
const atbiData = ref<ATBI[]>([]);
const pageLoading = ref(false)
const filterATBIsBySearch = async (searchQuery: string) => {
  if(searchQuery) {
    return atbiData.value.filter((atbi: any) => {
      return atbi.name?.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    })
  } else {
    return atbiData.value
  }
}

watch(() => searchQuery.value, async () => {
  searchedATBIs.value = await filterATBIsBySearch(searchQuery.value);
})

onMounted(() => {
  pageLoading.value = true
  searchedATBIs.value = atbi
  atbiData.value = atbi
  pageLoading.value = false
})

</script>

<template>
  <div class="pa-6">
    <VTextField
        v-model="searchQuery"
        hide-details
        variant="outlined"
        rounded="xl"
        density="comfortable"
        color="primary"
        base-color="gs60"
    >
      <template v-slot:prepend-inner>
        <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
      </template>
      <template v-slot:label>
        <p class="text-gs20">Search atbi by name</p>
      </template>
    </VTextField>
    <VRow justify="space-between" align="center" class="ma-0 my-6">
      <p class="text-title d-flex align-center">
        <PhHardDrives size="24" class="mr-1"/>
        Browse ATBIs
      </p>
    </VRow>
    <div v-if="pageLoading" class="loading-state-container">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="searchedATBIs.length > 0">
        <ATBIItem
            v-for="atbi in searchedATBIs"
            :key="atbi.uid"
            :atbi="atbi"
            class="mb-6"
          />
        <p class="text-center mt-5">
          All data are loaded!
          <span
              @click="scrollTop"
              class="text-bs50 cursor-pointer scroll-top-link"
          >
                  Jump back to the top?
                </span>
        </p>
      </div>
      <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Data Found</p>
      <EmptyStateInfo
          v-else
          header="No Data Found"
          description="We couldn't find any sata. Please try again later."
          :isCallbackNeeded="searchQuery !== ''"
          @callback="searchQuery = ''"
      />
    </div>
  </div>
</template>

<style scoped>

</style>