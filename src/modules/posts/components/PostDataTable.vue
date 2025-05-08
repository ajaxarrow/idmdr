<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {usePostServices} from "../services/post.services.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {computed, ref} from "vue";
import {Post} from "../../../interfaces/post.interface.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {onMounted, watch} from "vue";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {
  PhCheck,
  PhDotsThreeOutlineVertical,
  PhEye,
  PhPencil,
  PhPlus,
  PhTrash,
  PhX
} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";

const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore()

const {fetchPostsByAdmin, fetchTotalPosts, deletePost, managePostStatus} = usePostServices()
const {fetchAllOrganizationsBasicData} = useOrganizationServices();
const selectedOrganization = ref<string>('');
const posts = ref<Post[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedStatus = ref<string | boolean>('');
const organizations = ref<any[]>([]);

const managePostStatusCallback = async(id: string, isPublished: boolean) => {
  await managePostStatus(id, isPublished);
  showSnackbarMessage(`Post ${isPublished ? 'Published' : 'Unpublished'} Successfully`, Status.success);
  await loadPosts()
}

const deletePostCallback = async (id: string) => {
  showSnackbarMessage('Post Deleted Successfully', Status.success)
  await deletePost(id);
  await loadData()
}

const getStatusInfo = (post: Post) => {
  if (post.is_published) {
    return {
      status: 'Published',
      color: 'success',
      icon: PhCheck,
      tooltip: 'Post is published'
    };
  } else {
    return {
      status: 'Unpublished',
      color: 'warning',
      icon: PhX,
      tooltip: 'Post is unpublished'
    }
  }
};

const postStatusOptions = [
  { title: 'All', value: '' },
  { title: 'Published', value: true },
  { title: 'Unpublished', value: false },
]

const headers = computed(() => [
  { title: 'Post', key: 'title', sortable: true, visible: true },
  { title: 'Status', key: 'is_published', sortable: true, visible: true },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));


const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};

const tableFilters = computed(() => [
  {
    key: 'postStatus',
    label: 'Post Status',
    value: selectedStatus.value,
    items: postStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'is_published'
  }
])

const clearFilters = () => {
  selectedStatus.value = '';
}

const handleFilterUpdate = ({ key, value }: { key: any, value: any }) => {
  if (key === 'postStatus') {
    selectedStatus.value = value;
  }
}

const loadData = async ()=> {
  page.value = 1;
  await loadPosts();
  await updateTotalCount();
}

