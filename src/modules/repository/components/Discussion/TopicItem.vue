<script setup lang="ts">
import {onMounted, PropType, ref} from "vue";
import {Topic} from "../../../../interfaces/discussion.interface.ts";
import {useScreenStore} from "../../../../core/stores/screen-size.store.ts";
import {useRouting} from "../../../../core/composables/useRouting.ts";
const props = defineProps({
  topic: {
    type: Object as PropType<Topic>,
  }
});

const {isDesktop} = useScreenStore();
const {router, route} = useRouting();
const totalComments = ref(0);



const goToTopicDetails = () => {
  router.push({
    name: 'repository-discussions-topic',
    params: {
      slug: <string>route.params.slug,
      topic: props.topic?.id
    }
  });
}

onMounted(() => {
  //@ts-ignore
  totalComments.value = props.topic?.comments.length

})
</script>

<template>
  <div class="mb-2 cursor-pointer" @click="goToTopicDetails()">
    <VRow justify="space-between" align="center" class="ma-0 data-list-item" >
      <div class="d-flex align-center">
        <VImg
            style="border-radius: 50%"
            cover
            height="40px"
            width="40px"
            :src="typeof props.topic?.user === 'object' ? props.topic?.user?.profile_picture! : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
        />
        <div class="ml-2">
          <p class="topic-title">{{ props.topic?.topic_title }}</p>
          <p class="topic-subtitle">{{ typeof props.topic?.user === 'object' ? props.topic?.user?.username : '' }} · {{totalComments}} comment<span v-if="totalComments > 1">s</span></p>
        </div>
      </div>
      <VBtn
          :to="{
            name: 'repository-discussions-topic',
            params: {
              slug: <string>route.params.slug,
              topic: props.topic?.id
            }
          }"
          class="text-none bg-background view-details-btn"
          height="35px"
          width="95px"
          rounded="xl"
          v-if="isDesktop"
      >
        View Details
      </VBtn>
    </VRow>
    <VDivider class="mt-2"/>
  </div>
</template>

<style scoped>

.topic-title{
  font-weight: 600;
}

.topic-subtitle{
  font-size: 14px;
}

.view-details-btn{
  font-size: 14px;
  letter-spacing: 0;
}

.v-btn--variant-elevated{
  box-shadow: 0 0 7px 0 #dae5f4;
}
</style>