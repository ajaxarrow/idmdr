<script setup lang="ts">
import { ref, onMounted } from 'vue';


const observer = ref<IntersectionObserver | null>(null);
const root = ref<HTMLElement | null>(null);

const emits = defineEmits<{
  (event: 'intersect'): void;
}>();

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      emits('intersect');
    }
  });

  if (root.value) {
    if (observer.value) {
      // @ts-ignore
      observer.value.observe(root.value);
    }
  }
});
</script>


<template>
  <div class="observer" ref="root">
    <VProgressCircular
      indeterminate
      color="#23668b"
    ></VProgressCircular>
  </div>
</template>


<style scoped>
.observer{
  display: flex;
  justify-content: center;
}
</style>