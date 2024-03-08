<script setup lang="ts">
  import Welcome from '../../assets/images/welcome.svg';
  import {computed, onMounted, ref, watch} from "vue";
  import {useRouting} from "../../composables/useRouting.ts";
  import {PhGithubLogo, PhGoogleLogo} from "@phosphor-icons/vue";
  import {LocationQueryValue} from "vue-router";
  const {router, route} = useRouting()
  const register = 'register';
  const signin = 'signin';
  const tab = ref('register')
  const authType = computed(() => tab.value === 'signin' ?  'Sign in' : 'Register')

  const authButtons = [
    {
      title: 'Google',
      icon: PhGoogleLogo
    },
    {
      title: 'Github',
      icon: PhGithubLogo
    }
  ]

  watch(() => route.query.tab, (newTab: LocationQueryValue | LocationQueryValue[]) => {
    if (typeof newTab === 'string') {
      // Handle the case where newTab is a string
      if (newTab !== tab.value) {
        tab.value = newTab;
      }
    } else {
      // Handle the case where newTab is an array
      // Adjust the logic based on your requirements
      // For example, you might want to handle an array of values differently
      console.error("Unexpected type for newTab:", typeof newTab);
    }
  });


  watch(() => tab.value, () => {
    if (tab.value !== "") {
      router.push({ query: { tab: tab.value } });
    }
  });


  onMounted(() => {
    tab.value = <string>route.query.tab || "register"
  })
</script>

<template>
  <div class="pt-6 px-6 mx-auto">
    <RouterLink to="/" class="text-decoration-none ">
      <VImg
          :src="Welcome"
          class="mt-5"
          alt="Hero Image"
          width="100%"
          height=80px
      />
    </RouterLink>
    <VTabs
        class="mt-4"
        color="primary"
        align-tabs="center"
        v-model="tab"
    >
      <VTab :value="signin" class="tab-title">Sign In</VTab>
      <VTab :value="register" class="tab-title">Register</VTab>
    </VTabs>
  </div>
  <VDivider/>
  <div class=" pt-6 pb-8 px-8 ">
    <VRow justify="center" class="mt-5">
      <VBtnAuth
          class="text-auth mb-5"
          v-for="authButton in authButtons">
        <component size="20" class="mr-2" weight="fill" :is="authButton.icon" /> {{authType}} with {{authButton.title}}
      </VBtnAuth>
    </VRow>


    <p class="text-center my-3" v-if="tab === 'signin'">
      New to this platform?
      <RouterLink
          :to="{ path: 'auth', query: { tab: 'register' } }"
          class="text-black">
        <span>Register!</span>
      </RouterLink>
    </p>
    <p class="text-center my-3" v-else>
      Already a user?
      <RouterLink
          :to="{ path: 'auth', query: { tab: 'signin' } }"
          class="text-black ">
        <span>Sign in!</span>
      </RouterLink>
    </p>


  </div>
</template>

<style scoped>
  .tab-title{
    font-size: 16px;
  }

  .text-auth{
    font-weight: 900 !important;
    letter-spacing: 0px;
  }
</style>