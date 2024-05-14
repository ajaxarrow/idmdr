<script setup lang="ts">
import {onMounted, ref} from "vue";
  import {useRepositoryStore} from "../../stores/repositoryStore.ts";
  import {useRouting} from "../../composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../layouts/RepositoryDetailsLayout.vue";
  import {Comment} from "../../interfaces/dicussion.interface.ts";
  import comments from "../../data/comment.ts";
  import {PhArrowLeft} from "@phosphor-icons/vue";
  const {repository, setRepositoryData} = useRepositoryStore();
  const {route} = useRouting();
  const commentData = ref<Comment[]>([]);
  const fetchCommentsByTopic = (id: string): Comment[] => {
    const commentList = comments.filter(comment => comment.topicID === id);
    if (commentList) {
      return commentList;
    } else {
      console.error('no comment')
      return [];
    }
  }
  onMounted(() => {
    setRepositoryData(route.params.slug as string);
    commentData.value = fetchCommentsByTopic(route.params.topic as string);
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