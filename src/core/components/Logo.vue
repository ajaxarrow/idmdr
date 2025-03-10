<script setup lang="ts">
// import { PhHardDrives } from "@phosphor-icons/vue";
import logo from '../../assets/images/nomcaarrd.png';

const props = defineProps({
  useAltDesign: {
    type: Boolean,
    default: false,
  },
});

const handleHover = (isHovered: boolean) => {
  const spanElements = document.querySelectorAll("span");
  spanElements.forEach((span) => {
    isHovered ? span.classList.add("hovered") : span.classList.remove("hovered");
  });
};
</script>

<template>
  <RouterLink to="/linnks" class="text-decoration-none" :class="props.useAltDesign ? 'text-logo-alt-design' : 'text-logo'">
    <div class="d-flex align-center text-wrapper" :class="{ 'flex-column': props.useAltDesign }" @mouseover="() => handleHover(true)" @mouseout="() => handleHover(false)">
<!--    <PhHardDrives :size="props.useAltDesign ? 32 : 24" weight="duotone" color="#3291C7" class="ph-icon" />-->
    <img :style="{height: props.useAltDesign ? '32px' : '24px'}" :src="logo" alt="logo" class="ph-icon"/>
      <template v-if="props.useAltDesign">
        <div>
<!--          <span style="&#45;&#45;i:1">I</span>-->
<!--          <span style="&#45;&#45;i:2">D</span>-->
<!--          <span style="&#45;&#45;i:3">M</span>-->
<!--          <span style="&#45;&#45;i:4">D</span>-->
<!--          <span style="&#45;&#45;i:5">R</span>-->
          <span style="--i:1">L</span>
          <span style="--i:2">I</span>
          <span style="--i:3">N</span>
          <span style="--i:4">N</span>
          <span style="--i:5">K</span>
          <span style="--i:6">S</span>
        </div>
      </template>
      <template v-else>
<!--        <span style="&#45;&#45;i:1">I</span>-->
<!--        <span style="&#45;&#45;i:2">D</span>-->
<!--        <span style="&#45;&#45;i:3">M</span>-->
<!--        <span style="&#45;&#45;i:4">D</span>-->
<!--        <span style="&#45;&#45;i:5">R</span>-->
        <span style="--i:1">L</span>
        <span style="--i:2">I</span>
        <span style="--i:3">N</span>
        <span style="--i:4">N</span>
        <span style="--i:5">K</span>
        <span style="--i:6">S</span>
      </template>
    </div>
  </RouterLink>
</template>

<style scoped>
.text-logo, .text-logo-alt-design {
  color: black;
  font-weight: 900 !important;
  font-size: 20px !important;
}

.text-logo-alt-design {
  font-size: 12px !important;
}

.ph-icon {
  transition: transform 0.5s ease-in-out;
}

.ph-icon:hover {
  transform: rotate(360deg);
}

.ph-icon:not(:hover) {
  transition: none;
}

span.hovered {
  animation: waveAnim 1s ease-in-out;
  animation-delay: calc(.1s * var(--i));
}

@keyframes waveAnim {
  0%, 40%, 100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-20px);
  }
}
</style>
