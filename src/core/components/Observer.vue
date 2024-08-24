<script setup>
import { ref, onMounted} from 'vue';
//@ts-nocheck
const observer = ref(null);
const root = ref(null);

const emits = defineEmits(["intersect"])

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if(entry && entry.isIntersecting){
      emits("intersect")
    }
  })

  observer.value.observe(root.value)
})
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