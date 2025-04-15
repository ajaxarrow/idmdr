import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive, ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useAtbiSubEntityImagesServices} from "./atbi-sub-entity-images.services.ts";
import {AtbiSubEntity} from "../../../interfaces/atbi.interface.ts";

const { userData, user } = useUserStore();
const {addAtbiSubEntityImage} = useAtbiSubEntityImagesServices()
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();

export const useAtbiSubEntityServices = () => {
    const loading = ref(false);

    const errorMessageInitialState = reactive({
        name: '',
        quanity: '',
        unit: '',
        price: '',
    })

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

    const saveAtbiSubEntity = async (data: any, endpoint: string, entityType: string, type: string = 'create') => {
        clearErrorMessage()
        loading.value = true;
        try {
            const res = await (type === 'create' ? server.post : server.patch)(
                endpoint,
                data, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                        "Content-Type": "multipart/form-data"
                    },
                }
            );

            if (data?.images?.length > 0) {
                for (let i = 0; i < data.images.length; i++) {
                    data.images[i].entity = res.data.uuid;
                    await addAtbiSubEntityImage(data.images[i]);
                }
            }

            await localStorage.setItem('snackbarmessage', JSON.stringify({
                message: `${entityType} ${type === 'create' ? 'added' : 'updated'}  successfully`,
                status: 'success'
            }))

            if (type === 'create') {
                setTimeout(async function () {
                    window.location.href = `/atbi/${res.data.atbi}/?tab=${entityType}`;
                }, 1000);
            } else {
                setTimeout(async function () {
                    window.location.href = `/atbi/${res.data.atbi}/?tab=${entityType}`;
                }, 1000);
            }
        } catch (error: any) {
            loading.value = false;
            console.error(error);
            showSnackbarMessage('OOPS! Something went wrong', Status.error);
            handleDynamicErrorMapping(error.response?.data, errorMessage);
        }
    }

    const addAtbiSubEntity = async (data: AtbiSubEntity, type: string) => {
        await saveAtbiSubEntity(data, '/entities/', type);
    }

    const updateAtbiSubEntity = async (data: AtbiSubEntity, type: string, id: string) => {
        await saveAtbiSubEntity(data, `/entities/${id}/`, type, 'update');
    }


    const mapAtbiSubEntityData = async (data: any): Promise<AtbiSubEntity> => {
        return {
            uuid: data.uuid || '',
            atbi: data.atbi || '',
            name: data.name || '',
            quantity: data.quantity || 0,
            unit: data.unit || '',
            logo: data.logo || 'https://dummyimage.com/600x400/023768/fff.png&text=ATBI',
            description: data.description || '',
            price: data.price,
            images: data.entity_images,
            entity_type: data.entity_type,
        }
    }
    const fetchAtbiSubEntityData = async (id: string): Promise<AtbiSubEntity | null> => {
        try {
            const res = await server.get(`/entities/${id}/`, {
                headers: authorizationHeader
            });
            return await mapAtbiSubEntityData(res.data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    const fetchAtbiSubEntities = async (type: string, id: string): Promise<AtbiSubEntity[]> => {
        try {
            const res = await server.get(`/entities/?entity_type=${type}&atbi=${id}`, {
                headers: authorizationHeader
            });
            return await Promise.all(res.data.map((atbi: any) => mapAtbiSubEntityData(atbi)));
        } catch (error: any) {
            console.error(error);
            return [];
        }
    }

    const deleteAtbiSubEntity = async (id: string) => {
        try {
            await server.delete(`/entities/${id}/`, {
                headers: authorizationHeader
            })
        } catch (error) {
            console.error(error);
        }
    }


    return {
        loading,
        errorMessage,
        hasErrorMessages,
        addAtbiSubEntity,
        updateAtbiSubEntity,
        fetchAtbiSubEntityData,
        fetchAtbiSubEntities,
        deleteAtbiSubEntity,

    }

}