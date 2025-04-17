import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {AbhImage} from "../../../interfaces/abh.interface.ts";

const { userData } = useUserStore();

export const useAbhImagesServices = () => {
    const saveAbhImage = async (image: AbhImage, endpoint: string, type: string) => {
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

    const addAbhImage = async(image: AbhImage)=> {
        await saveAbhImage(image, `/abhs/${image.abh}/images/`, 'create')
    }

    const updateAbhImage = async(image: AbhImage, id: string)=> {
        await saveAbhImage(image, `/abh-images/${id}/`, 'update')
    }

    const deleteAbhImage = async(id: string) => {
        try {
            await server.delete(`/abh-images/${id}/`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    // const fetchAbhImagesByPost = async(atbiID: string): Promise<AbhImage[]> => {
    //     try {
    //         const res = await server.get(`/atbis/${atbiID}/images/`, {
    //             headers: {
    //                 Authorization: `Bearer ${userData.accessToken}`
    //             }
    //         });
    //         return res.data.map((image: any)=> {
    //             return {
    //                 uuid: image.uuid,
    //                 atbi: image.atbi,
    //                 image: image.image,
    //                 type: 'update',
    //             }
    //         })
    //     } catch (e) {
    //         console.log(e);
    //         return []
    //     }
    // }

    return{
        addAbhImage,
        updateAbhImage,
        deleteAbhImage,
        // fetchAbhImagesByPost
    }
}
