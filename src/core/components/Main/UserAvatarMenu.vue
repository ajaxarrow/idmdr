<script setup lang="ts">
import {ref} from 'vue'
import {useUserStore} from "../../stores/user.store.ts";
import {
  PhAirplaneLanding,
  PhBell,
  PhCloud, PhFingerprint, PhKey,
  PhQuestion,
  PhSignOut, PhUserCircle,
  PhUsersFour
} from "@phosphor-icons/vue";

const {userData, user} = useUserStore()

const menu = ref(false)

const navs = [
  {
    title: userData.is_superuser ? 'Projects' : 'My Projects',
    link: userData.is_superuser ? '/repositories' : '/my-repositories',
    icon: PhCloud,
  },
  {
    title: userData.is_superuser ? 'CMIs' : 'My CMIs',
    link: userData.is_superuser ? '/organizations' : '/my-organizations',
    icon: PhUsersFour,
  },
  {
    title: "Notifications",
    link: "/notifications",
    icon: PhBell,
  },
    ...(userData.is_superuser ? [] : [{
      title: "My Profile",
      link: "/profile",
      icon: PhUserCircle,
    }]),
  // {
  //   title: "Account Settings",
  //   link: "/settings/account",
  //   icon: PhUserCircleGear,
  // },
];


</script>

<template>

  <VMenu
      v-model="menu"
      :close-on-content-click="false"
      class="mt-3 mx-2"
  >
    <template v-slot:activator="{ props }">

      <VAvatar
          size="40"
          class="ml-1 cursor-pointer"
          v-bind="props"
      >
        <VImg  :src="userData.profilePicture.trim() != '' ? userData.profilePicture : 'https://mighty.tools/mockmind-api/content/abstract/46.jpg'"></VImg>

        <VTooltip
            activator="parent"
            location="bottom"
        >Account</VTooltip>
      </VAvatar>

    </template>

    <VCard min-width="250">
      <VList lines="three" density="compact">
        <VListItem>
          <template v-slot:prepend>
            <VAvatar class="mt-2">
              <VImg
                  :src="userData.profilePicture.trim() != '' ? userData.profilePicture : 'https://mighty.tools/mockmind-api/content/abstract/46.jpg'"
              ></VImg>
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-bold text-primary">
            {{ userData.firstName }} {{userData.lastName}}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ userData.email }}
          </VListItemSubtitle>
        </VListItem>
      </VList>
      <VDivider />

      <div v-if="user && userData.is_approved">
        <VList variant="flat" elevation="0" :lines="false" density="compact">
          <VListItem
              color="primary"
              v-for="(nav, i) in navs"
              :key="i"
              :to="nav.link"
              link
              density="compact"
              class="py-3"
          >
            <template v-slot:prepend>
              <component :is="nav.icon" size="20" weight="fill" class="mr-2 icon" />
            </template>

            <div>
              <VListItemSubtitle class="text-body-2">{{
                  nav.title
                }}</VListItemSubtitle>
            </div>
          </VListItem>
        </VList>
        <VDivider />
      </div>
      <div v-else>
        <VList variant="flat" elevation="0" :lines="false" density="compact" v-if="!user">
          <VListItem
              color="primary"
              to="/auth?tab=login"
              link
              density="compact"
              class="py-3"
          >
            <template v-slot:prepend>
              <PhFingerprint size="20" weight="fill" class="mr-2 icon" />
            </template>

            <div>
              <VListItemSubtitle class="text-body-2">Login</VListItemSubtitle>
            </div>
          </VListItem>
          <VListItem
              color="primary"
              to="/auth?tab=register"
              link
              density="compact"
              class="py-3"
          >
            <template v-slot:prepend>
              <PhKey size="20" weight="fill" class="mr-2 icon" />
            </template>

            <div>
              <VListItemSubtitle class="text-body-2">Register</VListItemSubtitle>
            </div>
          </VListItem>
        </VList>
        <VDivider />
      </div>
      <VList variant="flat" elevation="0" :lines="false" density="compact">
        <VListItem
          color="primary"
          to="/help"
          link
          density="compact"
          class="py-3"
        >
          <template v-slot:prepend>
            <PhQuestion size="20" weight="fill" class="mr-2 icon" />
          </template>

          <div>
            <VListItemSubtitle class="text-body-2">
              Help Center
            </VListItemSubtitle>
          </div>
        </VListItem>
        <VListItem
          v-if="user"
          color="primary"
          link
          density="compact"
          to="/signout"
          class="py-3"
        >
          <template v-slot:prepend>
            <PhSignOut size="20" weight="fill" class="mr-2 icon" />
          </template>

          <div>
            <VListItemSubtitle class="text-body-2">
              Logout
            </VListItemSubtitle>
          </div>
        </VListItem>
        <VListItem
            v-else
            color="primary"
            link
            density="compact"
            to="/"
            class="py-3"
        >
          <template v-slot:prepend>
            <PhAirplaneLanding size="20" weight="fill" class="mr-2 icon" />
          </template>

          <div>
            <VListItemSubtitle class="text-body-2">
              Back to Landing Page
            </VListItemSubtitle>
          </div>
        </VListItem>
      </VList>
    </VCard>
  </VMenu>

</template>

<style>
.cursor-pointer{
  cursor: pointer;
}

.v-list-item--active{
  background-color: #23668B !important;
  color: #F0FAFF !important;
}

.v-list-item--active .icon {
  color: #F0FAFF !important;
}

.icon{
  color: #8C8C8C !important;
}
</style>