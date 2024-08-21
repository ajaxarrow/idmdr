<script setup lang="ts">
  import Welcome from '../../../assets/images/welcome.svg';
  import {computed, onMounted, ref, watch} from "vue";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {PhGithubLogo, PhGoogleLogo} from "@phosphor-icons/vue";
  import {LocationQueryValue} from "vue-router";
  import googleLoad from "../../../assets/lottiefiles/google-load.json"
  import githubLoad from "../../../assets/lottiefiles/github-load.json"
  import Container from "../../../core/components/Container.vue";
  import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
  import {Vue3Lottie} from "vue3-lottie";
  import {useAuthUrls} from "../composables/useAuthUrls.ts";
  import {useUserStore} from "../../../core/stores/user.store.ts";
  import {useAuthStore} from "../stores/auth.store.ts";
  const {router, route} = useRouting()
  const {getGoogleUrl, getGithubUrl} = useAuthUrls()
  const {handleGoogle, handleGithub} = useAuthStore();
  const register = 'register';
  const login = 'login';
  const tab = ref('register')
  const isCallbackTriggered = ref(false);
  const callback = ref('');
  const authType = computed(() => tab.value === 'login' ?  'Login' : 'Register')
  const {isMobile, isLargePhone} = useScreenStore()
  const layoutValue = computed(()=> isMobile || isLargePhone ? '300' : '500' )

  const authButtons = [
    {
      title: 'Google',
      icon: PhGoogleLogo,
      method: getGoogleUrl
    },
    {
      title: 'Github',
      icon: PhGithubLogo,
      method: getGithubUrl
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

  const {user} = useUserStore();


  onMounted(() => {
    tab.value = <string>route.query.tab || "register"
    if(<string>route.query.callback){
      isCallbackTriggered.value = true;
      callback.value = <string>route.query.callback

      if(callback.value === 'github'){
        handleGithub(<string>route.query.code, <string>route.query.state, router);
      }else{
        handleGoogle(<string>route.query.code, <string>route.query.state, router);
      }
    }
  })
</script>

<template>
    <Vue3Lottie
        v-if="isCallbackTriggered"
        :animation-data="callback === 'github' ? githubLoad : googleLoad"
        :height="layoutValue"
        :width="layoutValue"
    ></Vue3Lottie>
    <div v-else>
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
              @click="authButton.method()"
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