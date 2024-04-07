<template>
  <div class="relative-container circle-quarter">
    <p class="header-title">Production</p>
  </div>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  right: -49px;
  top: -60px;
  width: 116px;
  height: 107px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

.header-title{
  font-size: 24px;
  font-weight: 900;
}
</style>