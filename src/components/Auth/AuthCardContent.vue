<script setup lang="ts">
  import Welcome from '../../assets/images/welcome.svg';
  import {computed, onMounted, ref, watch} from "vue";
  import {useRouting} from "../../composables/useRouting.ts";
  import {PhGithubLogo, PhGoogleLogo} from "@phosphor-icons/vue";
  import {LocationQueryValue} from "vue-router";
  const {router, route} = useRouting()
  const register = 'register';
  const login = 'login';
  const tab = ref('register')
  const authType = computed(() => tab.value === 'login' ?  'Login' : 'Register')

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
      if (newTab !== tab.value) {
        tab.value = newTab;
      }
    } else {
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
      <VTab :value="login" class="tab-title">Login</VTab>
      <VTab :value="register" class="tab-title">Register</VTab>
    </VTabs>
  </div>
  <VDivider/>
  <div class=" pt-6 pb-8 px-8 ">
    <VRow justify="center" class="mt-5">
      <VBtnAuth
          :to="{name: 'dashboard'}"
          class="text-auth mb-5 hvr-icon-float"
          v-for="authButton in authButtons">
        <component size="20" class="mr-2 hvr-icon" weight="fill" :is="authButton.icon" /> {{authType}} with {{authButton.title}}
      </VBtnAuth>
    </VRow>


    <p class="text-center my-3" v-if="tab === 'login'">
      New to this platform?
      <RouterLink
          :to="{ path: 'auth', query: { tab: 'register' } }"
          class="text-black">
        <span>Register Here!</span>
      </RouterLink>
    </p>
    <p class="text-center my-3" v-else>
      Already a user?
      <RouterLink
          :to="{ path: 'auth', query: { tab: 'login' } }"
          class="text-black ">
        <span>Login Here!</span>
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