import {useUserStore} from "../stores/user.store.ts";
import {server} from "../../plugins/axios.ts";

export const useCoreServices = () => {
    const { userData, user } = useUserStore();
    const authorizationHeader = user.value
        ? { Authorization: `Bearer ${userData.accessToken}` }
        : {};

    const fetchContentType = async (contentType: string): Promise<number> => {
        try{
            const res = await server.get(`/get-content-type/?model_name=${contentType}&app_label=${contentType}`, {
                headers: authorizationHeader,
            })
            return res.data.id
        } catch (error) {
            console.error("Error fetching content type:", error);
            return 0;
        }
    }

    return {
        fetchContentType
    }
}