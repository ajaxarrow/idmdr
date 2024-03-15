import {ref} from "vue";
import {Repository} from "../interfaces/repository.interface.ts";
import {repositories} from "../data/repository.ts";
import {createGlobalState} from "@vueuse/core";

const repository = ref<Repository | null>();

const fetchRepositoryData = (slug: string): Repository | null => {
  const repository = repositories.find(repo => repo.slug === slug);
  if (repository) {
    return repository;
  } else {
    console.error('no repo')
    return null;
  }
};

const setRepositoryData = (slug: string) => {
  repository.value = fetchRepositoryData(slug);
}

export const useRepositoryStore = createGlobalState(() => ({setRepositoryData, repository}));