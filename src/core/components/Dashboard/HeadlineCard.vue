<script setup lang="ts">
import Sector from "../../../assets/images/sector-img.jpg";
</script>

<template>
  <VSheet width="430px" height="174px" class="card pb-4 pt-6 mr-6 my-1">
    <VRow class="mx-0" justify="space-between" align="center">
      <VImg
          :src="Sector"
          height=148px
      />
      <div style="width: 255px" class="pr-2">
        <p style="font-weight: 600">Associate an Area or Boundary Now</p>
        <p class="text-subtitle">Create an associated area and tag it in your existing project!</p>
        <VBtnPrimaryFilled
          style="font-size: 14px !important;"
          class="my-2 mr-2"
          rounded="lg"
          :to="{
            name: 'new-sector'
          }"
        >
          Create an Associated Area Now!
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