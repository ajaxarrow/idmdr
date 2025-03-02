import {useUserStore} from "../../../core/stores/user.store.ts";
import {usePostImagesServices} from "./post-images.services.ts";
import {ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {Post} from "../../../interfaces/post.interface.ts";

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {fetchPostImagesByPost} = usePostImagesServices();

export const usePostServices = () => {
  const loading = ref(false);

  const savePost = async (post: any, endpoint: string, type: string) => {
    loading.value = true;
    try {
      await (type === 'create' ? server.post : server.put)(endpoint, post, {
        headers: authorizationHeader
      });
      if(type === 'create'){
        setTimeout(async function() {
          window.location.href = `/posts/`;
        }, 3000);
      } else {
        setTimeout(async function() {
          window.location.href = `/posts/${post.uid}/`;
        }, 3000);
      }

      await localStorage.setItem('snackbarmessage', JSON.stringify({
        message: `News ${type === 'create' ? 'added' : 'updated'}  successfully`,
        status: 'success'
      }))
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }

  const addPost = async (post: Post) => {
    await savePost(post, '/posts/', 'create');
  }

  const updatePost = async (post: Post) => {
    await savePost(post, `/posts/${post.uid}`, 'update');
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

  const mapPostData = async (rawData: any): Promise<Post[]> => {
    return Promise.all(
      rawData.map(async (post: any) => {
        const images = await fetchPostImagesByPost(post.uid);
        return {
          uid: post.uid,
          title: post.title,
          description: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          is_deleted: post.is_deleted,
          images: images

        }
      })
    )
  }

  const fetchAllPosts = async (): Promise<Post[]> => {
    try {
      const res = await server.get('/posts/', {
        headers: authorizationHeader
      });
      return await mapPostData(res.data);
    } catch (error) {
      console.error(error);
      return []
    }
  }

  return {
    addPost,
    updatePost,
    deletePost,
    fetchAllPosts
  }

}