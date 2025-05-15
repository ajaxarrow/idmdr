<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import { useRouting } from "../../../core/composables/useRouting.ts";
import { LocationQueryValue } from "vue-router";
import emailLoad from "../../../assets/lottiefiles/email-load.json"
import { useScreenStore } from "../../../core/stores/screen-size.store.ts";
import { Vue3Lottie } from "vue3-lottie";

import {
  PhEye,
  PhEyeSlash,
  PhCheck,
  PhEnvelope,
  PhLock,
  PhUser,
  PhArrowLeft
} from "@phosphor-icons/vue";
import {useEmailAuthStore} from "../stores/email-auth.store.ts";
import logo from "../../../assets/images/nomcaarrd.png";

const { router, route } = useRouting()
const register = 'register';
const login = 'login';
const tab = ref('register')
const loading = ref(false)
const authType = computed(() => tab.value === 'login' ? 'Login' : 'Register')
const { isMobile, isLargePhone } = useScreenStore()
const layoutValue = computed(() => isMobile || isLargePhone ? '300' : '500')
const emailInputRef = ref<HTMLInputElement | null>(null);
// Get everything from the store
const {
  handleLogin,
  handleRegister,
  userCredentials,
  errorMessages,
  handleEmailInput,
  handlePasswordInput,
  validateConfirmPassword,
  handleNameInput,
  isFormValid,
  passwordStrength,
  passwordStrengthText,
  passwordStrengthColor,
  showPassword,
  showConfirmPassword
} = useEmailAuthStore()

// Computed for form validity using the store function
const formIsValid = computed(() => isFormValid(tab.value === 'login'))

