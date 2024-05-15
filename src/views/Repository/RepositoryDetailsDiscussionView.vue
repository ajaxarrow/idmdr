<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
  import {useRepositoryStore} from "../../stores/repositoryStore.ts";
  import {useRouting} from "../../composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../layouts/RepositoryDetailsLayout.vue";
  import {PhChatCircleDots, PhInfo, PhMagnifyingGlass} from "@phosphor-icons/vue";
  import TopicItem from "../../components/Repository/Discussion/TopicItem.vue";
  import {Topic} from "../../interfaces/dicussion.interface.ts";
  import topics from "../../data/topics.ts";
import {useDiscussion} from "../../composables/useDiscussion.ts";
  const {repository, setRepositoryData} = useRepositoryStore()
  const topicData = ref<Topic[]>([]);
  const topicList = ref<Topic[]>([]);
  const {route} = useRouting()
  const searchQuery = ref('');
  const {fetchTopicsByRepositories} = useDiscussion();

  const filterTopicsBySearchQuery = (): Topic[] => {
    if (searchQuery.value) {
      return topicList.value.filter(topic =>  topic.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    } else {
      return topicList.value
    }
  }

  watch(() => searchQuery.value, () => {
    topicData.value = filterTopicsBySearchQuery()
  });

  onMounted(() => {
    setRepositoryData(route.params.slug as string);
    topicData.value = fetchTopicsByRepositories(<string>route.params.slug);
    topicList.value = fetchTopicsByRepositories(<string>route.params.slug);
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
        <VBtnPrimaryFilled rounded="lg" class="satoshi-md" height="30px" width="110px" style="font-size: 14px !important;">
          New Topic
        </VBtnPrimaryFilled>
      </VRow>
      <TopicItem
        v-if="topicData.length > 0"
        v-for="topic in topicData"
        :topic="topic"
        :key="topic.id"
      />
      <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Discussions Found</p>
    </div>

  </RepositoryDetailsLayout>
</template>

<style scoped>

</style>