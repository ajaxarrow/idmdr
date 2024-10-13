import {ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {createGlobalState} from "@vueuse/core";


const repository = ref<Repository | null | undefined>();
const repositoryItems = ref<Repository[]>([]);
const myRepositories = ref<Repository[]>([]);
const allRepositories = ref<Repository[]>([]);



// const setRepositoryData = async (slug: string, repositoryData: Repository[]) => {
//   repository.value = await fetchRepositoryData(slug);
// }

export const useRepositoryStore = createGlobalState(() => ({

  repository,
  repositoryItems,
  myRepositories,
  allRepositories
}));