const handleSubmit = async () => {
  if (!formIsValid.value) return

  loading.value = true

  try {
    if (tab.value === 'login') {
      await handleLogin()
    } else {
      await handleRegister()
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.query.tab, (newTab: LocationQueryValue | LocationQueryValue[]) => {
  if (typeof newTab === 'string') {
    if (newTab !== tab.value) {
      tab.value = newTab;
    }
  } else {
    console.error("Unexpected type for newTab:", typeof newTab);
  }
});

watch(() => tab.value, async () => {
  if (tab.value !== "") {
    await router.push({ query: { tab: tab.value } });
  }

  if (tab.value === "login") {
    await nextTick(); // Wait for the DOM to update
    emailInputRef.value?.focus(); // Programmatically focus the email input
  }
});

onMounted(() => {
  tab.value = <string>route.query.tab || "register"
})
</script>

<template>
  <Vue3Lottie v-if="loading" :animation-data="emailLoad" :height="layoutValue" :width="layoutValue"></Vue3Lottie>
  <div v-else>
    <div class="pt-10 px-6 mx-auto">
      <RouterLink to="/" class="text-decoration-none ">
        <VRow class="ma-0 pb-3" justify="center">
          <div class="d-flex justify-center">
            <div class="d-flex align-center text-wrapper text-logo" >
              <img style="height: 32px;" :src="logo" alt="logo" class="ph-icon"/>
              <div>
                <span style="--i:1">N</span>
                <span style="--i:2">O</span>
                <span style="--i:3">M</span>
                <span style="--i:4">C</span>
                <span style="--i:5">A</span>
                <span style="--i:6">A</span>
                <span style="--i:7">R</span>
                <span style="--i:8">R</span>
                <span style="--i:9">D</span>
              </div>
            </div>
          </div>
        </VRow>
      </RouterLink>
      <VTabs class="mt-4" color="primary" align-tabs="center" v-model="tab">
        <VTab :value="login" class="tab-title">Login</VTab>
        <VTab :value="register" class="tab-title">Register</VTab>
      </VTabs>
    </div>
    <VDivider />
    <div class="pt-6 pb-8 px-8">
      <VForm @submit.prevent="handleSubmit">
        <div class="pt-2 pb-3 d-flex">
        <RouterLink
            :to="{
          name: 'auth',
          query: { tab: tab }
        }"
            class="text-decoration-none text-none">
          <p class="cursor-pointer back-button pa-2 d-flex align-center  text-black">
            <PhArrowLeft size="14" class="mr-1"/>
            Back To Auth View
          </p>
        </RouterLink>
        </div>
        <VRow v-if="tab == 'register'">
          <VCol cols="12" sm="6">
            <VTextField
                v-model="userCredentials.firstName"
                label="First Name"
                placeholder="Enter first name"
                variant="outlined"
                :error-messages="errorMessages.firstName"
                @input="() => handleNameInput('firstName')"
                :maxlength="150"
                class="mb-3"
                :autofocus="authType === 'Register'"
            >
              <template v-slot:prepend-inner>
                <PhUser :size="20" />
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField
                v-model="userCredentials.lastName"
                label="Last Name"
                placeholder="Enter last name"
                variant="outlined"
                :error-messages="errorMessages.lastName"
                @input="() => handleNameInput('lastName')"
                :maxlength="150"
                class="mb-3"
            >
              <template v-slot:prepend-inner>
                <PhUser :size="20" />
              </template>
            </VTextField>
          </VCol>
        </VRow>
        <VTextField
            v-model="userCredentials.email"
            label="Email"
            placeholder="youremail@example.com"
            variant="outlined"
            :error-messages="errorMessages.email"
            @input="handleEmailInput"
            :maxlength="254"
            required
            class="mb-3"
            ref="emailInputRef"
        >
          <template v-slot:prepend-inner>
            <PhEnvelope :size="20" />
          </template>
          <template v-slot:append-inner>
            <VIcon v-if="userCredentials.email && !errorMessages.email" color="success">
              <PhCheck :size="20" />
            </VIcon>
          </template>
        </VTextField>

        <VTextField
            v-model="userCredentials.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Enter password"
            variant="outlined"
            :error-messages="errorMessages.password"
            @input="handlePasswordInput"
            required
            class="mb-2"
        >
          <template v-slot:prepend-inner>
            <PhLock :size="20" />
          </template>
          <template v-slot:append-inner>
            <VIcon @click="showPassword = !showPassword">
              <component :is="showPassword ? PhEyeSlash : PhEye" :size="20" />
            </VIcon>
          </template>
        </VTextField>

        <div v-if="userCredentials.password && tab === 'register'" class="d-flex align-center mb-3">
          <span class="mr-2 text-caption">Password strength:</span>
          <VProgressLinear
              :model-value="(passwordStrength / 5) * 100"
              height="8"
              rounded
              :color="passwordStrengthColor"
              class="flex-grow-1"
          ></VProgressLinear>
          <span class="ml-2 text-caption" :class="`text-${passwordStrengthColor}`">
            {{ passwordStrengthText }}
          </span>
        </div>

        <template v-if="tab === 'register'">
          <VTextField
              v-model="userCredentials.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password"
              placeholder="Confirm your password"
              variant="outlined"
              :error-messages="errorMessages.confirmPassword"
              @input="validateConfirmPassword"
              required
              class="mb-3"
          >
            <template v-slot:prepend-inner>
              <PhLock :size="20" />
            </template>
            <template v-slot:append-inner>
              <VIcon @click="showConfirmPassword = !showConfirmPassword">
                <component :is="showConfirmPassword ? PhEyeSlash : PhEye" :size="20" />
              </VIcon>
            </template>
          </VTextField>
        </template>

        <VBtn
            block
            color="primary"
            size="large"
            type="submit"
            class="mt-4"
            :disabled="!formIsValid"
        >
          {{ authType }}
        </VBtn>
      </VForm>

      <p class="text-center my-3" v-if="tab === 'login'">
        New to this platform?
        <RouterLink :to="{ name: 'auth-email', query: { tab: 'register' } }" class="text-black">
          <span>Register Here!</span>
        </RouterLink>
      </p>
      <p class="text-center my-3" v-else>
        Already a user?
        <RouterLink :to="{ name: 'auth-email', query: { tab: 'login' } }" class="text-black">
          <span>Login Here!</span>
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.tab-title {
  font-size: 16px;
}
.text-auth {
  font-weight: 900 !important;
  letter-spacing: 0px;
}
.back-button{
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #F0F5F9;
}

.text-logo {
  color: black;
  font-weight: 900 !important;
  font-size: 24px !important;
}
</style>