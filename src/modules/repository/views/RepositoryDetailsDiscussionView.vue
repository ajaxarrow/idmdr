<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {PhChatCircleDots, PhCheckCircle, PhInfo, PhMagnifyingGlass, PhX} from "@phosphor-icons/vue";
import TopicItem from "../components/Discussion/TopicItem.vue";
import {Topic} from "../../../interfaces/dicussion.interface.ts";
import TopicFormDialog from "../components/Discussion/TopicFormDialog.vue";
import {useRepositoryDiscussionTopicServices} from "../services/repository-discussion-topic.services.ts";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";

const {fetchTopicsByRepository} = useRepositoryDiscussionTopicServices();
  const {isMobile} = useScreenStore();
  const {repository, setRepositoryData} = useRepositoryStore()
  const searchedTopics = ref<Topic[]>([]);
  const topicList = ref<Topic[]>([]);
  const {route} = useRouting()
  const searchQuery = ref('');
  const snackbar = ref(false);
  const snackbarMessage = ref('');

  const showSnackbar = (message: string) => {
    snackbarMessage.value = message;
    snackbar.value = true
  }

  const fetchTopicList = () => {
    topicList.value = fetchTopicsByRepository(<string>route.params.slug)
    searchedTopics.value = topicList.value
  }

  const addTopicCallback = () => {
    showSnackbar('Topic Added Successfully!');
    fetchTopicList();
  }


  const filterTopicsBySearchQuery = (): Topic[] => {
    if (searchQuery.value) {
      return topicList.value.filter(topic =>  topic.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    } else {
      return topicList.value
    }
  }

  watch(() => searchQuery.value, () => {
    searchedTopics.value = filterTopicsBySearchQuery()
  });

  onMounted(() => {
    setRepositoryData(route.params.slug as string);
    fetchTopicList();
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
          Discussions
        </p>
        <TopicFormDialog
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
      <TopicItem
        v-if="searchedTopics.length > 0"
        v-for="topic in searchedTopics"
        :topic="topic"
        :key="topic.id"
      />
      <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Discussions Found</p>
      <div >
        <VSnackbar
            style="z-index: 10000 !important;"
            v-model="snackbar"
            :timeout="3000"
            :location="isMobile ? 'top left' : 'bottom left'"
            variant="flat"
        >
          <!--      <VAlert-->
          <!--          theme="dark"-->
          <!--          color="#050E14"-->
          <!--          border-->
          <!--      >-->
          <!--        <p class="d-flex align-center ga-2">-->
          <!--          <PhCheckCircle color="#32C8B4" weight="fill" size="20"/>-->
          <!--          {{ snackbarMessage }}-->
          <!--        </p>-->
          <!--      </VAlert>-->
          <p class="d-flex align-center ga-2">
            <PhCheckCircle color="#32C8B4" weight="fill" size="20"/>
            {{ snackbarMessage }}
          </p>
          <template v-slot:actions>
            <VBtn
                color="white"
                @click="snackbar = false"
            >
              <PhX weight="bold"/>
            </VBtn>
          </template>
        </VSnackbar>
      </div>
    </div>

  </RepositoryDetailsLayout>
</template>

<style scoped>

</style>