import {Repository} from "../../../interfaces/repository.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {reactive, ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";


const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
const {isEmptyObject} = useObjectChecker();
const { repository, myRepositories, allRepositories, orgRepositories} = useRepositoryStore();
const {fetchOrganizationData} = useOrganizationServices()
const {fetchUser, fetchOrgMembers} = useOrganizationMembersServices()

const stringToArray = (str: string): string[] =>
  str.length > 0 ? str.split(', ') : [];

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
    adaptors: '',
    image: ""
  })

  const loading = ref(false);

  const errorMessage = reactive({ ...errorMessageInitialState });

  const hasErrorMessages = (errorMessage: any): boolean => {
    // Iterate over each key in the errorMessage object
    return Object.keys(errorMessage).some(key => {
      const value = errorMessage[key];

      // If value is an object, recursively check its properties
      if (typeof value === 'object' && !Array.isArray(value)) {
        return hasErrorMessages(value);
      }

      // Check if the value is a non-empty string (error message present)
      return typeof value === 'string' && value.trim().length > 0;
    });
  };

  const handleDynamicErrorMapping = (data: any, target: any) => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Ensure the nested object exists in the target
        if (!target[key]) {
          target[key] = {}; // Create the nested object if it doesn't exist
        }
        handleDynamicErrorMapping(data[key], target[key]); // Recursive call for nested objects
      } else {
        target[key] = data[key]?.[0] ?? target[key]; // Assign value or keep existing target value if undefined
      }
    });
  };



  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageInitialState });
  };

  const saveRepository = async (repository: Repository, endpoint: string, type: string) => {
    if(repository.com_extra == null) {
      repository.com_extra = {};
    }

    if(repository.geojson == null) {
      repository.geojson = {};
    }
    clearErrorMessage();
    loading.value = true;
    try {
      const res = await (type === 'create' ? server.post : server.put)(
        endpoint,
        repository, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if(type == 'create'){
        await addRepositoryToOrganization(res.data.organization, res.data.uid);
        const orgMembers = await fetchOrgMembers(res.data.organization);

        for (const member of orgMembers) {
          if(member.user.uid != userData.uid) {
            await addUserToRepository(res.data.uid, member.user.uid, member.access_level);
          }
        }

        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Repository created successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/my-repositories';
        }, 3000);


      } else if(type == 'update'){
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Repository updated successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = `/my-repositories/${repository.slug}`;
        }, 3000);
      }
    } catch (e: any){
      console.log(e)
      loading.value = false;
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      clearErrorMessage();
      handleDynamicErrorMapping(e.response?.data, errorMessage);
      return;
    }
  }

  const addUserToRepository = async (repoID: string, userID: string, accessLevel: string) => {
    try {
      await server.post(`/repo-users/${repoID}`, {
        repo: repoID,
        user: userID,
        access_level: accessLevel
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      // console.log(res.data);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      console.log(e.response?.data);
      return;
    }
  }

  const addRepositoryToOrganization = async (orgID: string, repoID: string) => {
    try {
      await server.post(`/org_repo/${orgID}/`, {
        repo: repoID,
        organization: orgID,
        access_level: 'admin'
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      // console.log(res.data);
    } catch (e: any) {
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      console.log(e.response?.data);
      return;
    }
  }

  const addRepository = async (repository: Repository) => {
    await saveRepository(repository, '/repositories/', 'create')
  }

  const updateRepository = async (repository: Repository, id: string) => {
    await saveRepository(repository, `/repositories/${id}`, 'update')
  }

  // const mapRepoData = async (rawData : any): Promise<Repository[]> => {
  //   return rawData.map((repo: any) => {
  //     return {
  //       visibility: repo.visibility,
  //       affiliation: repo.affiliation ? repo.affiliation : "",
  //       commodity: repo.commodity ? repo.commodity : "",
  //       description: repo.description ? repo.description : "",
  //       end_date: repo.end_date ? repo.end_date : "",
  //       funding_agency: repo.funding_agency ? repo.funding_agency : "",
  //       industry: repo.industry ? repo.industry : "",
  //       is_active: repo.is_active,
  //       is_approved: repo.is_approved,
  //       is_deleted: repo.is_deleted,
  //       location: repo.location ? repo.location : "",
  //       organization: repo.organization ? repo.organization : "",
  //       priority_level: repo.priority_level ? repo.priority_level : "",
  //       project_component: repo.project_component ? repo.project_component : "",
  //       rpt: repo.rpt ? repo.rpt : "",
  //       slug: repo.uid ? repo.uid : "",
  //       start_date: repo.start_date ? repo.start_date : "",
  //       tags: repo.tags ? stringToArray(repo.tags) : "",
  //       tech_owner: repo.tech_owner ? repo.tech_owner : "",
  //       technology_category: repo.technology_category ? repo.technology_category : '',
  //       technology_generator: repo.technology_generator ? repo.technology_generator : "",
  //       technology_readiness_level: repo.technology_readiness_level ? repo.technology_readiness_level : '',
  //       technology_status: repo.technology_status ? repo.technology_status : "",
  //       technology_transfer_status: repo.technology_transfer_status ? repo.technology_transfer_status : "",
  //       title: repo.title ? repo.title : "",
  //       transfer_plan: repo.transfer_plan ? repo.transfer_plan : "",
  //       uid: repo.uid ? repo.uid : "",
  //       adaptors: repo.adaptors ? repo.adaptors : "",
  //       geojson: isEmptyObject(repo.geojson) ? {} : JSON.parse(repo.geojson),
  //       com_extra: isEmptyObject(repo.com_extra) ? {} : JSON.parse(repo.com_extra),
  //       image: 'https://dummyimage.com/600x400/023768/fff.png&text=Repo',
  //       created_at: repo.created_at ? repo.created_at : "",
  //       updated_at: repo.updated_at ? repo.updated_at : "",
  //       owner_id: repo.owner_id ? repo.owner_id : "",
  //     }
  //   })
  // }
  const mapRepoData = async (rawData: any): Promise<Repository[]> => {
    return Promise.all(
      rawData.map(async (repo: any) => {
        const orgData = await fetchOrganizationData(repo.organization);
        const ownerData = await fetchUser(repo.owner_id);

        return {
          is_member: false,
          visibility: repo.visibility,
          affiliation: repo.affiliation || "",
          commodity: repo.commodity || "",
          description: repo.description || "",
          end_date: repo.end_date || "",
          funding_agency: repo.funding_agency || "",
          industry: repo.industry || "",
          is_active: repo.is_active,
          is_approved: repo.is_approved,
          is_deleted: repo.is_deleted,
          location: repo.location || "",
          organization: repo.organization || "",
          priority_level: repo.priority_level || "",
          project_component: repo.project_component || "",
          rpt: repo.rpt || "",
          slug: repo.uid || "",
          start_date: repo.start_date || "",
          tags: repo.tags ? stringToArray(repo.tags) : "",
          tech_owner: repo.tech_owner || "",
          technology_category: repo.technology_category || '',
          technology_generator: repo.technology_generator || "",
          technology_readiness_level: repo.technology_readiness_level || '',
          technology_status: repo.technology_status || "",
          technology_transfer_status: repo.technology_transfer_status || "",
          title: repo.title || "",
          transfer_plan: repo.transfer_plan || "",
          uid: repo.uid || "",
          adaptors: repo.adaptors || "",
          geojson: isEmptyObject(repo.geojson) ? {} : repo.geojson,
          com_extra: isEmptyObject(repo.com_extra) ? {} : repo.com_extra,
          commercialization: isEmptyObject(repo.com_extra) ? {} : repo.com_extra,
          image: repo.image ? repo.image : 'https://dummyimage.com/600x400/023768/fff.png&text=Repo',
          created_at: repo.created_at || "",
          updated_at: repo.updated_at || "",
          owner_id: repo.owner_id || "",
          owner: ownerData,
          organizationData: orgData
        };
      })
    );
  };


  const filterRepositoriesBySearchQuery = async (searchQuery: string, repositoryData: Repository[]) : Promise<Repository[]> => {
    if (searchQuery) {
      return repositoryData.filter(repository => repository.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return repositoryData
    }
  };

  const filterRepositoriesbyTags = (repositoryList: Repository[], repositoryData: Repository[], selectedTags: string[]) : Repository[] => {
    if (selectedTags.length > 0) {
      repositoryData = repositoryList.filter(repo =>
        //@ts-ignore
        repo.tags?.some(tag =>
          selectedTags.some(selectedTag =>
            selectedTag.toLowerCase() === tag.toLowerCase()
          )
        )
      );
      return repositoryData;
    } else {
      return repositoryList;
    }
  }

  const fetchRepositoriesByOrganization = async (
    orgID: string,
    isForUser: boolean,
    isPaginated: boolean = false,  // Optional pagination flag
    pageSize?: number               // Optional page size parameter
  ): Promise<Repository[]> => {
    try {
      let endpoint = `/org_repo/${orgID}/?page_size=${5}`;
      if (isPaginated && pageSize) {
        endpoint += `&page=${pageSize}`;
      }

      const res = await server.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });

      const rawData = res.data.results;

      // const filteredData = rawData.filter(async (data: any) => {
      //   if (isForUser) {
      //     // For user-specific filtering
      //     if (data.repo.visibility === 2) {
      //       return data.repo.user === userData.uid;
      //     }
      //     return true;
      //   } else {
      //     if (user.value) {
      //       const userRepo = await fetchRepositoriesByUser(userData.uid);
      //       const isBelong = userRepo.some((repo: Repository) => repo.uid === data.repo.uid);
      //       //this part
      //       return (data.repo.visibility === 1 || data.repo.visibility === 3 || data.repo.visibility === 4) && isBelong;
      //     } else {
      //       return data.repo.visibility === 1;
      //     }
      //   }
      // }).map((data: any) => data.repo);
      //
      // const repositories: Repository[] = await mapRepoData(filteredData);

      const filteredData = await Promise.all(
        rawData.map(async (data: any) => {
          if (isForUser) {
            // For user-specific filtering
            if (data.repo.visibility === 2) {
              return data.repo.user === userData.uid ? data : null;
            }
            return data;
          } else {
            if (user.value) {
              const userRepo = await fetchRepositoriesByUser(userData.uid);
              const isBelong = userRepo.some((repo: Repository) => repo.uid === data.repo.uid);
              //this part
              return (data.repo.visibility === 1 || data.repo.visibility === 3 || data.repo.visibility === 4) && isBelong ? data : null;
            } else {
              return data.repo.visibility === 1 ? data : null;
            }
          }
        })
      );

// Filter out the null values
      const validData = filteredData.filter((data) => data !== null);

// Map the valid data
      const repositories: Repository[] = await mapRepoData(validData.map((data: any) => data.repo));


      const data = [...repositories];
      orgRepositories.value = data;
      return data;

    } catch (e) {
      console.error("Error fetching repositories:", e);
      return [];
    }
  };



  const fetchRepositoriesByUserWithPagination = async(pageNumber: number): Promise<Repository[]> => {
    try{
      loading.value = true;
      const res = await server.get(`/repositories/?user=${userData.uid}&page=${pageNumber}`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const repositories: Repository[] = await mapRepoData(rawData.filter((repo: any) => !repo.is_deleted));

      const data = [...repositories];
      myRepositories.value = data
      loading.value = false
      return data;
    } catch (e) {
      loading.value = false
      return []
    }
  }


  const fetchRepositoriesByUser = async(pageSize: number = 100): Promise<Repository[]> => {
    try{
      const res = await server.get(`/repositories/?page_size=${pageSize}&user=${userData.uid}`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      const repositories: Repository[] = await mapRepoData(rawData.filter((repo: any) => !repo.is_deleted));

      const data = [...repositories];
      myRepositories.value = data
      return data;
    } catch (e) {
      return []
    }
  }

  const fetchRepositoriesWithPagination = async (pageNumber: number): Promise<Repository[]> => {
    try{
      loading.value = true
      let data: Repository[] = []
      if(user.value){
        const publicRepo = await fetchPaginatedRepositories(pageNumber, [1, 4])
        const userDataRepo = await fetchRepositoriesByUserWithPagination(pageNumber);
        let combinedData = [...publicRepo, ...userDataRepo];
        const uniqueData = Array.from(new Set(combinedData.map(repo => repo.slug)))
          .map(slug => combinedData.find(repo => repo.slug === slug));
        // @ts-ignore
        data = uniqueData;
      } else {
        data = await fetchPaginatedRepositories(pageNumber, [1])
      }
      loading.value = false
      return data;
    } catch (e) {
      loading.value = false
      return []
    }
  }


  const fetchPaginatedRepositories = async (pageNumber: number, visibilities: number[]): Promise<Repository[]> => {
    try{
      const promises = visibilities.map(async (visibility) => {
        const res = await server.get(`/repositories/?page=${pageNumber}&page_size=5&visibility=${visibility}`, {
          headers: authorizationHeader
        });
        return await mapRepoData(res.data.results);
      });

      const results = await Promise.all(promises);
      return results.flat();
    } catch (e) {
      return []
    }
  }

  const fetchRepositories = async (pageSize: number = 100): Promise<Repository[]> => {
    try{
      let data: Repository[] = []
      if(user.value){
        const visibilityData = await fetchRepositoriesByVisibility([1, 4], pageSize);
        const userRepo = await fetchRepositoriesByUser(pageSize);
        let combinedData = [...visibilityData.flat(), ...userRepo];
        const uniqueData = Array.from(new Set(combinedData.map(repo => repo.slug)))
          .map(slug => combinedData.find(repo => repo.slug === slug));
        // @ts-ignore
        data = uniqueData ;
      } else {
        const visibilityData = await fetchRepositoriesByVisibility([1]);
        data = visibilityData[0];
      }
      allRepositories.value = data;
      return data;
    } catch (e) {
      return []
    }
  }



  const fetchRepositoriesByVisibility = async (visibilities: number[], pageSize: number = 100): Promise<Repository[][]> => {

    const promises = visibilities.map(async (visibility) => {
      const res = await server.get(`/repositories/?page_size=${pageSize}&visibility=${visibility}`, {
        headers: authorizationHeader
      });
      return mapRepoData(res.data.results);
    });
    return Promise.all(promises);
  };

  const fetchRepositoryData = async (slug: string): Promise<Repository | null> => {
    try{
      const res = await server.get(`/repositories/${slug}`, {
        headers: authorizationHeader
      });
      const rawData = [res.data];
      const repositoryList = await mapRepoData(rawData);
      if (repositoryList) {
        repository.value = repositoryList[0];
        return repositoryList[0];
      } else {
        console.error('no repo')
        return null;
      }
    } catch(e: any){
      console.log(e)
      return null;
    }
  };




  return {
    filterRepositoriesBySearchQuery,
    filterRepositoriesbyTags,
    fetchRepositoriesByOrganization,
    addRepository,
    updateRepository,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
    loading,
    fetchRepositories,
    fetchRepositoryData,
    fetchRepositoriesWithPagination,
    fetchRepositoriesByUser,
    fetchRepositoriesByUserWithPagination,
  }

}