<script setup lang="ts">
import { ref, onMounted } from 'vue';
import logo from '../../assets/images/nomcaarrd.png';

const loaded = ref(false);
const dots = ref(['', '.', '..', '...']);
const currentDot = ref(0);
const rotation = ref(0);
const scale = ref(0.8);
const pulse = ref(1);

onMounted(() => {
  // Simulate loading time
  setTimeout(() => {
    loaded.value = true;
  }, 1000);

  // Animate dots
  setInterval(() => {
    currentDot.value = (currentDot.value + 1) % dots.value.length;
  }, 400);

  // Rotate logo
  const rotateInterval = setInterval(() => {
    rotation.value = (rotation.value + 1) % 360;

    // Pulse effect
    scale.value = 0.8 + Math.sin(rotation.value * Math.PI / 180) * 0.1;

    if (loaded.value) {
      clearInterval(rotateInterval);
      rotation.value = 0;
      scale.value = 1;
    }
  }, 16);
});
</script>

<template>
  <div class="loading-container">
    <div v-if="!loaded" class="loading-animation">
      <div class="logo-container">
        <img
            :src="logo"
            alt="NOMCAARRD Logo"
            class="logo"
        />
        <div class="orbit"></div>
      </div>
      <div class="loading-text">
        Loading{{ dots[currentDot] }}
      </div>
    </div>
    <div v-else class="content-loaded">
      <!-- Your content goes here -->
      <img :src="logo" alt="NOMCAARRD Logo" class="logo-static" />
      <div class="welcome-text">Welcome to NOMCAARRD</div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 80px;
  height: auto;
  position: relative;
  z-index: 2;
  transition: transform 0.2s ease-out;
}

.orbit {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid #0078c8;
  border-left: 2px solid #0078c8;
  animation: spin 1.5s linear infinite;
}

.orbit::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  width: 12px;
  height: 12px;
  background-color: #0078c8;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 120, 200, 0.8);
}

.loading-text {
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  letter-spacing: 1px;
  min-width: 100px;
  text-align: center;
}

.content-loaded {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-in;
}

.logo-static {
  width: 120px;
  height: auto;
  animation: popIn 0.5s ease-out;
}

.welcome-text {
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  animation: slideUp 0.7s ease-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>