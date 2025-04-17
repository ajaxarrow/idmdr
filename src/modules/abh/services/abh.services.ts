import {useUserStore} from "../../../core/stores/user.store.ts";
import {useAbhImagesServices} from "./abh-images.services.ts";
import {server} from "../../../plugins/axios.ts";
import {ref} from "vue";
import {ABH} from "../../../interfaces/abh.interface.ts";

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {addAbhImage} = useAbhImagesServices();


export const useAbhServices = () => {
    const loading = ref(false);
    const saveAbh = async (abh: any, endpoint: string, techID: string, type: string = 'create') => {
        loading.value = true;
        try {
            const res = await (type === 'create' ? server.post : server.patch)(endpoint, abh, {
                headers: authorizationHeader
            })

            if (abh?.images?.length > 0) {
                for (let i = 0; i < abh.image_urls.length; i++) {
                    abh.images[i].abh = res.data.uuid;
                    await addAbhImage(abh.images[i]);
                }
            }

            await localStorage.setItem('snackbarmessage', JSON.stringify({
                message: `ABH ${type === 'create' ? 'added' : 'updated'}  successfully`,
                status: 'success'
            }))

            if (type === 'create') {
                setTimeout(async function () {
                    window.location.href = `/my-repositories/${techID}/abhs/`;
                }, 1000);
            } else {
                setTimeout(async function () {
                    window.location.href = `/my-repositories/${techID}/abhs/${res.data.uuid}`;
                }, 1000);
            }
        } catch (e) {
            loading.value = false;
            console.log(e);
        }
    }

    const addAbh = async(abh: any)=> {
        await saveAbh(abh, `/abhs/`, 'create')
    }

    const updateAbh = async(abh: any, id: string)=> {
        await saveAbh(abh, `/abhs/${id}/`, 'update')
    }

    const deleteAbhImage = async(id: string) => {
        try {
            await server.delete(`/abhs/${id}/`)
        } catch (e) {
            console.log(e);
        }
    }

    const mapAbhData = (data: any) => {
        return {
            uuid: data.uuid,
            technology: data.technology,
            tech_name: data.tech_name,
            tech_image: data.tech_image,
            technology_assessment: data.technology_assessment,
            business_model_development: data.business_model_development,
            business_plan_preparation: data.business_plan_preparation,
            market_research: data.market_research,
            technology_registration_assistance: data.technology_registration_assistance,
            feasibility: data.feasibility,
            partnership_and_networking: data.partnership_and_networking,
            is_deleted: data.is_deleted,
            is_active: data.is_active,
            images: data.image_urls
        }
    }

    const fetchAbhsByTechnology = async (id: string): Promise<ABH[]> => {
        try {
            const res = await server.get(`/abhs/?technology=${id}/`, {
                headers: authorizationHeader
            });
            return res.data.map((item: any) => mapAbhData(item));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const fetchAbhData = async (id: string): Promise<ABH | null> => {
        try {
            const res = await server.get(`/abhs/${id}/`, {
                headers: authorizationHeader
            });
            return mapAbhData(res.data);
        } catch (error) {
            console.error(error);
            return null
        }
    }

    return {addAbh, updateAbh, deleteAbhImage, fetchAbhsByTechnology, fetchAbhData, loading}

}