import {ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {createGlobalState} from "@vueuse/core";


const repository = ref<Repository | null | undefined>();
const repositoryItems = ref<Repository[]>([]);
const myRepositories = ref<Repository[]>([]);
const allRepositories = ref<Repository[]>([]);
const orgRepositories = ref<Repository[]>([]);
const mapRepositories = ref<Repository[]>([]);
const selectedRepository = ref<Repository | null>(null);
const searchedMapRepositories = ref<Repository[]>([]);

const selectRepository = (repository: Repository) => {
    if(selectedRepository.value === repository) {
        removeSelectedRepository()
        return;
    }
    selectedRepository.value = repository;
}

const filterRepositories = (title: string) => {
    if(title) {
        searchedMapRepositories.value = mapRepositories.value.filter(repository => repository.title.toLowerCase().includes(title.toLowerCase().trim()));
    } else {
        searchedMapRepositories.value = mapRepositories.value
    }
}

const removeSelectedRepository = () => {
    selectedRepository.value = null;
}

const fetchRepositoryData = (slug: string, repositoryData: Repository[]): Repository | null => {
    const repository = repositoryData.find(repo => repo.slug === slug);
    if (repository) {
        return repository;
    } else {
        console.error('no repo')
        return null;
    }
}

const setRepositoryData = (slug: string, repositoryData: Repository[]) => {
    repository.value = fetchRepositoryData(slug, repositoryData);
}


export const useRepositoryStore = createGlobalState(() => ({
  repository,
  repositoryItems,
  myRepositories,
  allRepositories,
  orgRepositories,
  mapRepositories,
  selectedRepository,
  searchedMapRepositories,
    selectRepository,
    filterRepositories,
    removeSelectedRepository,
    setRepositoryData,
    fetchRepositoryData
}));
