<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {PhChatCircleDots, PhInfo, PhMagnifyingGlass} from "@phosphor-icons/vue";
import TopicItem from "../components/Discussion/TopicItem.vue";
import {Topic} from "../../../interfaces/discussion.interface.ts";
import TopicFormDialog from "../components/Discussion/TopicFormDialog.vue";
import {useRepositoryDiscussionTopicServices} from "../services/repository-discussion-topic.services.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useRepositoryServices} from "../services/repository.services.ts";

const {user} = useUserStore()
const {showSnackbarMessage} = useSnackbarStore();
const {fetchDiscussionTopicsByRepository, loading} = useRepositoryDiscussionTopicServices();
const {repository} = useRepositoryStore()
const {fetchRepositoryData} = useRepositoryServices()
const searchedTopics = ref<Topic[]>([]);
const topicList = ref<Topic[]>([]);
const {route} = useRouting()
const searchQuery = ref('');
const pageLoading = ref(false)

const fetchTopicList = async() => {
  topicList.value = await fetchDiscussionTopicsByRepository(<string>route.params.slug)
  searchedTopics.value = topicList.value
}

const addTopicCallback = async () => {
  showSnackbarMessage('Topic Added Successfully', Status.success)
  await fetchTopicList();
}


const filterTopicsBySearchQuery = (): Topic[] => {
  if (searchQuery.value) {
    return topicList.value.filter(topic =>  topic.topic_title.toLowerCase().trim().includes(searchQuery.value.toLowerCase().trim())
    )
  } else {
    return topicList.value
  }
}

watch(() => searchQuery.value, () => {
  searchedTopics.value = filterTopicsBySearchQuery()
});

onMounted(async() => {
  pageLoading.value = true
  await fetchRepositoryData(route.params.slug as string);
  await fetchTopicList();
  pageLoading.value = false
})
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="discussions">
    <div v-if="repository" class="pa-6">
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
          <p class="text-gs20">Search Discussions</p>
        </template>
      </VTextField>
      <VRow justify="space-between" align="center" class="ma-0 my-6 mx-0">
        <p class="text-title d-flex align-center">
          <PhChatCircleDots size="24" class="mr-1"/>
          Discussions<span v-if="topicList.length > 0" class="ml-1">({{searchedTopics.length}})</span>
        </p>
        <TopicFormDialog
          v-if="user"
          :form-type="FormType.create"
          @callback="addTopicCallback"
        >
          <VBtnPrimaryFilled
              rounded="lg"
              class="satoshi-md"
              width="130px"
              height="40px"
              style="font-size: 14px !important;"
          >
            New Topic
          </VBtnPrimaryFilled>
        </TopicFormDialog>
      </VRow>
      <div v-if="pageLoading" class="loading-state-container">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else>
        <TopicItem
            v-if="searchedTopics.length > 0"
            v-for="topic in searchedTopics"
            :topic="topic"
            :key="topic.id"
        />
        <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Discussions Found</p>
      </div>
    </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>

</style>