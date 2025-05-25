import {useUserStore} from "../../../core/stores/user.store.ts";
import {usePostImagesServices} from "./post-images.services.ts";
import {ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {Post} from "../../../interfaces/post.interface.ts";

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {fetchPostImagesByPost, addPostImage} = usePostImagesServices();

export const usePostServices = () => {
  const loading = ref(false);

  const savePost = async (post: any, endpoint: string, type: string, orgID: string, id: string = '') => {
    loading.value = true;
    try {
      const res = await (type === 'create' ? server.post : server.put)(endpoint, post, {
        headers: authorizationHeader
      });


      if (post?.images?.length > 0) {
        for (let i = 0; i < post.images.length; i++) {
          post.images[i].post = res.data.uid;
          await addPostImage(post.images[i]);
        }
      }

      await localStorage.setItem('snackbarmessage', JSON.stringify({
        message: `Post ${type === 'create' ? 'added' : 'updated'}  successfully`,
        status: 'success'
      }))

      if(type === 'create'){
        setTimeout(async function() {
          window.location.href = `/organizations/${orgID}/posts/`;
        }, 1000);
      } else {
        setTimeout(async function() {
          window.location.href = `/organizations/${orgID}/posts/${id}/`;
        }, 1000);
      }
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }

  const addPost = async (post: Post, orgID: string) => {
    await savePost(post, '/posts/', 'create', orgID);
  }

  const updatePost = async (post: Post, orgID: string) => {
    await savePost(post, `/posts/${post.uid}/`, 'update', orgID, post.uid);
  }

  const managePostStatus = async(id: string, isPublished: boolean) => {
    try{
      await server.patch(`/posts/${id}/`, {
        is_draft: false,
        is_published: isPublished
      }, {
        headers: authorizationHeader
      });
    } catch (error) {
      console.error(error);
    }
  }

  const deletePost = async (id: string) => {
    try {
      await server.delete(`/posts/${id}/`, {
        headers: authorizationHeader
      });
    } catch (error) {
      console.error(error);
    }
  }


  const mapPostData = async (post: any): Promise<Post> => {
    const images = await fetchPostImagesByPost(post.uid);
    return {
      uid: post.uid,
      title: post.title,
      description: post.description,
      created_at: post.created_at,
      updated_at: post.updated_at,
      is_deleted: post.is_deleted,
      is_draft: post.is_draft,
      is_published: post.is_published,
      organization: post.organization.uid,
      organizationData: post.organization,
      images: images
    };
  };


  const fetchAllPosts = async (): Promise<Post[]> => {
    try {
      const res = await server.get('/posts/?is_published=true&page_size=100000000', {
        headers: authorizationHeader
      });

      return await Promise.all(res.data.results.map((post: any) => mapPostData(post)));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchAllPostsByUser = async (): Promise<Post[]> => {
    try {
      const userOrg = await server.get(`/v1/user/${userData.uid}/organizations`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const userOrgUids = userOrg.data.results.map((org: any) => org.organization.uid);
      const res = await server.get('/posts/?page_size=100000000', {
        headers: authorizationHeader
      });
      return (await Promise.all(res.data.results.map((post: any) => mapPostData(post))))
          // @ts-ignore
          .filter((post: Post) => userOrgUids.includes(post.organizationData.uid as string));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchPostByOrganization = async (id: string): Promise<Post[]> => {
    try {
      const res = await server.get(`/posts/?organization=${id}`, {
        headers: authorizationHeader
      });

      return await Promise.all(res.data.results.map((post: any) => mapPostData(post)));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchPostbyID = async (id: string) => {
    try {
      const res = await server.get(`/posts/${id}/`, {
        headers: authorizationHeader
      })

      return await mapPostData(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchPostsByAdmin = async (
      pageNumber: number,
      pageSize: number,
      searchQuery?: string,
      organization?: string,
      isPublished?: string | boolean
  ): Promise<Post[]> => {
    try {
      let url = `/posts/?page=${pageNumber}&page_size=${pageSize}`;
      if (searchQuery && searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (organization) {
        url += `&organization=${organization}`;
      }
      if (typeof isPublished === 'boolean') {
        url += `&is_published=${isPublished}`;
      }
      const res = await server.get(url, {
        headers: authorizationHeader
      });
      const rawData = res.data.results;
      const posts: Post[] = await Promise.all(rawData.map((post: any) => mapPostData(post)));
      return posts;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const fetchTotalPosts = async (
      pageNumber: number,
      pageSize: number,
      searchQuery?: string,
      organization?: string,
      isPublished?: string | boolean
  ): Promise<number> => {
    try {
      let url = `/posts/?page=${pageNumber}&page_size=${pageSize}`;
      if (searchQuery && searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (organization) {
        url += `&organization=${organization}`;
      }
      if (typeof isPublished === 'boolean') {
        url += `&is_published=${isPublished}`;
      }
      const res = await server.get(url, {
        headers: authorizationHeader
      });
      const rawData = res.data.results;
      return rawData.length;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }


  return {
    loading,
    addPost,
    updatePost,
    deletePost,
    fetchAllPosts,
    fetchPostbyID,
    fetchPostByOrganization,
    managePostStatus,
    fetchPostsByAdmin,
    fetchTotalPosts,
    fetchAllPostsByUser
  }

}