const loadPosts = async () => {
  loading.value = true;
  try {
    posts.value = await fetchPostsByAdmin(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedOrganization.value,
        selectedStatus.value
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const updateTotalCount = async () => {
  totalItems.value = await fetchTotalPosts(1, 10000000, search.value, selectedOrganization.value, selectedStatus.value);
}

watch([selectedOrganization, selectedStatus], async () => {
  await loadData();
})

onMounted(async () => {
  organizations.value = [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizationsBasicData(1, 1000))];
  await loadData()
})



</script>

<template>
  <BaseDataTable
      title="All Posts"
      subtitle="Create and manage all posts across NOMCAARRD"
      :items="posts"
      :headers="headers"
      :loading="loading"
      :totalItems="totalItems"
      searchPlaceholder="Search posts..."
      emptyStateHeader="`No Posts found"
      :mptyStateDescription="`There are no posts found matching your criteria`"
      :filters="tableFilters"
      :itemsPerPageOptions="itemsPerPage"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @update:selectedColumns="updateColumnVisibility"
      @loadData="loadPosts"
      @clearFilters="clearFilters"
      @update:filter="handleFilterUpdate"
      @refreshData="loadData"
      :expandable="true"
  >
    <template #header-actions>
      <VBtnPrimaryFilled :to="{name: 'new-post'}" v-if="isSmall || isTablet" icon >
        <PhPlus size="16"/>
      </VBtnPrimaryFilled>
      <VBtnPrimaryFilled :to="{name: 'new-post'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
        <PhPlus size="16" class="mr-2"/>
        New Post
      </VBtnPrimaryFilled>
    </template>

    <template #item.title="{ item }">
      <div class="d-flex align-center" style="max-width: 400px;">
        <VAvatar
            size="36"
            class="me-2"
        >
          <VImg :src="item.images?.length ? item.images[0].image :'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1' " alt="Project" />
        </VAvatar>
        <div>
          <p class="font-weight-medium mb-0">{{ item.title }}</p>
          <p class="text-caption text-medium-emphasis mb-0">{{item.organizationData?.name}}({{item.organizationData?.acronym}})</p>
        </div>
      </div>
    </template>

    <template #item.is_published="{ item }">
      <VTooltip :text="getStatusInfo(item).tooltip">
        <template v-slot:activator="{ props }">
          <VChip
              :color="getStatusInfo(item).color"
              size="small"
              class="text-capitalize"
              v-bind="props"
          >
            <component :is="getStatusInfo(item).icon" size="14" class="mr-1" />
            {{ getStatusInfo(item).status }}
          </VChip>
        </template>
      </VTooltip>
    </template>

    <template #item.actions="{ item }">
      <VMenu
          location="bottom end"
          :close-on-content-click="false"
          transition="slide-y-transition"
      >
        <template #activator="{ props }">
          <VBtn icon variant="text" v-bind="props" density="comfortable">
            <PhDotsThreeOutlineVertical weight="fill"/>
          </VBtn>
        </template>
        <VCard class="action-menu rounded-lg" min-width="220" elevation="3">
          <VList density="compact" nav>
            <VListItem v-if="item.is_published" :to="{ name: 'news-updates-detail', params: {slug: item.uid}}" class="action-menu-item">
              <template v-slot:prepend>
                <PhEye class="mr-2" />
              </template>
              <VListItemTitle>View Post in Public</VListItemTitle>
            </VListItem>
            <VListItem :to="{ name: 'organization-posts-details', params: { post: item.uid, slug: item.organization }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhEye class="mr-2" />
              </template>
              <VListItemTitle>View Post Details</VListItemTitle>
            </VListItem>

            <VListItem :to="{ name: 'edit-post', params: { slug: item.uid }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhPencil class="mr-2" />
              </template>
              <VListItemTitle>Edit Post</VListItemTitle>
            </VListItem>



            <VDivider class="my-1"></VDivider>
            <ConfirmationDialog
                :isWarning="true"
                @callback="deletePostCallback(item.uid as string)"
                confirm-content="Delete Post"
                content="Are you sure you want to delete this post?"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhTrash class="mr-2" />
                </template>
                <VListItemTitle>Delete Post</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>
            <ConfirmationDialog
                :isWarning="item?.is_published"
                @callback="managePostStatusCallback(item.uid as string, !item.is_published)"
                :confirm-content="item.is_published ? 'Unpublish Post' : 'Publish Post'"
                :content="item.is_published ? 'Are you sure you want to unpublish this post? All project data will be deleted.' : 'Are you sure you want to publish this post?'"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhX v-if="item.is_published" class="mr-2" />
                  <PhCheck v-else class="mr-2" />
                </template>
                <VListItemTitle>{{item.is_published ? 'Unpublish Post' : 'Publish Post'}}</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>
          </VList>
        </VCard>
      </VMenu>
    </template>

    <template #expanded-row="{ item }">
      <tr>
        <td :colspan="headers.filter(h => h.visible).length + 1">
          <div class="pa-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>
            <div class="ql-snow">
              <div class="ql-editor description-content" v-html="item.description"></div>
            </div>
          </div>
        </td>
      </tr>
    </template>

    <template #additional-filters>
      <VCol cols="12" sm="6" md="4" lg="3">
        <VSelect
            v-model="selectedOrganization"
            :items="organizations"
            :item-title="organization => organization.acronym ? `${organization.name} (${organization.acronym})` : organization.name"
            :item-value="organization => `${organization.uid}`"
            label="Organization"
            hide-details
            density="compact"
            variant="outlined"
            rounded="md"
            color="primary"
            base-color="gs60"
            class="mb-3"
        />
      </VCol>
    </template>

  </BaseDataTable>
</template>

<style scoped>
.action-menu {
  overflow: hidden;
}

.action-menu-item {
  transition: background-color 0.2s ease;
}

.action-menu-item:hover {
  background-color: #f0f5f9;
}
</style>