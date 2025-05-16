<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {Comment, Topic} from "../../../interfaces/discussion.interface.ts";
import {PhArrowLeft, PhChat, PhDotsThreeOutlineVertical, PhInfo, PhPencil, PhTrash,} from "@phosphor-icons/vue";
import NotFound from "../../../assets/images/404.svg";
import {useRepositoryDiscussionTopicServices} from "../services/repository-discussion-topic.services.ts";
import TopicCommentItem from "../components/Discussion/TopicCommentItem.vue";
import {useRepositoryDiscussionCommentServices} from "../services/repository-discussion-comment.services.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import TopicFormDialog from "../components/Discussion/TopicFormDialog.vue";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import {useRepositoryServices} from "../services/repository.services.ts";

const {user, userData} = useUserStore()
const {showSnackbarMessage} = useSnackbarStore();
const {repository} = useRepositoryStore();
const {fetchRepositoryData} = useRepositoryServices()
const {fetchDiscussionTopicByID, deleteDiscussionTopic} = useRepositoryDiscussionTopicServices();
const {fetchCommentsByDiscussion, updateDiscussionTopicComment, deleteDiscussionTopicComment, addDiscussionTopicComment} = useRepositoryDiscussionCommentServices();
const {route, router} = useRouting();

const topicActionMenu = ref(false);
const topic = ref<Topic | null>(null);
const commentList = ref<Comment[]>([]);
const totalComment = ref(0);

const commentContent = ref('');
const commentContentEdit = ref('');
const selectedCommentID = ref('');
const errorMessage = ref('');
const errorMessageEdit = ref('');

const commentDataInitialState = reactive<Comment>({
  id: '',
  comment_content: '',
  user: userData.uid,
  discussion: ''
})

const commentData = reactive<Comment>({...commentDataInitialState})

const clearCommentData = () => {
  Object.assign(commentData, {...commentDataInitialState})
}

const fetchCommentList = async() => {
  commentList.value = await fetchCommentsByDiscussion(<string>route.params.topic);
  totalComment.value = commentList.value.length
}

const handleComment = async () => {
  if(commentContent.value.trim() === '') {
    errorMessage.value = 'Comment cannot be empty';
  } else {
    errorMessage.value = '';
    commentData.comment_content = commentContent.value;
    commentData.discussion = <string>route.params.topic;
    await addDiscussionTopicComment(commentData, <string>route.params.topic);
    await fetchCommentList()
    clearCommentData()
    commentContent.value = '';
    showSnackbarMessage('Comment Added', Status.success)
  }
}

const removeEditedComment = () => {
  selectedCommentID.value = ''
  commentContentEdit.value = ''
  commentData.comment_content = ''
}

const editComment = (comment: Comment) => {
  selectedCommentID.value = comment?.id!
  commentContentEdit.value = comment.comment_content!
  commentData.id = comment?.id!
  commentData.discussion = <string>route.params.topic
  //@ts-ignore
  if ("uid" in comment.user) {
    //@ts-ignore
    commentData.user = comment.user?.uid as string
  }
}

const updateCommentData = async (comment: Comment) => {
  if(commentContentEdit.value.trim() === '') {
    errorMessageEdit.value = 'Comment cannot be empty';
  } else {
    errorMessageEdit.value = ''
    commentData.comment_content = commentContentEdit.value;
    await updateDiscussionTopicComment(commentData, comment.id!);
    await fetchCommentList()
    clearCommentData()
    removeEditedComment();
    showSnackbarMessage('Comment Updated', Status.success)
  }
}

const deleteCommentData = async (comment: Comment) => {
  await deleteDiscussionTopicComment(comment.id!)
  await fetchCommentList()
  showSnackbarMessage('Comment Deleted', Status.success)
}

const editTopicCallback = async () => {
  showSnackbarMessage('Topic Edited Successfully', Status.success)
  topic.value = await fetchDiscussionTopicByID(<string>route.params.topic);
  topicActionMenu.value = false
}

const deleteTopicCallback = async () => {
  showSnackbarMessage('Topic Deleted Successfully', Status.success)
  await deleteDiscussionTopic(topic.value?.id!);
  topicActionMenu.value = false
  await router.push({
    name: 'repository-discussions',
  });
}

