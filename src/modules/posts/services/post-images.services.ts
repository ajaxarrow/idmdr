import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {PostImage} from "../../../interfaces/post.interface.ts";

const { userData, user } = useUserStore();

export const usePostImagesServices = () => {
  const savePostImage = async (image: PostImage, endpoint: string, type: string) => {
    try {
      await (type === 'create' ? server.post : server.put)(endpoint, image, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  const addPostImage = async(image: PostImage)=> {
    await savePostImage(image, `/post-images/${image.post}/`, 'create')
  }

  const updatePostImage = async(image: PostImage)=> {
    await savePostImage(image, `/post-image-update/${image.uid}/`, 'update')
  }

  const deletePostImage = async(id: string) => {
    try {
      await server.delete(`/post-image-update/${id}/`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPostImagesByPost = async(postID: string): Promise<PostImage[]> => {
    try {
      const res = await server.get(`/post-images/${postID}/`, user.value
          ? { headers: { Authorization: `Bearer ${userData.accessToken}` } }
          : {});
      return res.data.map((image: any)=> {
        return {
          uid: image.uid,
          post: image.post,
          image: image.image,
          created_at: image.created_at,
          updated_at: image.updated_at,
          is_deleted: image.is_deleted,
          type: 'update',
        }
      })
    } catch (e) {
      console.log(e);
      return []
    }
  }

  return{
    addPostImage,
    updatePostImage,
    deletePostImage,
    fetchPostImagesByPost
  }
}
