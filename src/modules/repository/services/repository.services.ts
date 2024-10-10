import {Repository} from "../../../interfaces/repository.interface.ts";
import {repositories} from "../../../data/repository.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {reactive, ref} from "vue";
import {server} from "../../../plugins/axios.ts";


const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
const {isEmptyObject} = useObjectChecker();


export const useRepositoryServices = () => {
  const errorMessageInitialState = reactive({
    affiliation: "",
    commodity: "",
    description: "",
    end_date: '',
    funding_agency: '',
    industry: '',
    is_active: '',
    is_approved: '',
    is_deleted: '',
    location: "",
    organization: "",
    priority_level: "",
    project_component: "",
    rpt: "",
    slug: "",
    start_date: '',
    tags: "",
    tech_owner: "",
    technology_category: '',
    technology_generator: "",
    technology_readiness_level: '',
    technology_status: "",
    technology_transfer_status: "",
    title: "",
    transfer_plan: "",
    uid: "",
    adopters: ''
  })

  const loading = ref(false);

  const errorMessage = reactive({ ...errorMessageIntialState });

  const handleDynamicErrorMapping = (data: any, target: any, keyMapping: any) => {
    Object.keys(data).forEach(key => {
      const targetKey = keyMapping[key] || key; // Map key if a mapping exists, otherwise use the key as-is
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Ensure the nested object exists in the target
        if (!target[targetKey]) {
          target[targetKey] = {}; // Create the nested object if it doesn't exist
        }
        handleDynamicErrorMapping(data[key], target[targetKey], keyMapping);
      } else {
        target[targetKey] = data[key]?.[0] ?? target[targetKey];
      }
    });
  };

  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageIntialState });
  };

  const saveRepository = async (repository: Repository, endpoint: string, type: string) => {
    clearErrorMessage();
    loading.value = true;
    try {
      const res = await (type === 'create' ? server.post : server.put)(
        endpoint,
        repository, {
          headers: authorizationHeader
        }
      );
      if(type == 'create'){

      }
    } catch (e: any){
      console.log(e)
    }
  }

  const addRepository = async (repository: Repository) => {
    await saveRepository(repository, '/repositories', 'create')
  }

  const updateRepository = async (repository: Repository, id: string) => {
    await saveRepository(repository, `/repositories/${id}`, 'update')
  }

  const mapRepoData = async (rawData : any): Promise<Repository[]> => {
    return rawData.map((repo: any) => {
      return {
        visibility: repo.visibility,
        affiliation: repo.affiliation ? repo.affiliation : "",
        commodity: repo.commodity ? repo.commodity : "",
        description: repo.description ? repo.description : "",
        end_date: repo.end_date ? repo.end_date : "",
        funding_agency: repo.funding_agency ? repo.funding_agency : "",
        industry: repo.industry ? repo.industry : "",
        is_active: repo.is_active,
        is_approved: repo.is_approved,
        is_deleted: repo.is_deleted,
        location: repo.location ? repo.location : "",
        organization: repo.organization ? repo.organization : "",
        priority_level: repo.priority_level ? repo.priority_level : "",
        project_component: repo.project_component ? repo.project_component : "",
        rpt: repo.rpt ? repo.rpt : "",
        slug: repo.slug ? repo.slug : "",
        start_date: repo.start_date ? repo.start_date : "",
        tags: repo.tags ? repo.tags : "",
        tech_owner: repo.tech_owner ? repo.tech_owner : "",
        technology_category: repo.technology_category ? repo.technology_category : '',
        technology_generator: repo.technology_generator ? repo.technology_generator : "",
        technology_readiness_level: repo.technology_readiness_level ? repo.technology_readiness_level : '',
        technology_status: repo.technology_status ? repo.technology_status : "",
        technology_transfer_status: repo.technology_transfer_status ? repo.technology_transfer_status : "",
        title: repo.title ? repo.title : "",
        transfer_plan: repo.transfer_plan ? repo.transfer_plan : "",
        uid: repo.uid ? repo.uid : "",
        adopters: repo.adopters ? repo.adopters : "",
        geojson: isEmptyObject(repo.geojson) ? {} : JSON.parse(repo.geojson),
      }
    })
  }


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