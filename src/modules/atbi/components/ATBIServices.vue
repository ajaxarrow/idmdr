<script setup lang="ts">
// import { PropType } from "vue";
// import { ATBI } from "../../../interfaces/atbi.interface.ts";

// const props = defineProps({
//   atbi: {
//     type: Object as PropType<ATBI>
//   }
// })
</script>

<template>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">Services</p>

      <div class="space-y-4">
        <div class="service-card">
          <h3 class="font-bold text-lg">Service 1 <span class="badge">Free</span></h3>
          <p><strong>How to avail:</strong> Walk-in or register via ATBI portal</p>
          <p><strong>In charge:</strong> Ms. Ana Dela Cruz</p>
        </div>

        <div class="service-card">
          <h3 class="font-bold text-lg">Service 2 <span class="badge">₱100.00</span></h3>
          <p><strong>How to avail:</strong> Fill out request form and pay at the cashier</p>
          <p><strong>In charge:</strong> Mr. Jonel Ramirez</p>
        </div>

        <div class="service-card">
          <h3 class="font-bold text-lg">Service 3 <span class="badge">Free</span></h3>
          <p><strong>How to avail:</strong> Available during scheduled outreach</p>
          <p><strong>In charge:</strong> Dr. Liza Santos</p>
        </div>

        <div class="service-card">
          <h3 class="font-bold text-lg">Service 4 <span class="badge">₱300.00</span></h3>
          <p><strong>How to avail:</strong> Book an appointment via online system</p>
          <p><strong>In charge:</strong> Engr. Noel Cabrera</p>
        </div>

        <div class="service-card">
          <h3 class="font-bold text-lg">Service 5 <span class="badge">Free</span></h3>
          <p><strong>How to avail:</strong> Contact ATBI coordinator</p>
          <p><strong>In charge:</strong> Ms. Bea Mendoza</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-about-heading {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}

.service-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
}

.badge {
  background-color: #38b2ac;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
}
</style>
