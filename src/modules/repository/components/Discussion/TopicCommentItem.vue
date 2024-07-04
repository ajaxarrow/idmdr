<script setup lang="ts">
import {PropType, ref} from "vue";
import {Comment} from "../../../../interfaces/dicussion.interface.ts";
import {PhDotsThreeOutlineVertical, PhPencil, PhTrash} from "@phosphor-icons/vue";

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
          :src="props.comment?.ownerImage ? props.comment.ownerImage : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
      />
      <div class="ml-2 owner-area">
        <div style="line-height: 20px">
          <p class="topic-subtitle">{{ props.comment?.owner }}</p>
          <p class="text-gs60" style="font-size: 14px">Commented a month ago</p>
        </div>
      </div>
      <p class="mb-3 ml-2 content-area">{{props.comment?.content}}</p>
      <VMenu v-model="commentActionMenu" :close-on-content-click="false" class="action-area">
        <template #activator="{ props }">
          <PhDotsThreeOutlineVertical v-bind="props" weight="fill" class="cursor-pointer action-icon"/>
        </template>
        <VSheet width="200" class="rounded-b-lg py-2">
          <p @click="props.editComment?.(<Comment>comment)" class="cursor-pointer action-menu-item">
            <PhPencil/>
            Edit
          </p>
          <p @click="props.deleteComment?.(<Comment>comment)" class="cursor-pointer action-menu-item">
            <PhTrash/>
            Delete
          </p>
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
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
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