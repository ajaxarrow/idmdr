<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import {useRepositoryStore} from "../../stores/repositoryStore.ts";
  import {useRouting} from "../../composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../layouts/RepositoryDetailsLayout.vue";
import {Comment, Topic} from "../../interfaces/dicussion.interface.ts";
  import {PhArrowLeft} from "@phosphor-icons/vue";
import {useDiscussion} from "../../composables/useDiscussion.ts";
  import NotFound from "../../assets/images/404.svg";
  const {repository, setRepositoryData} = useRepositoryStore();
  const {route} = useRouting();
  const topic = ref<Topic | null>(null);
  const commentData = ref<Comment[]>([]);
  const {fetchCommentsByTopic, fetchTopicByTopicID} = useDiscussion();
  onMounted(() => {
    setRepositoryData(route.params.slug as string);
    commentData.value = fetchCommentsByTopic(<string>route.params.topic);
    topic.value = fetchTopicByTopicID(<string>route.params.topic);
    console.log(topic.value)
  })
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="discussions">
    <div class="pa-6">
      <RouterLink
          :to="{
          name: 'repository-discussions',
          params: { slug: repository?.slug }
        }"
          class="text-decoration-none text-none">
        <p class="cursor-pointer back-button pa-2 d-flex align-center  text-black">
          <PhArrowLeft size="20" class="mr-1"/>
          Back To Discussions View
        </p>
      </RouterLink>
    </div>
    <div class="px-6 mb-10">
      <div v-if="topic">
        Topic
      </div>
      <div v-else style="height: 80%">
        <div style="height:60vh" class="d-flex flex-column justify-center align-center">
          <VImg
              :src="NotFound"
              width="400px"
          />
          <p class="text-h4 font-weight-black">Topic Not Found</p>
        </div>
      </div>
    </div>

  </RepositoryDetailsLayout>
</template>

<style scoped>
  .back-button{
    width: 225px;
  }
  .back-button:hover{
    border-radius: 8px;
    background-color: #F0F5F9;
  }
</style>