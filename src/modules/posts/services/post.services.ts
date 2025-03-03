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

  const savePost = async (post: any, endpoint: string, type: string, id: string = '') => {
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
        message: `News ${type === 'create' ? 'added' : 'updated'}  successfully`,
        status: 'success'
      }))

      if(type === 'create'){
        setTimeout(async function() {
          window.location.href = `/posts/`;
        }, 3000);
      } else {
        setTimeout(async function() {
          window.location.href = `/posts/${id}/`;
        }, 3000);
      }
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }

  const addPost = async (post: Post) => {
    await savePost(post, '/posts/', 'create');
  }

  const updatePost = async (post: Post) => {
    await savePost(post, `/posts/${post.uid}/`, 'update', post.uid);
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
      images: images
    };
  };


  const fetchAllPosts = async (): Promise<Post[]> => {
    try {
      const res = await server.get('/posts/', {
        headers: authorizationHeader
      });

      return await Promise.all(res.data.map((post: any) => mapPostData(post)));
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


  return {
    loading,
    addPost,
    updatePost,
    deletePost,
    fetchAllPosts,
    fetchPostbyID
  }

}