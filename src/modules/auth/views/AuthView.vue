<script setup>
import AuthLayout from "../../../core/layouts/AuthLayout.vue";
import AuthCard from "../components/AuthCard.vue";
import {onMounted, ref} from "vue";
import AccountWarningDialog from "../../../core/components/AccountWarningDialog.vue";

const warningDialog = ref(false)

onMounted(async() => {
  const warningMessage = JSON.parse(localStorage.getItem('inactivityWarning'))
  if(warningMessage) {
    warningDialog.value = true
    localStorage.removeItem('inactivityWarning')
  }
})
</script>

<template>
  <AccountWarningDialog :warningDialog="warningDialog" @callback="warningDialog = false" />
  <AuthLayout>
    <AuthCard/>
  </AuthLayout>
</template>
