import {ref} from "vue";
import {repositories} from "../../../data/repository.ts";
import {useTagsStore} from "./tags.store.ts";
import {createGlobalState} from "@vueuse/core";
import {Repository} from "../../../interfaces/repository.interface.ts";

const {selectedTags} = useTagsStore();
const repositoryData = ref(repositories);
const searchedRepositories = ref(repositories);
const searchQuery = ref('');

const setRepositoryData = (repositoryItem: Repository[]) => {
  repositoryData.value = repositoryItem
  searchedRepositories.value = repositoryItem
}

const filterRepositoriesBySearchQuery = () => {
  if (searchQuery.value) {
    searchedRepositories.value = repositoryData.value.filter(repository => repository.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
  } else {
    // searchedRepositories.value = repositories;
  }
};

const filterRepositoriesbyTags = (repositoryList: Repository[] = repositories) => {
  if(selectedTags.value.length > 0){
    repositoryData.value = repositoryList.filter(repo => repo.tags?.some(tag => selectedTags.value.includes(tag)));
    searchedRepositories.value = repositoryData.value
  } else {
    repositoryData.value = repositoryList
    searchedRepositories.value = repositoryData.value
  }
}

export const useRepositoriesStore = createGlobalState(() => ({repositoryData, searchedRepositories, searchQuery, filterRepositoriesBySearchQuery, filterRepositoriesbyTags, setRepositoryData}));