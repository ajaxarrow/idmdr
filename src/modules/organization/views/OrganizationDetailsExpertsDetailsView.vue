<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, onUnmounted, ref} from "vue";
import {
  PhArrowLeft,
  PhDotsThreeOutlineVertical,
  PhPencil, PhTrash,
} from "@phosphor-icons/vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Expert, Organization} from "../../../interfaces/organization.interface.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import NotFound from "../../../assets/images/404.svg";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";

const {route, router} = useRouting()
const {showSnackbarMessage, setSnackbarMessage} = useSnackbarStore();
const {fetchOrganizationData, fetchOrganizationIDsByUser} = useOrganizationServices();
const {fetchExpertById, deleteExpert} = useOrganizationExpertsServices()
const {arrayToString} = useStringArrayHelper()

const expertActionMenu = ref(false);
const path = ref('organizations')
const searchQuery = ref('');
const expertData = ref<Expert | null>(null);
const organization = ref<Organization | null>();
const pageLoading = ref(false)

const deleteExpertCallback = async () => {
  showSnackbarMessage('Expert Deleted Successfully', Status.success)
  await deleteExpert(expertData.value?.uid as string);
  expertActionMenu.value = false
  await router.push({
    name: path.value === 'organizations' ? 'organization-experts' : 'my-organization-experts',
  });
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

onMounted(async () => {
  pageLoading.value = true
  path.value = getFirstPath(<string>route.path)
  const allUserOrg = await fetchOrganizationIDsByUser();
  organization.value = await fetchOrganizationData(route.params.slug as string);
  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
  // @ts-ignore
  expertData.value = await fetchExpertById(route.params.expert as string);
  await setSnackbarMessage()
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
})

</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="experts">
    <div class="px-6 py-2">
      <RouterLink
          :to="{
            name: path === 'organizations' ? 'organization-experts' : 'my-organization-experts',
            params: { slug: organization?.uid}
          }"
          class="text-decoration-none text-none"
      >
        <p class="cursor-pointer back-button pa-2 d-flex align-center  text-black">
          <PhArrowLeft size="14" class="mr-1"/>
          Back To Experts View
        </p>
      </RouterLink>
    </div>
    <div v-if="expertData">
      <div class="px-6 mb-5">
        <VRow class="ma-0 mt-2 mb-4" justify="space-between" align="center">
          <div>
            <div class="d-flex align-center">
              <!--                <VImg-->
              <!--                    style="border-radius: 50%; flex: none !important;"-->
              <!--                    cover-->
              <!--                    height="40px"-->
              <!--                    width="40px"-->
              <!--                    :src="typeof topic.user === 'object' ? topic.user?.profile_picture!  : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"-->
              <!--                />-->
              <div style="line-height: 20px">
                <p class="topic-subtitle">{{
                    typeof expertData?.name === 'object'
                        ? `${expertData?.name?.first_name || ''} ${expertData?.name?.middle_name || ''} ${expertData?.name?.last_name || ''} ${expertData?.name?.extension || ''}`.trim()
                        : expertData?.name || ''
                  }}</p>
                <p class="text-gs60" style="font-size: 14px"> {{organization?.name}} ({{organization?.acronym}})</p>
              </div>
            </div>
          </div>
          <VMenu v-model="expertActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <div>
                <RouterLink
                  :to="{ name: 'edit-expert', params: { slug: expertData?.uid } }"
                  class="cursor-pointer action-menu-item text-decoration-none text-black">
                  <PhPencil/>
                  Edit
                </RouterLink>
                <DeleteDialog @callback="deleteExpertCallback">
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Delete
                  </p>
                </DeleteDialog>
              </div>
            </VSheet>
          </VMenu>
        </VRow>
        <p class="text-about-heading py-3">Expert Information</p>
        <VRow class="ma-0">
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Expert Name</p>
            <p class="text-subtitle">{{
                typeof expertData?.name === 'object'
                    ? `${expertData?.name?.first_name || ''} ${expertData?.name?.middle_name || ''} ${expertData?.name?.last_name || ''} ${expertData?.name?.extension || ''}`.trim()
                    : expertData?.name || ''
              }}</p>
          </VCol>
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Assigned CMI</p>
            <p class="text-subtitle">{{organization?.name}} ({{organization?.acronym}})</p>
          </VCol>
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Expertise</p>
            <p class="text-subtitle">{{ arrayToString(expertData.expertise as string[])}}</p>
          </VCol>
          <VCol v-if="expertData.contact.is_displayed" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Contact Number</p>
            <p class="text-subtitle">{{ expertData.contact.value }}</p>
          </VCol>
        </VRow>
      </div>
      <div v-if="expertData.additional_info && expertData.additional_info?.trim().length != 0">
        <VDivider/>
        <div class="px-6 mb-10">
          <p class="text-about-heading py-3">Additional Information</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="expertData.additional_info"></div>
            </div>
          </VRow>
        </div>
      </div>
    </div>
    <div v-else style="height: 100%">
      <div style="height:45vh" class="d-flex flex-column justify-center align-center">
        <VImg
            :src="NotFound"
            width="300px"
        />
        <p class="text-h4 font-weight-black">Expert Not Found</p>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.back-button{
  width: 225px;
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #F0F5F9;
}

.topic-title{
  font-size: 28px;
  font-weight: 800;
}

.topic-subtitle{
  font-size: 16px;
  font-weight: 700;
}

.action-button{
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover{
  background-color: #F0F5F9;
}

.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}

.action-menu-item:hover{
  background-color: #e0e3e3;
}

:deep(.v-field__outline){
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(textarea::placeholder){
  color: #5F6061;
  opacity: 90%;
}

:deep(.v-input__control){
  height: 70px;
}

:deep(.v-snackbar__content){

}

</style>