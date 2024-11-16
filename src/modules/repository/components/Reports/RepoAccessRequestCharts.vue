<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouting } from "../../../../core/composables/useRouting";
import { format, parseISO, startOfWeek } from "date-fns";
import NotFound from "../../../../assets/images/404.svg";
import { AccessRequest } from "../../../../interfaces/access-request.interface.ts";
import { useAccessRequestServices } from "../../services/access-request.services.ts";

const { route } = useRouting();
const { fetchAccessRequestsByRepository } = useAccessRequestServices();
const accessRequests = ref<AccessRequest[]>([]);
const pageLoading = ref(false);
const selectedTimeInterval = ref("day");

const timeIntervals = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

// Filter data into Pending, Approved, and Denied based on criteria
const filteredData = computed(() => {
  const pending = new Map<string, number>();
  const approved = new Map<string, number>();
  const denied = new Map<string, number>();

  accessRequests.value.forEach((req) => {
    const date = parseISO(req.created_at as string);
    let key;

    switch (selectedTimeInterval.value) {
      case "day":
        key = format(date, "yyyy-MM-dd");
        break;
      case "week":
        key = startOfWeek(date, { weekStartsOn: 1 }).getTime();
        break;
      case "month":
        key = format(date, "yyyy-MM");
        break;
      case "year":
        key = date.getFullYear().toString();
        break;
    }

    if (!req.is_reviewed) {
      pending.set(key, (pending.get(key) || 0) + 1);
    } else if (req.is_approved) {
      approved.set(key, (approved.get(key) || 0) + 1);
    } else {
      denied.set(key, (denied.get(key) || 0) + 1);
    }
  });

  return {
    pending: Array.from(pending, ([x, y]) => ({ x, y })),
    approved: Array.from(approved, ([x, y]) => ({ x, y })),
    denied: Array.from(denied, ([x, y]) => ({ x, y })),
  };
});

// Chart options for area chart
const chartOptions = computed(() => ({
  chart: {
    type: "area",
    height: 350,
    fontFamily: `inherit`,
    foreColor: "#adb0bb",
    zoom: { enabled: true },
    toolbar: { show: false },
  },
  colors: ["#4782FB", "#47C4F4", "#FF5733"],
  dataLabels: { enabled: false },
  stroke: { width: 3, curve: "smooth" },
  xaxis: { type: "datetime" },
  yaxis: { opposite: false, labels: { show: true } },
  legend: { show: true, position: "bottom" },
  grid: { show: false },
  tooltip: { theme: "dark" },
}));

// Reactive chart data based on the filtered data
const gradientChart = computed(() => ({
  series: [
    { name: "Pending", data: filteredData.value.pending },
    { name: "Approved", data: filteredData.value.approved },
    { name: "Denied", data: filteredData.value.denied },
  ],
}));

// Fetch repository data
onMounted(async () => {
  pageLoading.value = true;
  accessRequests.value = await fetchAccessRequestsByRepository(<string>route.params.slug);
  pageLoading.value = false;
});
</script>

<template>
  <div class="charts-container">
    <div v-if="pageLoading" class="loading-state-container" style="height: 350px;">
      <VProgressCircular indeterminate color="#23668b"></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="accessRequests.length === 0" class="d-flex justify-center align-center flex-column pa-5 ga-2" style="height: 350px;">
        <VImg :src="NotFound" width="300px" />
        <p>There are no access requests found.</p>
      </div>
      <div v-else>
        <VAutocomplete
            v-model="selectedTimeInterval"
            :items="timeIntervals"
            :item-title="interval => interval.label"
            :item-value="interval => interval.value"
            label="Group by"
        ></VAutocomplete>

        <apexchart
            type="area"
            height="350"
            :options="chartOptions"
            :series="gradientChart.series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-container {
  border: 1px solid #e4e4e4;
  border-radius: 20px;
  overflow: hidden;
}
</style>
