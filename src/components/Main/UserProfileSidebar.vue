<script setup lang="ts">
import {profileNavlinks} from "../../data/profileNavlinks.ts";
import Logo from "../Global/Logo.vue";
import {PhQuestion, PhX} from "@phosphor-icons/vue";
import {useToggleSidebar} from "../../composables/useToggleSidebar.ts";

const {showProfileSidebar, toggleProfileSidebar} = useToggleSidebar();
</script>

<template>
  <VSlideYTransition v-show="showProfileSidebar" style="z-index: 1000">
    <VContainer>
      <VSheet class="d-flex flex-column justify-start sidebar-mobile">
        <VRow justify="space-between" align="center" class="mt-5 mb-4 px-10">
          <Logo/>
          <PhX size="24" weight="bold" class="cursor-pointer" @click="toggleProfileSidebar"/>
        </VRow>
        <VDivider/>
        <div class="px-6 pt-2">
          <VList>
            <VListItem
                v-for="navLink in profileNavlinks"
                :to="navLink.link"
                link
                class="my-2 nav-border nav-item"
            >
              <div class="d-flex align-center">
                <component :is="navLink.icon" size="20" weight="fill" class="mr-2 icon" />
                {{navLink.name}}
              </div>
            </VListItem>
          </VList>
        </div>
        <VSpacer/>
        <VDivider/>
        <div class="px-6">
          <VList>
            <VListItem
                to="/help"
                link
                class="my-1 nav-border nav-item"
            >
              <div class="d-flex align-center">
                <PhQuestion size="20" weight="fill" class="mr-2 icon" />
                Help Center
              </div>
            </VListItem>
          </VList>
        </div>
      </VSheet>
    </VContainer>
  </VSlideYTransition>
</template>

<style scoped>

.v-row{
  flex: unset;
}
.sidebar-mobile{
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 30;
  width: 100vw;
}

.nav-border{
  border-radius: 15px;
  border: 2px solid #EBF4F9;
}

.nav-item{
  font-size: 14px;
  font-weight: 500;
}

.v-list-item--active{
  background-color: #23668B;
  color: #F0FAFF;
}

.v-list-item--active .icon {
  color: #F0FAFF !important;
}

.icon{
  color: #8C8C8C !important;
}


</style>