<script setup lang="ts">
import { PhHardDrives } from "@phosphor-icons/vue";

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
  <RouterLink to="/" class="text-decoration-none" :class="props.useAltDesign ? 'text-logo-alt-design' : 'text-logo'">
    <div class="d-flex align-center text-wrapper" :class="{ 'flex-column': props.useAltDesign }" @mouseover="() => handleHover(true)" @mouseout="() => handleHover(false)">
    <PhHardDrives :size="props.useAltDesign ? 32 : 30" weight="duotone" color="#3291C7" class="ph-icon" />
      <template v-if="props.useAltDesign">
        <div>
          <span style="--i:1">I</span>
          <span style="--i:2">D</span>
          <span style="--i:3">M</span>
          <span style="--i:4">D</span>
          <span style="--i:5">R</span>
        </div>
      </template>
      <template v-else>
        <span style="--i:1">I</span>
        <span style="--i:2">D</span>
        <span style="--i:3">M</span>
        <span style="--i:4">D</span>
        <span style="--i:5">R</span>
      </template>
    </div>
  </RouterLink>
</template>

<style scoped>
.text-logo, .text-logo-alt-design {
  color: black;
  font-weight: 900 !important;
  font-size: 24px !important;
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
