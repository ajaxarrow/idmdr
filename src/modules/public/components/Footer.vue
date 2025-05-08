<script setup lang="ts">

import logo from '../../../assets/images/nomcaarrd.png';

</script>

<template>
  <div class="bg-sb20 px-2 px-lg-10">
    <VContainer fluid>
      <RouterLink to="/" class="text-decoration-none" >
        <div class="d-flex align-center text-wrapper text-logo" >
          <img style="height: 32px;" :src="logo" alt="logo" class="ph-icon"/>
          <div>
            <span style="--i:1">N</span>
            <span style="--i:2">O</span>
            <span style="--i:3">M</span>
            <span style="--i:4">C</span>
            <span style="--i:5">A</span>
            <span style="--i:6">A</span>
            <span style="--i:7">R</span>
            <span style="--i:8">R</span>
            <span style="--i:9">D</span>
          </div>
        </div>
      </RouterLink>
      <VDivider class="my-3"/>
      <VRow class="ma-0" justify="space-between">
        <div>
          <a href="https://web.facebook.com/NOMCAARRD/" target="_blank" class="footer-text">Facebook</a>
          •
          <a href="https://mail.google.com/mail/u/0/?fs=1&to=nomcaarrd@cmu.edu.ph&tf=cm" target="_blank" class="footer-text">Gmail</a>
          •
          <a href="https://www.youtube.com/channel/UCWc3VFaHFLj9LDMjfyWdjEA" target="_blank" class="footer-text">Youtube</a>
        </div>

        <p class="footer-text">@2025 NOMCAARRD <small>R10KM</small></p>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
  .footer-text{
    color: #050E14;
    font-size: 14px;
    text-decoration: none;
  }

  a.footer-text:hover {
    text-decoration: underline;
  }

  .text-logo {
    color: black;
    font-weight: 900 !important;
    font-size: 20px !important;
  }
</style>