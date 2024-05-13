import {ref} from "vue";
import {repositories} from "../data/repository.ts";
import {useTagsStore} from "./tagsStore.ts";
import {createGlobalState} from "@vueuse/core";

const {selectedTags} = useTagsStore();
const repositoryData = ref(repositories);
const searchedRepositories = ref(repositories);
const searchQuery = ref('');

const filterRepositoriesBySearchQuery = () => {
  if (searchQuery.value) {
    searchedRepositories.value = repositoryData.value.filter(repository => repository.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
  } else {
    // searchedRepositories.value = repositories;
  }
};

const filterRepositoriesbyTags = () => {
  if(selectedTags.value.length > 0){
    repositoryData.value = repositories.filter(repo => repo.tags?.some(tag => selectedTags.value.includes(tag)));
    searchedRepositories.value = repositoryData.value
  } else {
    repositoryData.value = repositories
    searchedRepositories.value = repositoryData.value
  }
}

export const useRepositoriesStore = createGlobalState(() => ({repositoryData, searchedRepositories, searchQuery, filterRepositoriesBySearchQuery, filterRepositoriesbyTags}));