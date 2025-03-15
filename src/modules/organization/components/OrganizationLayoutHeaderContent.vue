<script setup lang="ts">
import {computed, PropType, ref, watch} from 'vue';
import NotFound from "../../../assets/images/404.svg";
import {PhArrowLeft} from "@phosphor-icons/vue";
import {Organization} from "../../../interfaces/organization.interface.js";

const props = defineProps({
  organization: {
    type: Object as PropType<Organization | null | undefined>,
    default: () => ({})
  },
  pageLoading: {
    type: Boolean,
    default: false
  },
  isOrgAvailable: {
    type: Boolean,
    default: false
  },
  path: {
    type: String,
    default: 'organizations'
  },
  tab: {
    type: [String, Number],
    default: ''
  },
  isSmall: {
    type: Boolean,
    default: false
  },
  computedTabs: {
    type: Array as PropType<Array<{ name: string; linkName: string }>>,
    default: () => []
  },
  navigateTo: {
    type: Function,
    default: () => {}
  }
});

const tab = ref(props.tab)

const backLinkName = computed(() => {
  return props.path === 'organizations' ? 'organizations' : 'my-organizations';
});

const backLinkText = computed(() => {
  return props.path === 'organizations' ? 'Consortium Member Institutions' : 'My Consortium Member Institutions';
});

const organizationImage = computed(() => {
  return props.organization?.image || 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1';
});

watch(()=> props.tab, () => {
  tab.value = props.tab
})

watch(()=> props.computedTabs, () => {
  console.log(props.computedTabs)
})
</script>

<template>
  <div>
    <div v-if="props.pageLoading" class="loading-state-container" style="height: 85vh;">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="props.organization && props.isOrgAvailable" style="height: 100%" class="relative-container circle">
        <div class="pa-6 relative-container" style="z-index: 20;">
          <div class="d-flex">
            <RouterLink
                :to="{name: backLinkName}"
                class="text-decoration-none text-none"
            >
              <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
                <PhArrowLeft size="14" class="mr-1"/>
                Back To {{ backLinkText }}
              </p>
            </RouterLink>
          </div>
          <VRow justify="space-between" align="center" class="ma-0">
            <VCol md="9" class="pa-0">
              <div>
                <p class="text-repository-heading d-flex align-center">
                  {{ props.organization?.name }} ({{ props.organization?.acronym }})
                </p>
                <p class="text-subtitle">{{ props.organization?.president }}</p>
                <p class="text-subtitle text-gs20">
                  {{ props.organization?.tel_phone }}
                  <span v-if="props.organization?.tel_phone">|</span>
                  {{ props.organization?.phone }}
                  <span v-if="props.organization?.email">|</span>
                  {{ props.organization?.email }}
                </p>
              </div>
            </VCol>
            <VCol md="3" class="pa-0" v-if="!isSmall">
              <VRow class="ma-0" justify="end">
                <VImg
                    style="border-radius: 15px"
                    cover
                    height="125px"
                    width="250px"
                    :src="organizationImage"
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
              v-for="item in computedTabs"
              :key="item.name"
              class="tab-title text-none mx-2"
              :value="item.name.toLowerCase()"
              @click="() => navigateTo(item.linkName)"
          >
            {{ item.name }}
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
    </div>
  </div>
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