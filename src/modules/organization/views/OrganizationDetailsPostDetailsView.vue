<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, ref} from "vue";
import {
  PhArrowLeft, PhDotsThreeOutlineVertical, PhEye, PhEyeSlash,
  PhPencil, PhTrash, PhImages
} from "@phosphor-icons/vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import NotFound from "../../../assets/images/404.svg";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {usePostServices} from "../../posts/services/post.services.ts";
import {Post} from "../../../interfaces/post.interface.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";

const {route, router} = useRouting()
const {showSnackbarMessage, setSnackbarMessage} = useSnackbarStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchPostbyID, deletePost, managePostStatus} = usePostServices()

const postActionMenu = ref(false);
const path = ref('organizations')
const postData = ref<Post | null>(null);
const organization = ref<Organization | null>();
const pageLoading = ref(false)
const imagePreviewDialog = ref(false);
const selectedImageIndex = ref(0);

const deletePostCallback = async () => {
  showSnackbarMessage('Post Deleted Successfully', Status.success)
  await deletePost(postData.value?.uid as string);
  postActionMenu.value = false
  await router.push({
    name: path.value === 'organizations' ? 'organization-posts' : 'my-organization-posts',
  });
}

const managePostStatusCallback = async (isPublished: boolean) => {
  showSnackbarMessage('Post Successfully Updated', Status.success)
  await managePostStatus(postData.value?.uid as string, isPublished);
  postData.value = await fetchPostbyID(route.params.post as string);
  postActionMenu.value = false
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  imagePreviewDialog.value = true;
};

onMounted(async () => {
  pageLoading.value = true
  path.value = getFirstPath(<string>route.path)
  const allUserOrg = await fetchOrganizationByUser();
  organization.value = await fetchOrganizationData(route.params.slug as string);
  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    } else {
      await router.push({
        name: "organization-data",
        params: {
          slug: <string> route.params.slug
        }
      })
    }
  }
  postData.value = await fetchPostbyID(route.params.post as string);
  await setSnackbarMessage()
  pageLoading.value = false
})
</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="posts"
  >
    <div class="px-6 py-2">
      <RouterLink
          :to="{
          name: path === 'organizations' ? 'organization-posts' : 'my-organization-posts',
          params: { slug: organization?.uid}
        }"
          class="text-decoration-none text-none"
      >
        <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
          <PhArrowLeft size="14" class="mr-1"/>
          Back To Posts View
        </p>
      </RouterLink>
    </div>

    <div v-if="postData">
      <div class="px-6 mb-5">
        <VRow class="ma-0 mt-2 mb-4" justify="space-between" align="center">
          <div>
            <div class="d-flex align-center">
              <div style="line-height: 20px">
                <p class="topic-subtitle">{{postData.title}} <span v-if="postData.is_draft"></span></p>
                <p class="text-gs60" style="font-size: 14px">
                  {{organization?.name}} ({{organization?.acronym}})
                </p>
                <p class="text-gs60" style="font-size: 14px">
                  Post Status: {{postData.is_draft ? 'Draft' : postData.is_published ? 'Published' : 'Unpublished'}}
                </p>
              </div>
            </div>
          </div>
          <VMenu v-model="postActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <div>
                <RouterLink
                    :to="{name: 'news-updates-detail', params: {slug: postData?.uid}}"
                    class="cursor-pointer action-menu-item text-decoration-none text-black"
                >
                  <PhEye/>
                  View Post in Public
                </RouterLink>
                <RouterLink
                    :to="{ name: 'edit-post', params: { slug: postData?.uid } }"
                    class="cursor-pointer action-menu-item text-decoration-none text-black"
                >
                  <PhPencil/>
                  Edit
                </RouterLink>
                <DeleteDialog @callback="deletePostCallback">
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Delete
                  </p>
                </DeleteDialog>
                <ConfirmationDialog
                    @callback="managePostStatusCallback(!postData.is_published)"
                    :confirmContent="postData.is_published ? 'Unpublish' : 'Publish'"
                    :content="postData.is_published ? 'Are you sure you want to unpublish this post?' : 'Are you sure you want to publish this post?'"
                >
                  <p class="cursor-pointer action-menu-item">
                    <PhEyeSlash v-if="postData.is_published"/>
                    <PhEye v-else/>
                    {{postData.is_published ? 'Unpublish' : 'Publish'}}
                  </p>
                </ConfirmationDialog>
              </div>
            </VSheet>
          </VMenu>
        </VRow>
      </div>

      <VDivider/>
      <!-- Post Content -->
      <div v-if="postData.description && postData.description?.trim().length != 0">
        <div class="px-6 mb-10">
          <p class="text-about-heading py-3">Post Content</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="postData.description"></div>
            </div>
          </VRow>
        </div>
        <VDivider v-if="postData.images && postData.images.length > 0"/>
      </div>

      <!-- Images Section -->
      <div v-if="postData.images && postData.images.length > 0" class="px-6 mt-6 mb-6">
        <p class="text-about-heading py-3 d-flex align-center">
          <PhImages class="mr-2"/> Post Images
          <span class="ml-2 text-caption text-gs60">({{ postData.images?.length }} image{{postData.images?.length! > 1 ? 's' : ''}})</span>
        </p>

        <VRow>
          <VCol
              v-for="(image, index) in postData.images"
              :key="index"
              cols="12"
              sm="6"
              md="4"
          >
            <VCard
                class="image-card elevation-2"
                @click="openImagePreview(index)"
            >
              <VImg
                  :src="image.image! as string"
                  height="200"
                  cover
              >
                <div class="image-overlay">
                  <VBtn
                      icon
                      variant="elevated"
                      size="small"
                      class="image-preview-btn"
                  >
                    <PhImages :size="20" />
                  </VBtn>
                </div>
              </VImg>
            </VCard>
          </VCol>
        </VRow>
      </div>

      <!-- Image Preview Dialog -->
      <VDialog
          v-model="imagePreviewDialog"
          max-width="90%"
          class="image-preview-dialog"
      >
        <VCard>
          <VCardText class="pa-0 position-relative">
            <VBtn
                icon
                variant="text"
                class="close-btn"
                @click="imagePreviewDialog = false"
            >
              ✕
            </VBtn>
            <VImg
                :src="postData.images?.[selectedImageIndex]?.image! as string"
                max-height="80vh"
            />
          </VCardText>
        </VCard>
      </VDialog>
    </div>

    <div v-else style="height: 100%">
      <div style="height:45vh" class="d-flex flex-column justify-center align-center">
        <VImg
            :src="NotFound"
            width="300px"
        />
        <p class="text-h4 font-weight-black">Post Not Found</p>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.image-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.image-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.image-preview-btn {
  background: rgba(255, 255, 255, 0.8) !important;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

/* Existing styles from previous component remain the same */
.back-button {
  width: 225px;
  font-size: 14px;
}

.back-button:hover {
  border-radius: 8px;
  background-color: #F0F5F9;
}

.topic-subtitle {
  font-size: 16px;
  font-weight: 700;
}

.action-button {
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover {
  background-color: #F0F5F9;
}

.action-menu-item {
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.text-about-heading {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
  align-items: center;
}

.action-menu-item:hover {
  background-color: #e0e3e3;
}
</style>