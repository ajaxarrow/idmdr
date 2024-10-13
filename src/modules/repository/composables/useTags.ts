import { ref } from "vue";
import { commodities, industries, technologyCategories } from "../../../data/repository.inventory.fields.ts";

export const useTags = () => {
  const selectedTags = ref<string[]>([]);
  const tags = ref([
    "Agricultural Analytics",
    "Agricultural Data",
    "Agricultural Technology",
    "Agricultural Tourism Trends",
    "Agriculture",
    "Agrifishery",
    "Biodiversity Enhancement",
    "Bukidnon",
    "Carbon Capture",
    "Climate Solutions",
    "Community Empowerment",
    "Conservation Efforts",
    "Crop Health Monitoring",
    "Crop Management",
    "Crop Optimization",
    "Crops",
    "Data-Driven Agriculture",
    "Data-Driven Practices",
    "Disaster Response Planning",
    "Eco-friendly Practices",
    "Ecological Monitoring",
    "Economic Benefits",
    "Ecosystem Diversity",
    "Emergency Management",
    "Environmental Research",
    "Farming",
    "Forest Fire Prevention",
    "Forestry",
    "Geospatial Mapping",
    "Global",
    "Global Fauna Records",
    "Incident Reporting",
    "Mapping Strategies",
    "Plantation",
    "Precision Agriculture",
    "Precision Farming",
    "Rural Development Insights",
    "Smart Farming",
    "Socioeconomic Impact",
    "Soil Health",
    "Sustainable Agriculture",
    "Sustainable Farming",
    "Tourism-Driven Economy",
    "Wildfire Analysis",
    "Wildlife Preservation",
    "Yield Prediction Models",
    ...commodities,
    ...industries,
    ...technologyCategories,
  ]);

  const fetchTags = () => {
    removeDuplicateTags(); // Call the deduplication function
    sortTags(); // Sort the deduplicated tags
  }

  const removeDuplicateTags = () => {
    // Using Set to remove duplicates
    tags.value = [...new Set(tags.value)];
  };

  const sortTags = () => {
    tags.value.sort((a, b) => {
      const titleA = a.toLowerCase();
      const titleB = b.toLowerCase();
      if (titleA < titleB) {
        return -1;
      } else if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
  };

  return { selectedTags, tags, fetchTags };
};
