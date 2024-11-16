<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {format, parseISO, startOfWeek} from "date-fns";
import NotFound from "../../../../assets/images/404.svg";
import {AccessRequest} from "../../../../interfaces/access-request.interface.ts";
import {useAccessRequestServices} from "../../../repository/services/access-request.services.ts";
import {useUserStore} from "../../../../core/stores/user.store.ts";


const {userData} = useUserStore()
const { fetchAccessRequestsByRequestor } = useAccessRequestServices();
const accessRequests = ref<AccessRequest[]>([]);
const pageLoading = ref(false);
const selectedTimeInterval = ref("day");

const timeIntervals = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
];

// Chart options (line chart)
const chartOptions = computed(() => {
  return {
    chart: {
      type: "line",
      height: 350,
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        color: "rgba(0,0,0,0.2)",
        top: 12,
        left: 4,
        blur: 3,
        opacity: 0.4,
      },
    },
    colors: ["#4782FB", "#47C4F4", "#48f1c4"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 7,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      range: 7 * 24 * 60 * 60 * 1000,
      scrollbar: {
        enabled: true,
        height: 20,
      },
    },
    yaxis: {
      opposite: false,
      labels: {
        show: true,
      },
    },
    markers: {
      size: 4,
      opacity: 0.9,
      colors: ["#4e79ff", "#4e79ff", "#4e79ff"],
      strokeColor: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
  };
});

// Reactive chart data based on selected time interval
const filteredData = computed(() => {
  const groupedData = {
    pending: new Map<string, number>(),
    approved: new Map<string, number>(),
    denied: new Map<string, number>()
  };

  accessRequests.value.forEach(req => {
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
      groupedData.pending.set(key as string, (groupedData.pending.get(key as string) || 0) + 1);
    } else if (req.is_reviewed && req.is_approved) {
      groupedData.approved.set(key as string, (groupedData.approved.get(key as string) || 0) + 1);
    } else if (req.is_reviewed && !req.is_approved) {
      groupedData.denied.set(key as string, (groupedData.denied.get(key as string) || 0) + 1);
    }
  });

  return {
    pending: Array.from(groupedData.pending, ([key, count]) => ({ x: key, y: count })),
    approved: Array.from(groupedData.approved, ([key, count]) => ({ x: key, y: count })),
    denied: Array.from(groupedData.denied, ([key, count]) => ({ x: key, y: count }))
  };
});

// Chart series for the different statuses
const areaChart = computed(() => ({
  series: [
    {
      name: "Pending",
      data: filteredData.value.pending,
    },
    {
      name: "Approved",
      data: filteredData.value.approved,
    },
    {
      name: "Denied",
      data: filteredData.value.denied,
    }
  ],
}));


// Fetch repository data
onMounted(async () => {
  pageLoading.value = true;
  accessRequests.value = await fetchAccessRequestsByRequestor(userData.uid)
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
        <VImg
            :src="NotFound"
            width="300px"
        />
        <p>
          There are no access requests found.</p>
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
            type="line"
            height="350"
            :options="chartOptions"
            :series="areaChart.series"
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
