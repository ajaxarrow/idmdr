import {Repository} from "../../../interfaces/repository.interface.ts";
import {repositories} from "../../../data/repository.ts";

export const useRepositoryServices = () => {


  const fetchRepositories = async () =>  {
    return repositories
  }
  const filterRepositoriesBySearchQuery = async (searchQuery: string, repositoryData: Repository[]) : Promise<Repository[]> => {
    if (searchQuery) {
      return repositoryData.filter(repository => repository.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return repositories
    }
  };

  const filterRepositoriesbyTags = (repositoryList: Repository[], repositoryData: Repository[], selectedTags: string[]) : Repository[] => {
    if(selectedTags.length > 0){
      repositoryData = repositoryList.filter(repo => repo.tags?.some(tag => selectedTags.includes(tag)));
      return repositoryData
    } else {
      repositoryData = repositoryList
      return repositoryData
    }
  }

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


  return {
    fetchRepositories,
    filterRepositoriesBySearchQuery,
    filterRepositoriesbyTags,
    fetchRepositoryData,
    fetchRepositoriesByOrganization
  }

}