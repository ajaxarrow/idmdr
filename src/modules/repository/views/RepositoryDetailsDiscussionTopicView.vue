<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import {useRepositoryStore} from "../stores/repository.store.ts";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
  import {Comment, Topic} from "../../../interfaces/dicussion.interface.ts";
  import {
    PhArrowLeft,PhChat,
    PhDotsThreeOutlineVertical, PhPencil,  PhTrash
  } from "@phosphor-icons/vue";
  import NotFound from "../../../assets/images/404.svg";
  import {useRepositoryDiscussionTopicServices} from "../services/repository-discussion-topic.services.ts";
  import TopicCommentItem from "../components/Discussion/TopicCommentItem.vue";
  const {repository, setRepositoryData} = useRepositoryStore();
  const {route} = useRouting();
  const topic = ref<Topic | null>(null);
  const totalComment = ref(0);
  const commentData = ref<Comment[]>([]);
  const topicActionMenu = ref(false);
  const {fetchCommentsByTopic, fetchTopicByTopicID} = useRepositoryDiscussionTopicServices();
  onMounted(() => {
    setRepositoryData(route.params.slug as string);
    commentData.value = fetchCommentsByTopic(<string>route.params.topic);
    topic.value = fetchTopicByTopicID(<string>route.params.topic);
    totalComment.value = commentData.value.length
  })
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="discussions">
    <div class="px-6 py-2">
      <RouterLink
          :to="{
          name: 'repository-discussions',
          params: { slug: repository?.slug }
        }"
          class="text-decoration-none text-none">
        <p class="cursor-pointer back-button pa-2 d-flex align-center  text-black">
          <PhArrowLeft size="14" class="mr-1"/>
          Back To Discussions View
        </p>
      </RouterLink>
    </div>
    <div class="px-6 mb-10">
      <div v-if="topic">
        <VRow class="ma-0 mt-2 mb-4" justify="space-between" align="center">
          <div>
            <div class="d-flex align-center">
              <VImg
                  style="border-radius: 50%; flex: none !important;"
                  cover
                  height="40px"
                  width="40px"
                  :src="topic.ownerImage ? topic.ownerImage : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
              />
              <div class="ml-2" style="line-height: 20px">
                <p class="topic-subtitle">{{ topic.owner }}</p>
                <p class="text-gs60" style="font-size: 14px">December 8, 2016</p>
              </div>
            </div>
          </div>
          <VMenu v-model="topicActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <p class="cursor-pointer action-menu-item">
                <PhPencil/>
                Edit
              </p>
              <p class="cursor-pointer action-menu-item">
                <PhTrash/>
                Delete
              </p>
              <p class="cursor-pointer action-menu-item">
                <PhChat/>
                Comment on Topic
              </p>
            </VSheet>
          </VMenu>
        </VRow>
        <p class="topic-title my-3">{{topic.title}}</p>
        <div v-html="topic.description" class="my-1"></div>
        <VDivider class="my-5"/>
        <p class="mb-3" style="font-weight: 600; font-size: 18px">
          Comment<span v-if="totalComment != 0"><span v-if="totalComment > 1">s</span> ({{totalComment}})</span>
        </p>
        <TopicCommentItem
          v-if="totalComment > 0"
          v-for="comment in commentData"
          :comment="comment"
        />
       <VRow class="ma-0 mt-3">
         <VAvatar
             class="mr-2 mt-2"
             size="40"
         >
           <VImg src="https://mighty.tools/mockmind-api/content/abstract/46.jpg"></VImg>
         </VAvatar>
         <VTextarea
             placeholder="Write a comment..."
             class="my-2"
             hide-details
             rounded="lg"
             density="comfortable"
             variant="outlined"
             color="primary"
             base-color="gs60"
         />
       </VRow>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              rounded="lg"
              height="44px"
          >
            Submit
          </VBtnPrimaryFilled>
        </VRow>
      </div>
      <div v-else style="height: 100%">
        <div style="height:45vh" class="d-flex flex-column justify-center align-center">
          <VImg
              :src="NotFound"
              width="300px"
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
    border-radius: 8px;
    padding: 6px;
    border: 2px solid #e6e6e6;
  }

  .action-button:hover{
    background-color: #F0F5F9;
  }

  .action-menu-item{
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .action-menu-item:hover{
    background-color: #e0e3e3;
  }

  :deep .v-field__outline {
    opacity: 20%;
    color: #8C8C8C;
    --v-field-border-width: 1.75px !important;
  }

  :deep textarea::placeholder {
    color: #5F6061;
    opacity: 90%;
  }

</style>