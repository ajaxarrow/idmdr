import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {AtbiSubEntityImage} from "../../../interfaces/atbi.interface.ts";


const { userData } = useUserStore();

export const useAtbiSubEntityImagesServices = () => {
    const saveAtbiSubEntityImage = async (image: AtbiSubEntityImage, endpoint: string, type: string) => {
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

    const addAtbiSubEntityImage = async(image: AtbiSubEntityImage)=> {
        await saveAtbiSubEntityImage(image, `/entities/${image.entity}/images/`, 'create')
    }

    const updateAtbiSubEntityImage = async(image: AtbiSubEntityImage)=> {
        await saveAtbiSubEntityImage(image, `/entity-images/${image.uuid}/`, 'update')
    }

    const deleteAtbiSubEntityImage = async(id: string) => {
        try {
            await server.delete(`/entity-images/${id}/`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const fetchAtbiSubEntityImagesByPost = async(atbiID: string): Promise<AtbiSubEntityImage[]> => {
        try {
            const res = await server.get(`/atbis/${atbiID}/images/`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });
            return res.data.map((image: any)=> {
                return {
                    uuid: image.uuid,
                    atbi: image.atbi,
                    image: image.image,
                    type: 'update',
                }
            })
        } catch (e) {
            console.log(e);
            return []
        }
    }

    return{
        addAtbiSubEntityImage,
        updateAtbiSubEntityImage,
        deleteAtbiSubEntityImage,
        fetchAtbiSubEntityImagesByPost
    }
}
