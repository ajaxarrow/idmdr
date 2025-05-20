<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhPlus} from "@phosphor-icons/vue";
import PostListViewContent from "../components/PostListViewContent.vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import PostDataTable from "../components/PostDataTable.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {onMounted} from "vue";
const {isSmall, isTablet} = useScreenStore();
const {userData} = useUserStore()
const {setSnackbarMessage} = useSnackbarStore()

onMounted(async () => {
  await setSnackbarMessage()
})
</script>

<template>
  <MainLayout title="Posts">
    <PostDataTable v-if="userData.is_superuser" />
    <div v-else style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                Posts
              </p>
              <p class="text-subtitle">Discover updates and articles posted within your organization</p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled :to="{name: 'new-post'}" v-if="isSmall || isTablet" icon >
                <PhPlus size="16"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled :to="{name: 'new-post'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                <PhPlus size="16" class="mr-2"/>
                New Post
              </VBtnPrimaryFilled>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <PostListViewContent/>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -460px;
  width: 590px;
  height: 585px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

</style>