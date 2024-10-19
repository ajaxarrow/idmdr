<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useRepositoryMemberServices} from "../services/repository-member.services.ts";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import AccessLeveLInfoDialog from "../../organization/components/AccessLeveLInfoDialog.vue";
import {PhDotsThreeOutlineVertical, PhInfo, PhMagnifyingGlass, PhPencil, PhTrash} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import AddRepoMemberDialog from "../components/AddRepoMemberDialog.vue";

const {userData} = useUserStore();
const {showSnackbarMessage} = useSnackbarStore();
const {repository} = useRepositoryStore();
const {fetchRepositoryData, fetchRepositoriesByUser} = useRepositoryServices()
const {fetchRepoMembers, removeRepoMember} = useRepositoryMemberServices()

const {route} = useRouting()
const searchQuery = ref('')
const memberActionMenu = ref(false)
const path = ref('repositories')
const repoMemberData = ref<OrgMember[]>([])
const repoMembers = ref<OrgMember[]>([])
const userRepoInfo = ref<OrgMember | null | undefined>(null)

const filterRepoMembersBySearchQuery = () => {
  if(searchQuery.value) {
    repoMembers.value = repoMemberData.value.filter(member => member.user.username.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    repoMembers.value = repoMemberData.value
  }
}
const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

const fetchMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Added Successfully', Status.success)
}

const updateMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Updated Successfully', Status.success)
  memberActionMenu.value = false
}

const deleteMemberCallback = async (member: OrgMember) => {
  await removeRepoMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
}


const fetchMembers = async () => {
  const data = await fetchRepoMembers(<string>route.params.slug)
  repoMembers.value = data
  repoMemberData.value = data
}

watch(() => searchQuery.value, () => {
  filterRepoMembersBySearchQuery()
});

onMounted(async () => {
  await fetchRepositoryData(route.params.slug as string);
  path.value = getFirstPath(<string>route.path)

  const allUserRepo = await fetchRepositoriesByUser();

  if(repository.value){
    if(isSlugInRepoList(repository.value, allUserRepo)) {
      if("is_member" in repository.value){
        repository.value.is_member = true;
      }
    }
  }

  await fetchMembers()
  userRepoInfo.value = repoMembers.value.find(member => member.user.uid === userData.uid)

})
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="settings">
    <div v-if="repository" class="px-6 py-7">
      <div v-if="repository.is_member">
        <div class="mt-2">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Update Organization Information</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your organization details and information</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: path == 'repositories' ? 'edit-repository' : 'edit-repository-my', params: {slug: repository?.slug}}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              Update Organization Info
            </VBtnPrimaryFilled>
          </VRow>
        </div>
        <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'moderator'" class="my-5"/>
        <div class="mt-2">
          <VRow v-if="repository.is_member" class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Repository Members</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage repository members and their roles. <AccessLeveLInfoDialog/></p>
            </div>
            <AddRepoMemberDialog :form-type="FormType.create" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'moderator'" @callback="fetchMembersCallback">
              <VBtnPrimaryFilled  height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                Add Member
              </VBtnPrimaryFilled>
            </AddRepoMemberDialog>
          </VRow>
          <VTextField
              class="my-3"
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
              <p class="text-gs20">Find members</p>
            </template>
          </VTextField>
          <div class="my-5 mx-1" v-if="repoMembers.length > 0">
            <div
                v-for="member in repoMembers"
                :key="member.membership_uid"
            >
              <VRow v-if="!member.is_deleted" class="ma-0 my-3" justify="space-between" align="center">
                <div class="d-flex align-center">
                  <VAvatar
                      size="40"
                      class="mr-1 cursor-pointer"
                  >
                    <VImg :src="member.user.profile_picture ?? 'https://dummyimage.com/400x400/023768/fff.png&text=N/A'"></VImg>
                  </VAvatar>
                  <div class="mr-2">
                    <p class="text-name text-container">{{member.user.username}}</p>
                    <p class="text-name-subtitle">{{member.user.email}} · {{member.access_level}}</p>
                  </div>
                </div>
                <VMenu
                    v-if="member.user.uid != userData.uid && (userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'moderator')"
                    location="bottom"
                    v-model="memberActionMenu"
                    :close-on-content-click="false"
                >
                  <template #activator="{ props }">
                    <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                      Options
                      <PhDotsThreeOutlineVertical weight="fill"/>
                    </p>
                  </template>
                  <VSheet width="200" class="rounded-b-lg py-2">
                    <AddRepoMemberDialog
                        :form-type="FormType.edit"
                        :member="member"
                        :user-access-level="userRepoInfo?.access_level"
                        @callback="updateMembersCallback"
                    >
                      <p class="cursor-pointer action-menu-item">
                        <PhPencil/>
                        Edit Access
                      </p>
                    </AddRepoMemberDialog>
                    <DeleteDialog @callback="deleteMemberCallback(member)">
                      <p class="cursor-pointer action-menu-item">
                        <PhTrash/>
                        Remove User
                      </p>
                    </DeleteDialog>
                  </VSheet>
                </VMenu>
              </VRow>
              <VDivider v-if="!member.is_deleted" class="mt-3"/>
            </div>
          </div>
          <div class="my-5 mx-1" v-else>
            <p class="d-flex align-center justify-center">
              <PhInfo class="mr-1"/>No Repository Members Found
            </p>
          </div>
        </div>
      </div>
    </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>
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

.action-menu-item:hover{
  background-color: #e0e3e3;
}

.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.text-name{
  font-size: 16px !important;
  font-weight: 700 !important;
}

.text-name-subtitle{
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 0.75;
}
</style>