<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import Quill from "quill";
  import "quill/dist/quill.snow.css"
  import "quill/dist/quill.core.css"
  import {useQuill} from "../composables/useQuill.ts";

  const props = defineProps({
    placeholder: {
      type: String,
      default: 'Enter Here'
    },
    modelValue: {
      type: String,
      default: ``
    }
  })

  const emits = defineEmits(['update:modelValue']);

  const {toolbarOptions} = useQuill();
  const quill = ref<null | Quill>(null);

  onMounted(() => {
    quill.value = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: <string> props.placeholder,
    });
    if (quill.value) {
      // @ts-ignore
      quill.value.root.innerHTML = <string>props.modelValue
    }
    quill.value?.on('text-change', () => {
      emits('update:modelValue', quill.value?.root.innerHTML);
    })
  })
</script>

<template>
  <div id="editor">
  </div>
</template>

<style scoped>
  :deep(.ql-toolbar){
    margin-top: 8px;
    border: 1.75px solid rgba(140, 140, 140, 0.2) !important;
    border-radius: 10px 10px 0 0 !important;
  }

  :deep(.ql-editor.ql-blank::before){
    content: none;
  }

  :deep(.ql-editor.ql-blank::after){
    color: #5F6061;
    opacity: 90%;
    content: attr(data-placeholder);
    font-style: normal;
    pointer-events: none;
    display: block;
    margin-top: -1.42rem;
  }

  #editor{
    border: 1.75px solid rgba(140, 140, 140, 0.2);
    border-radius: 0 0 10px 10px ;
    height: 200px;
    font-size: 16px;
  }
</style>