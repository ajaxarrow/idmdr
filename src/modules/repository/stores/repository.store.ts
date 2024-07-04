import {ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {createGlobalState} from "@vueuse/core";
import {useRepositoryServices} from "../services/repository.services.ts";

const repository = ref<Repository | null | undefined>();
const repositoryItems = ref<Repository[]>([]);
const {fetchRepositoryData} = useRepositoryServices();

const setRepositoryData = (slug: string) => {
  repository.value = fetchRepositoryData(slug);
}



export const useRepositoryStore = createGlobalState(() => ({setRepositoryData, repository, repositoryItems}));