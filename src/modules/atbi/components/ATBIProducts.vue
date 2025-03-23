<script setup lang="ts">
import { PropType } from "vue";
import { ATBI } from "../../../interfaces/atbi.interface.ts";

const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  }
})
</script>

<template>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">Products</p>
      <div v-if="props.atbi?.products && props.atbi.products.length > 0">
        <div v-for="(product, index) in props.atbi.products" :key="index" class="mb-4">
          <h3 class="font-bold text-lg">{{ product.name }}</h3>
          <p v-if="product.price !== undefined" class="text-sm text-gray-600 mb-1">
            Price: {{ product.price }} {{ product.unit || '' }}
          </p>
          <div v-if="product.description" class="ql-snow">
            <div class="ql-editor" v-html="product.description"></div>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No product information available</p>
    </div>
  </div>
</template>

<style scoped>
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>