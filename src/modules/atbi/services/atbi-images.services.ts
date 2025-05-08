import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {AtbiImage} from "../../../interfaces/atbi.interface.ts";

const { userData } = useUserStore();

export const useAtbiImagesServices = () => {
    const saveAtbiImage = async (image: AtbiImage, endpoint: string, type: string) => {
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

    const addAtbiImage = async(image: AtbiImage)=> {
        await saveAtbiImage(image, `/atbis/${image.atbi}/images/`, 'create')
    }

    const updateAtbiImage = async(image: AtbiImage)=> {
        await saveAtbiImage(image, `/atbis/${image.atbi}/images/`, 'update')
    }

    const deleteAtbiImage = async(id: string) => {
        try {
            await server.delete(`/atbi-images/${id}/`, {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const fetchAtbiImagesByPost = async(atbiID: string): Promise<AtbiImage[]> => {
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
        addAtbiImage,
        updateAtbiImage,
        deleteAtbiImage,
        fetchAtbiImagesByPost
    }
}
