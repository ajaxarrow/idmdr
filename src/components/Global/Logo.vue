<script setup lang="ts">
import { PhHardDrives } from "@phosphor-icons/vue";

const handleHover = (isHovered) => {
  const spanElements = document.querySelectorAll(".text-wrapper span");
  spanElements.forEach((span) => {
    isHovered ? span.classList.add("hovered") : span.classList.remove("hovered");
  });
};
</script>

<template>
  <RouterLink to="/" class="text-decoration-none ">
    <div
        class="d-flex align-center text-logo text-wrapper"
        @mouseover="() => handleHover(true)"
        @mouseout="() => handleHover(false)"
    >
      <PhHardDrives size="30" weight="duotone" color="#3291C7" class="ph-icon" />
      <span style="--i:1">I</span>
      <span style="--i:2">D</span>
      <span style="--i:3">M</span>
      <span style="--i:4">D</span>
      <span style="--i:5">R</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.text-logo {
  color: black;
  font-weight: 900 !important;
  font-size: 24px !important;
}

.ph-icon {
  transition: transform 0.5s ease-in-out;
}

.text-logo:hover .ph-icon {
  transform: rotate(360deg);
}

span {

}

span.hovered {
  animation: waveAnim 1s infinite;
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
