import {Repository} from "../../../interfaces/repository.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {reactive, ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";
import {useRepositoryAttachmentServices} from "./repository-attachments.services.ts";
import {useSectorServices} from "../../sector/services/sector.services.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {useDateHelper} from "../../../core/composables/useDateHelper.ts";
import {useCustomUsersServices} from "./custom-users.services.ts";
import {usePageLoadingStore} from "../../../core/stores/loading.store.ts";


const {isPageLoading} = usePageLoadingStore()
const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
const {isEmptyObject} = useObjectChecker();
const { repository, myRepositories, allRepositories, orgRepositories} = useRepositoryStore();
const {fetchOrgMembers} = useOrganizationMembersServices()
const {mapCustomUsers} = useCustomUsersServices()
const {fetchAttachmentsByRepository, addAttachment, updateAttachment} = useRepositoryAttachmentServices()
const {addSector} = useSectorServices()
const {stringToArray} = useStringArrayHelper()
const {compareDateStrings} = useDateHelper()

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
    image: "",
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

  const saveRepository = async (repository: Repository, endpoint: string, type: string, id: string = '') => {
    if(repository.title.trim() == '' || !repository.title || repository.title == ''){
      errorMessage.title = 'Title should not be empty'
      return;
    } else {
      errorMessage.title = '';
    }
    if(repository.description.trim() == '' || !repository.description || repository.description == ''){
      errorMessage.description = 'Description should not be empty'
      return;
    } else {
      errorMessage.description = '';
    }
    if(!repository.tags){
      errorMessage.tags = 'Tags should not be empty'
      return;
    } else {
      errorMessage.tags = '';
    }
    if(repository.start_date && repository.end_date) {
      if(repository.start_date > repository.end_date) {
        errorMessage.start_date = 'Start date cannot be later than end date';
        return;
      } else {
        errorMessage.start_date = '';
      }

      if(repository.end_date < repository.start_date) {
        errorMessage.end_date = 'End date cannot be earlier than start date';
        return;
      } else {
        errorMessage.end_date = '';
      }
    }

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
        // @ts-ignore
        if(repository.files?.length > 0  && repository.files) {
          for (let i = 0; i < repository.files.length; i++) {
            repository.files[i].repository! = res.data.uid
            await addAttachment(repository.files[i]);
          }
        }

        await addRepositoryToOrganization(res.data.organization, res.data.uid);
        const orgMembers = await fetchOrgMembers(res.data.organization);

        if(repository.visibility != 2){
          for (const member of orgMembers) {
            if(member.user.uid != userData.uid && !member.is_deleted) {
              await addUserToRepository(res.data.uid, member.user.uid as string, member.access_level);
            }
          }
        }

        if(!isEmptyObject(repository.geojson)){
          await addSector({
            address: repository.location || 'N/A',
            description: repository.description,
            name: repository.title,
            parent: 'Repository',
            parent_id: res.data.uid,
            geojson: repository.geojson,
            visibility: repository.visibility,
            image: repository.image,
            tags: repository.tags,
            owner_id: userData.uid
          }, false)
        }


        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Repository created successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/repositories';
        }, 1000);

      } else if(type == 'update'){
        // @ts-ignore
        if(repository.files?.length > 0  && repository.files) {
          for (let i = 0; i < repository.files.length; i++) {
            repository.files[i].repository! = res.data.uid
            if(repository.files[i].type == 'create') {
              await addAttachment(repository.files[i]);
            } else {
              if(repository.files[i].isDescriptionUpdated || repository.files[i].isFileUpdated) {
                await updateAttachment(repository.files[i]);
              }
            }
          }
        }
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Repository updated successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = `/repositories/${id}`;
        }, 1000);
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
    await saveRepository(repository, `/repositories/${id}`, 'update', id)
  }

  const changeRepositoryVisibility = async (id: string, visibility: number) => {
    try {
      await server.patch(`/repositories/${id}`, {
        visibility: visibility
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      // console.log(res.data);
    } catch (e: any) {
      console.log(e.response?.data);
      return;
    }
  }

  const manageRepositoryStatus = async (id: string, isActive: boolean) => {
    try {
      if (userData.is_superuser) {
        await server.patch(`/repositories/${id}`, {
          is_approved: true,
          is_active: isActive
        }, {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`
          }
        });
      } else {
        await server.patch(`/repositories/${id}`, {
          is_active: isActive
        }, {
          headers: {
            'Authorization': `Bearer ${userData.accessToken}`
          }
        });
      }
    } catch (e: any) {
      console.log(e.response?.data);
      return;
    }
  }

  const manageRepositoryAdminStatus = async (id: string, isEnabled: boolean) => {
    try {
      await server.patch(`/repositories/${id}`, {
        is_approved: isEnabled
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
    } catch (e: any) {
      console.log(e.response?.data);
      return;
    }
  }

  const mapRepoFields = async (repo: any, type: string, isAssociatedDataIncluded: boolean): Promise<Repository> => {
    const baseData = {
      is_member: false,
      visibility: repo.visibility,
      affiliation: repo.affiliation ? stringToArray(repo.affiliation) : "",
      commodity: repo.commodity ? stringToArray(repo.commodity) : "",
      description: repo.description || "",
      end_date: repo.end_date || "N/A",
      funding_agency: repo.funding_agency ? stringToArray(repo.funding_agency) : "",
      industry: repo.industry ? stringToArray(repo.industry) : "",
      is_active: repo.is_active,
      is_approved: repo.is_approved,
      type: repo.type || "",
      is_deleted: repo.is_deleted,
      location: repo.location || "",
      organization: repo.organization || "",
      priority_level: repo.priority_level || "",
      project_component: repo.project_component || "",
      rpt: repo.rpt ? stringToArray(repo.rpt) : "",
      slug: repo.uid || "",
      start_date: repo.start_date || "N/A",
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
      adaptors: repo.adaptors ? stringToArray(repo.adaptors) : "",
      geojson: isEmptyObject(repo.geojson) ? {} : repo.geojson,
      com_extra: isEmptyObject(repo.com_extra) ? {} : repo.com_extra,
      commercialization: isEmptyObject(repo.com_extra) ? {} : repo.com_extra,
      image: repo.image || 'https://dummyimage.com/600x400/023768/fff.png&text=Repo',
      created_at: repo.created_at || "",
      updated_at: repo.updated_at || "",
      owner_id: repo.owner_id || "",
      owner_data: repo.owner_data || {},
      org_data: repo.org_data || {},
      author: repo.author || "",
      lead: repo.lead,
      proj_type: repo.proj_type || "",
      additional_info: repo.additional_info || "",
      status: repo.status || "",
      abh: repo.abh || "",
      atbi: repo.atbi || "",
      is_patentable: repo.is_patentable || false,
    };

    if (!isAssociatedDataIncluded) return baseData;

    const [authors, techOwners, techGenerators, lead, attachments] = await Promise.all([
      mapCustomUsers(JSON.parse(repo.author).data),
      mapCustomUsers(JSON.parse(repo.tech_owner).data),
      mapCustomUsers(JSON.parse(repo.technology_generator).data),
      mapCustomUsers(isEmptyObject(repo.lead) ? [] : [JSON.parse(repo.lead)]),
      fetchAttachmentsByRepository(repo.uid, type)
    ]);

    return {
      ...baseData,
      techOwnerData: techOwners,
      techGeneratorData: techGenerators,
      authorsData: authors,
      leadData: lead[0] || {},
      files: attachments
    };
  };

  const mapRepoData = async (
      rawData: any[],
      type: string = 'create',
      isAssociatedDataIncluded: boolean = false
  ): Promise<Repository[]> => {
    return Promise.all(rawData.map(repo => mapRepoFields(repo, type, isAssociatedDataIncluded)));
  };



  const filterRepositoriesBySearchQuery = async (searchQuery: string, repositoryData: Repository[]) : Promise<Repository[]> => {
    if (searchQuery) {
      return repositoryData.filter(repository => repository.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()));
    } else {
      return repositoryData
    }
  };

  const fetchRepositoryVisibility = async (id: string) : Promise<number> => {
    try {
      const res = await server.get(`/repositories/${id}`, {
        headers: authorizationHeader
      });

      return res.data.visibility
    } catch (e: any) {
      console.log(e)
      return 1;

    }
  }

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
    pageSize: number = 100,
    pageCount: number = 1
  ): Promise<Repository[]> => {
    try {
      let endpoint = `/org_repo/${orgID}/?ordering=-updated_at&page_size=${pageSize}&page=${pageCount}`;

      const res = await server.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results.filter((data: any) => !data.repo.is_deleted && data.repo.is_approved);
      const userRepo = (await fetchRepositoriesByUser()).sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      const filteredData = await Promise.all(
        rawData.map(async (data: any) => {
          if (isForUser) {
            if (data.repo.visibility === 2) {
              return data.repo.user === userData.uid ? data : null;
            }
            return data;
          } else {
            if (user.value) {
              if (data.repo.visibility === 2) {

              }
              const isBelong = userRepo.some((repo: Repository) => repo.uid === data.repo.uid);
              return ( (data.repo.visibility === 3 || data.repo.visibility === 4) && isBelong )|| (data.repo.visibility === 1 && data.repo.is_active) ? data : null;

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

      let data = [...repositories].filter(repo => !repo.is_deleted).sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      orgRepositories.value = data;
      return data;

    } catch (e) {
      console.error("Error fetching repositories:", e);
      return [];
    }
  };

  const fetchAllRepositories = async (
      pageNumber: number,
      pageSize: number,
      searchQuery?: string,
      priorityLevel?: string,
      organization?: string,
      isApproved?: string | boolean,
      isActive?: string | boolean,
      type?: string,
      status?: string,
      tags?: string,
      user_fields?: string,
      technology_owner?: string,
      technology_generator?: string,
      collaborator?: string,
      lead?: string,
      visibility?: string,
      isForUser?: boolean,
      isAllDataIncluded: boolean = false,
      filter_type?: string

  ): Promise<Repository[]> => {
    try {
      let url = `/repositories/?ordering=-updated_at&page=${pageNumber}&page_size=${pageSize}`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (priorityLevel) {
        url += `&priority_level=${encodeURIComponent(priorityLevel.toLowerCase())}`;
      }
      if (organization?.trim()) {
        url += `&organization=${encodeURIComponent(organization)}`;
      }
      if (typeof isApproved === 'boolean') {
        url += `&is_approved=${isApproved}`;
      }
      if (typeof isActive === 'boolean') {
        url += `&is_active=${isActive}`;
      }
      if (type?.trim()) {
        url += `&type=${encodeURIComponent(type)}`;
      }
      if (status?.trim()) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      if (tags?.trim()) {
        url += `&tags=${encodeURIComponent(tags)}`;
      }
      if (user_fields?.trim()) {
          url += `&user_fields=${encodeURIComponent(user_fields)}`;
      } else {
        if (technology_owner?.trim()) {
          url += `&tech_owner=${encodeURIComponent(technology_owner)}`;
        }
        if (technology_generator?.trim()) {
          url += `&technology_generator=${encodeURIComponent(technology_generator)}`;
        }
        if (collaborator?.trim()) {
          url += `&author=${encodeURIComponent(collaborator)}`;
        }
        if (lead?.trim()) {
          url += `&lead=${encodeURIComponent(lead)}`;
        }
      }
      if(visibility) {
          url += `&visibility=${encodeURIComponent(visibility)}`;
      }
      if(isForUser) {
        url += `&user=${userData.uid}`;
      }
      if(filter_type) {
        url += `&filter_type=${filter_type}`;
      }

      console.log(url)

      const res = await server.get(url,
          user.value
              ? { headers: { Authorization: `Bearer ${userData.accessToken}` } }
              : {}
      );


      const rawData = res.data.results;

      let repositories: Repository[] = await mapRepoData(
          rawData.filter((repo: any) => !repo.is_deleted), 'create', isAllDataIncluded
      );

      repositories.sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      const data = [...repositories];
      myRepositories.value = data;
      return data;
    } catch (e) {
      return [];
    }
  };

  const fetchRepositoryIDsByUser = async (
      pageSize: number = 100,
      user: boolean = true,
      searchQuery?: string,
      priorityLevel?: string,
      organization?: string,
      isApproved?: string | boolean,
      isActive?: string | boolean,
      type?: string,
      status?: string,
      tags?: string,
      user_fields?: string,
      technology_owner?: string,
      technology_generator?: string,
      collaborator?: string,
      lead?: string,
      visibility?: string,
      filter_type?: string
  ): Promise<Repository[]> => {
    try {
      // Start with the base URL based on whether user filtering is enabled
      let url = user
          ? `/repositories/?ordering=-updated_at&page=1&page_size=${pageSize}&user=${userData.uid}`
          : `/repositories/?ordering=-updated_at&page=1&page_size=${pageSize}`;

      // Append search parameter if provided
      if (searchQuery && searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      // Append priority_level parameter if provided
      if (priorityLevel && priorityLevel.trim()) {
        url += `&priority_level=${encodeURIComponent(priorityLevel.trim().toLowerCase())}`;
      }
      if (organization?.trim()) {
        url += `&organization=${encodeURIComponent(organization)}`;
      }
      if (typeof isApproved === 'boolean') {
        url += `&is_approved=${isApproved}`;
      }
      if (typeof isActive === 'boolean') {
        url += `&is_active=${isActive}`;
      }
      if (type?.trim()) {
        url += `&type=${encodeURIComponent(type)}`;
      }
      if (status?.trim()) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      if (tags?.trim()) {
        url += `&tags=${encodeURIComponent(tags)}`;
      }
      if (user_fields?.trim()) {
        url += `&user_fields=${encodeURIComponent(user_fields)}`;
      } else {
        if (technology_owner?.trim()) {
          url += `&tech_owner=${encodeURIComponent(technology_owner)}`;
        }
        if (technology_generator?.trim()) {
          url += `&technology_generator=${encodeURIComponent(technology_generator)}`;
        }
        if (collaborator?.trim()) {
          url += `&author=${encodeURIComponent(collaborator)}`;
        }
        if (lead?.trim()) {
          url += `&lead=${encodeURIComponent(lead)}`;
        }
      }
      if (visibility) {
          url += `&visibility=${encodeURIComponent(visibility)}`;
      }

      if(filter_type) {
        url += `&filter_type=${filter_type}`;
      }


      console.log(`ID URL: ${url}`)

      const res = await server.get(url, {
        headers: { 'Authorization': `Bearer ${userData.accessToken}` }
      });

      const rawData = user ? res.data.results.filter((repo: any) => !repo.is_deleted && repo.is_approved) : res.data.results.filter((repo: any) => !repo.is_deleted);
      const repositories: Repository[] = rawData.map((repo: any) => ({
        uid: repo.uid,
        slug: repo.uid,
        type: repo.type,
        title: repo.title,
        image: repo.image
      }));

      myRepositories.value = [...repositories];
      return repositories;
    } catch (e) {
      return [];
    }
  };

  const fetchRepositoriesByUserWithPagination = async(pageNumber: number): Promise<Repository[]> => {
    try{
      const res = await server.get(`/repositories/?ordering=-updated_at&user=${userData.uid}&page=${pageNumber}&page_size=10`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      let repositories: Repository[] = await mapRepoData(rawData.filter((repo: any) => !repo.is_deleted && repo.is_approved));
      repositories.sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      const data = [...repositories];
      myRepositories.value = data
      return data;
    } catch (e) {
      return []
    }
  }


  const fetchRepositoriesByUser = async(pageSize: number = 100): Promise<Repository[]> => {
    try{
      const res = await server.get(`/repositories/?ordering=-updated_at&page_size=${pageSize}&user=${userData.uid}`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data.results;
      let repositories: Repository[] = await mapRepoData(rawData.filter((repo: any) => !repo.is_deleted && repo.is_approved));
      repositories.sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      const data = [...repositories];
      myRepositories.value = data
      return data;
    } catch (e) {
      return []
    }
  }


  const fetchRepositoriesWithPagination = async (pageNumber: number, isForIPT: boolean = false): Promise<Repository[]> => {
    try{
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
      data.sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      return isForIPT ? data.filter(repo => repo.type == 'Project Repository') : data;
    } catch (e) {
      return []
    }
  }


  const fetchPaginatedRepositories = async (pageNumber: number, visibilities: number[]): Promise<Repository[]> => {
    try{
      const promises = visibilities.map(async (visibility) => {
        const res = await server.get(`/repositories/?ordering=-updated_at&page=${pageNumber}&page_size=10&visibility=${visibility}`, {
          headers: authorizationHeader
        });
        return await mapRepoData(res.data.results);
      });

      let results = await Promise.all(promises);

      return results.flat().filter(repo => !repo.is_deleted && repo.is_active && repo.is_approved).sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
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

        const filteredVisibilityData = visibilityData.flat().filter((repo: any) => repo.is_active && repo.is_approved);
        let combinedData = [...filteredVisibilityData, ...userRepo];
        const uniqueData = Array.from(new Set(combinedData.map(repo => repo.slug)))
          .map(slug => combinedData.find(repo => repo.slug === slug));
        // @ts-ignore
        data = uniqueData ;
      } else {
        const visibilityData = await fetchRepositoriesByVisibility([1]);
        data = visibilityData[0].filter((repo: any) => repo.is_active && repo.is_approved);
      }
      data.sort((a, b) => compareDateStrings(a.updated_at!, b.updated_at!));
      allRepositories.value = data.filter(repo => !repo.is_deleted && repo.is_approved);
      return data.filter(repo => !repo.is_deleted && repo.is_approved);
    } catch (e) {
      return []
    }
  }

  // const fetchRepoAccessByRepo = async(id: string) : Promise<RepoMemberAccess[]> =>  {
  //   try{
  //     const res = await server.get(`/repo-users/${id}`, {
  //       headers: authorizationHeader
  //     })
  //     return res.data.results.map((repomember: any) => {
  //       return {
  //         membership_uid: repomember.membership_uid,
  //         user: repomember.user.uid,
  //         repo: repomember.repo.uid,
  //         access_level: repomember.access_level,
  //         is_deleted: repomember.is_deleted,
  //       }
  //     }).filter((repo: any) => !repo.is_deleted)
  //   } catch (e: any) {
  //     console.log(e)
  //     return [];
  //   }
  // }



  const fetchRepositoriesByVisibility = async (visibilities: number[], pageSize: number = 100): Promise<Repository[][]> => {

    const promises = visibilities.map(async (visibility) => {
      const res = await server.get(`/repositories/?ordering=-updated_at&page_size=${pageSize}&visibility=${visibility}`, {
        headers: authorizationHeader
      });
      return mapRepoData(res.data.results);
    });
    return Promise.all(promises);
  };

  const fetchRepositoryData = async (slug: string,  type: string = 'create'): Promise<Repository | null> => {
    try{
      isPageLoading.value = true;
      const res = await server.get(`/repositories/${slug}`, {
        headers: authorizationHeader
      });
      const rawData = [res.data];
      const repositoryList = await mapRepoData(rawData, type, true);
      if (repositoryList) {
        repository.value = repositoryList[0];
        return repositoryList[0];
      } else {
        console.error('no repo')
        return null;
      }
    } catch(e: any){
      isPageLoading.value = false;
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
    manageRepositoryStatus,
    manageRepositoryAdminStatus,
    errorMessage,
    clearErrorMessage,
    hasErrorMessages,
    loading,
    fetchRepositories,
    fetchRepositoryData,
    fetchRepositoriesWithPagination,
    fetchRepositoriesByUser,
    fetchRepositoriesByUserWithPagination,
    fetchRepositoryIDsByUser,
    changeRepositoryVisibility,
    fetchRepositoryVisibility,
    fetchAllRepositories,
  }

}