const scrollToCommentInput = () => {
  const commentInput = document.getElementById('comment-input');
  if(commentInput){
    commentInput.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}

onMounted(async () => {
  await fetchRepositoryData(route.params.slug as string);
  await fetchCommentList()
  topic.value = await fetchDiscussionTopicByID(<string>route.params.topic);
  totalComment.value = commentList.value.length
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
                  :src="typeof topic.user === 'object'
    ? topic.user.profile_picture
      ? topic.user.profile_picture
      : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
    : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
              />

              <div class="ml-2" style="line-height: 20px">
                <p class="topic-subtitle">
                  {{
                    typeof topic.user === 'object'
                        ? topic.user.username
                            ? topic.user.username
                            : `${topic.user.first_name ?? ''} ${topic.user.last_name ?? ''}`.trim()
                        : ''
                  }}
                </p>
                <p class="text-gs60" style="font-size: 14px">
                  {{
                    new Date(topic?.date_updated as string).toLocaleDateString('en-US', {
                      month: 'long',
                      day: '2-digit',
                      year: 'numeric'
                    })
                  }}
                </p>
              </div>
            </div>
          </div>
          <VMenu v-if="user" v-model="topicActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <p @click="scrollToCommentInput" class="cursor-pointer action-menu-item">
                <PhChat/>
                Comment on Topic
              </p>
              <div v-if="user && typeof topic?.user === 'object' && userData.uid === topic.user.uid">
                <TopicFormDialog
                    :form-type="FormType.edit"
                    :topic="topic"
                    @callback="editTopicCallback"
                >
                  <p class="cursor-pointer action-menu-item">
                    <PhPencil/>
                    Edit
                  </p>
                </TopicFormDialog>
                <DeleteDialog @callback="deleteTopicCallback">
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Delete
                  </p>
                </DeleteDialog>
              </div>
            </VSheet>
          </VMenu>
        </VRow>
        <p class="topic-title my-3">{{topic.topic_title}}</p>
        <div class="ql-snow">
          <div v-html="topic.topic_content" class="ql-editor"></div>
        </div>
        <VDivider class="my-5"/>
        <p class="mb-3" style="font-weight: 600; font-size: 18px">
          Comment<span v-if="totalComment != 0"><span v-if="totalComment > 1">s</span> ({{totalComment}})</span>
        </p>
        <div
          v-for="comment in commentList"
          v-if="totalComment > 0"
        >
          <div v-if="selectedCommentID == comment.id">
            <VRow class="ma-0 mt-3">
              <VAvatar
                  class="mr-2 mt-2"
                  size="40"
              >
                <VImg
                  :src="typeof comment.user === 'object'
                  ? comment.user.profile_picture
                    ? comment.user.profile_picture
                    : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
                  : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
                />
              </VAvatar>
              <VTextField
                  autofocus
                  @keydown.enter="updateCommentData(comment)"
                  v-model="commentContentEdit"
                  placeholder="Write a comment..."
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :error-messages="errorMessageEdit"
              />
            </VRow>
            <VRow class="ma-0" justify="end">
              <VBtnPrimaryAlt
                  variant="outlined"
                  @click="removeEditedComment"
                  rounded="lg"
                  height="44px"
              >
                Cancel
              </VBtnPrimaryAlt>
              <VBtnPrimaryFilled
                  @click="updateCommentData(comment)"
                  rounded="lg"
                  height="44px"
              >
                Update
              </VBtnPrimaryFilled>
            </VRow>
          </div>
          <TopicCommentItem
            v-else
            :comment="comment"
            :edit-comment="editComment"
            :delete-comment="deleteCommentData"
          />
        </div>
       <div v-if="user">
         <VRow class="ma-0 mt-3">
           <VAvatar
               class="mr-2 mt-2"
               size="40"
           >
             <VImg :src="userData.profilePicture ? userData.profilePicture : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' "></VImg>
           </VAvatar>
           <VTextField
               id="comment-input"
               autofocus
               @keydown.enter="handleComment"
               v-model="commentContent"
               placeholder="Write a comment..."
               rounded="lg"
               density="comfortable"
               variant="outlined"
               color="primary"
               base-color="gs60"
               :error-messages="errorMessage"

           />
         </VRow>
         <VRow class="ma-0 my-2" justify="end">
           <VBtnPrimaryFilled
               @click="handleComment"
               rounded="lg"
               height="44px"
           > Submit
           </VBtnPrimaryFilled>
         </VRow>
       </div>
      <div v-else class="d-flex ga-1 mt-3 align-center text-gs60">
        <PhInfo/> Commenting is only for authenticated user.
      </div>
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