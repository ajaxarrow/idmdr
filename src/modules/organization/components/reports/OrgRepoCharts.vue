<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Repository } from "../../../../interfaces/repository.interface";
import { useRepositoryServices } from "../../../repository/services/repository.services";
import { useRouting } from "../../../../core/composables/useRouting";
import {format, parseISO, startOfWeek} from "date-fns";
import NotFound from "../../../../assets/images/404.svg";

const { route } = useRouting();
const { fetchRepositoriesByOrganization } = useRepositoryServices();
const orgRepositories = ref<Repository[]>([]);
const pageLoading = ref(false);
const selectedTimeInterval = ref("day");

const timeIntervals = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
];

// Chart options (line chart)
const chartOptions = computed(() => ({
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
  stroke: {
    width: 7,
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      gradientToColors: ["#0b70fb"],
      shadeIntensity: 1,
      type: "horizontal",
      opacityFrom: 1,
      opacityTo: 0.9,
      stops: [0, 100, 100, 100],
    },
  },
  markers: {
    size: 4,
    opacity: 0.9,
    colors: ["#4e79ff"],
    strokeColor: "#fff",
    strokeWidth: 2,
    hover: { size: 7 },
  },
  yaxis: { min: 0 },
  grid: { show: false },
  tooltip: { theme: "light" },
}));

// Reactive chart data based on selected time interval
const filteredData = computed(() => {
  const groupedData = new Map<string, number>();

  orgRepositories.value.forEach(repo => {
    const date = parseISO(repo.created_at as string);
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

    groupedData.set(key as string, (groupedData.get(key as string) || 0) + 1);
  });

  return Array.from(groupedData, ([key, count]) => ({
    x: key,
    y: count,
  }));
});

const gradientChart = computed(() => ({
  series: [
    {
      name: "Repositories Created",
      data: filteredData.value,
    },
  ],
}));

// Fetch repository data
onMounted(async () => {
  pageLoading.value = true;
  orgRepositories.value = await fetchRepositoriesByOrganization(
      route.params.slug as string,
      true,
      100
  );
  pageLoading.value = false;
});

</script>

<template>
  <div class="charts-container">
    <div v-if="pageLoading" class="loading-state-container" style="height: 350px;">
      <VProgressCircular indeterminate color="#23668b"></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="orgRepositories.length === 0" class="d-flex justify-center align-center flex-column pa-5 ga-2" style="height: 350px;">
        <VImg
            :src="NotFound"
            width="300px"
        />
        <p>
          There are no repositories found.
          <RouterLink class="text-decoration-none add-link" :to="{name: 'new-organization'}">
            Try adding some!
        </RouterLink></p>
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
