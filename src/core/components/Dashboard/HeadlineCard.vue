<script setup lang="ts">
import Sector from "../../../assets/images/sector-img.jpg";
</script>

<template>
  <VSheet width="385px" height="174px" class="card pb-4 pt-6 mr-6 my-1">
    <VRow class="mx-0" justify="space-between" align="center">
      <VImg
          :src="Sector"
          height=148px
      />
      <div style="width: 220px">
        <p style="font-weight: 600">Tag a Sector Now</p>
        <p class="text-subtitle">Create a sector and tag it in your existing repository!</p>
        <VBtnPrimaryFilled
          style="font-size: 14px !important;"
          class="my-2"
          rounded="lg"
          :to="{
            name: 'sectors',
            query: {
              dialog: true
            }
          }"
        >
          Tag a Sector Now!
        </VBtnPrimaryFilled>
      </div>
    </VRow>
  </VSheet>
</template>

<style scoped>
  .text-subtitle{
    font-size: 14px;
  }

  .card{
    border-radius: 10px;
    border: 2px solid #E5ECF6;
  }
</style>