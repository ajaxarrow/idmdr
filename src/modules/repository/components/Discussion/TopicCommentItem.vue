<script setup lang="ts">
import {PropType, ref} from "vue";
import {Comment} from "../../../../interfaces/discussion.interface.ts";
import {PhDotsThreeOutlineVertical, PhPencil, PhTrash} from "@phosphor-icons/vue";
import DeleteDialog from "../../../../core/components/DeleteDialog.vue";
import {useUserStore} from "../../../../core/stores/user.store.ts";

const {userData, user} = useUserStore()
const commentActionMenu = ref(false)
const props = defineProps({
  comment: {
    type: Object as PropType<Comment>
  },
  editComment: {
    type: Function as PropType<(comment: Comment) => void>,
  },
  deleteComment: {
    type: Function as PropType<(comment: Comment) => void>,
  }
})

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const times = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(times)) {
    const elapsed = Math.floor(differenceInSeconds / secondsInUnit);
    if (elapsed > 0) {
      return `${elapsed} ${unit}${elapsed > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just Now';
};

const handleDelete = (comment: Comment) => {
  props.deleteComment?.(comment)
  commentActionMenu.value = false
}
</script>

<template>
  <div class="my-5">
    <div class="mb-2 comment-container">
      <VImg
          class="avatar-area"
          style="border-radius: 50%"
          cover
          height="40px"
          width="40px"
          :src="typeof props.comment?.user === 'object'
    ? props.comment.user.profile_picture
      ? props.comment.user.profile_picture
      : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'
    : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
      />

      <div class="ml-2 owner-area">
        <div style="line-height: 20px">
          <p class="topic-subtitle">
            {{
              typeof props.comment?.user === 'object'
                  ? props.comment.user.username
                      ? props.comment.user.username
                      : `${props.comment.user.first_name} ${props.comment.user.last_name}`
                  : ''
            }}
          </p>
          <p class="text-gs60" style="font-size: 14px">
            {{ getRelativeTime(props.comment?.date_updated as string) }}
          </p>
        </div>
      </div>
      <p class="mb-3 ml-2 content-area">{{props.comment?.comment_content}}</p>
      <VMenu v-if="user && typeof props.comment?.user === 'object' && userData.uid === props.comment.user.uid"
             v-model="commentActionMenu" :close-on-content-click="false" class="action-area">
        <template #activator="{ props }">
          <PhDotsThreeOutlineVertical v-bind="props" weight="fill" class="cursor-pointer action-icon"/>
        </template>
        <VSheet width="150" class="rounded-b-lg py-2">
          <p @click="props.editComment?.(<Comment>comment)" class="cursor-pointer action-menu-item">
            <PhPencil/>
            Edit
          </p>
          <DeleteDialog @callback="handleDelete(<Comment>comment)">
            <p  class="cursor-pointer action-menu-item">
              <PhTrash/>
              Delete
            </p>
          </DeleteDialog>
        </VSheet>
      </VMenu>
    </div>
    <VDivider/>
  </div>
</template>

<style scoped>
.action-icon{
  border-radius: 50%;
}

.comment-container{
  display: grid;
  grid-template-areas:
  "avatar owner action"
  "avatar content action";
  grid-template-columns: min-content 1fr min-content;
}

.avatar-area{
  grid-area: avatar;
}

.content-area{
  grid-area: content;
}

.owner-area{
  grid-area: owner;
}

.action-area{
  grid-area: action;
}
.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.action-button:hover, .action-icon:hover{
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

.topic-subtitle{
  font-size: 16px;
  font-weight: 700;
}
</style>