<script setup lang="ts">
import {PhQuestion} from "@phosphor-icons/vue";
import Logo from "../Logo.vue";
import {navLinks} from "../../../data/navlinks.ts";
</script>

<template>
  <VSheet class="sidebar d-flex flex-column justify-start ma-4" rounded="xl">
    <VRow justify="center" class="mt-5 mb-4">
      <Logo :useAltDesign="true"/>
    </VRow>
    <VDivider/>
    <div class="mt-2">
      <VList>
        <VListItem
            v-for="navLink in navLinks"
            :to="navLink.link"
            link
            variant="plain"
            class="nav-item navigation-item"
        >
          <div class="d-flex flex-column justify-center align-center">
            <component :is="navLink.icon" size="24" class="icon" />
            {{navLink.name}}
          </div>
        </VListItem>
      </VList>
    </div>
    <VSpacer/>
    <VDivider/>
    <div class="">
      <VList class="bottom-nav">
        <VListItem
            to="/help"
            link
            class="nav-item navigation-item"
        >
          <div class="d-flex flex-column align-center">
            <PhQuestion size="24" class="icon" />
            Help Center
          </div>
        </VListItem>
      </VList>
    </div>
  </VSheet>
</template>

<style scoped>
.v-row{
  flex: unset;
}
.sidebar{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 80px !important;
  box-shadow: 0px 0px 7px 0px #5d6e87;
  height: 95vh;
}

.nav-item{
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  height: 70px;
}
.bottom-nav{
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
}
.v-list-item--active{
  background-color: #F0F5F9 !important;
  border-right: 3px solid #3291C7;
}

:deep(.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line){
  padding: unset;
}

.v-list-item--variant-plain {
  opacity: 1;
}


.icon{
  color: #191919 !important;
}
</style>