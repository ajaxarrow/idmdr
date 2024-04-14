import {ref} from "vue";
import {Repository} from "../interfaces/repository.interface.ts";
import {repositories} from "../data/repository.ts";
import {createGlobalState} from "@vueuse/core";

const repository = ref<Repository | null | undefined>();
const repositoryItems = ref<Repository[]>([]);

const fetchRepositoryData = (slug: string): Repository | null => {
  const repository = repositories.find(repo => repo.slug === slug);
  if (repository) {
    return repository;
  } else {
    console.error('no repo')
    return null;
  }
};

const fetchRepositoriesByOrganization = (slug: string): Repository[]  => {
  const repositoryList = repositories.filter(repo => repo.organization === slug);
  if (repositoryList) {
    return repositoryList;
  } else {
    console.error('no repo')
    return [];
  }
}

const setRepositoryData = (slug: string) => {
  repository.value = fetchRepositoryData(slug);
}

const setRepositoryItems = (slug: string) => {
  repositoryItems.value = fetchRepositoriesByOrganization(slug);
}

export const useRepositoryStore = createGlobalState(() => ({setRepositoryData, repository, setRepositoryItems, repositoryItems}));