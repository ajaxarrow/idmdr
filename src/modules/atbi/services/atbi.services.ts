import {useUserStore} from "../../../core/stores/user.store.ts";
import {reactive, ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {useAtbiImagesServices} from "./atbi-images.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {ATBI} from "../../../interfaces/atbi.interface.ts";
import {useCustomUsersServices} from "../../repository/services/custom-users.services.ts";

const { userData, user } = useUserStore();
const {mapCustomUsers} = useCustomUsersServices()
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {addAtbiImage} = useAtbiImagesServices();
const {showSnackbarMessage} = useSnackbarStore();
export const useAtbiServices = () => {
    const loading = ref(false);

    const errorMessageInitialState = reactive({
        name: '',
        mobile: '',
        email: '',
        facebook: ''
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

    const saveAtbi = async (atbi: any, endpoint: string, type: string, id: string = '') => {
        clearErrorMessage()
        loading.value = true;
        try {
            const res = await (type === 'create' ? server.post : server.patch)(
                endpoint,
                atbi, {
                    headers: {
                        Authorization: `Bearer ${userData.accessToken}`,
                        "Content-Type": "multipart/form-data"
                    },
                }
            );

            if (atbi?.image_urls?.length > 0) {
                for (let i = 0; i < atbi.image_urls.length; i++) {
                    atbi.image_urls[i].atbi = res.data.uuid;
                    await addAtbiImage(atbi.image_urls[i]);
                }
            }

            await localStorage.setItem('snackbarmessage', JSON.stringify({
                message: `ATBI ${type === 'create' ? 'added' : 'updated'}  successfully`,
                status: 'success'
            }))

            if (type === 'create') {
                setTimeout(async function () {
                    window.location.href = `/atbi/`;
                }, 1000);
            } else {
                setTimeout(async function () {
                    window.location.href = `/atbi/${id}/`;
                }, 1000);
            }
        } catch (error: any) {
            loading.value = false;
            console.error(error);
            showSnackbarMessage('OOPS! Something went wrong', Status.error);
            handleDynamicErrorMapping(error.response?.data, errorMessage);
        }
    }

    const addAtbi = async (atbi: ATBI) => {
        await saveAtbi(atbi, '/atbis/', 'create');

    }

    const updateAtbi = async (atbi: ATBI, id: string) => {
        await saveAtbi(atbi, `/atbis/${id}/`, 'update', id);
    }

    const manageATBIStatus = async (id: string, isActive: boolean) => {
        try {
            await server.patch(`/atbis/${id}/`, {
                is_deleted: false,
                is_active: isActive
            }, {
                headers: authorizationHeader
            })
        } catch (error) {
            console.error(error);
        }
    }

    const manageATBIStatusByAdmin = async (id: string, isDeleted: boolean) => {
        try {
            await server.patch(`/atbis/${id}/`, {
                is_deleted: isDeleted
            }, {
                headers: authorizationHeader
            })
        } catch (error) {
            console.error(error);
        }
    }


    const fetchAtbiByTechnology = async (id: string): Promise<ATBI[]> => {
        try {
            const res = await server.get(`/atbis/?technology=${id}`, {
                headers: authorizationHeader
            });
            return await Promise.all(res.data.results.map((atbi: any) => mapAtbiData(atbi)));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const fetchAtbis = async (): Promise<ATBI[]> => {
        try {
            const res = await server.get('/atbis', {
                headers: authorizationHeader
            });
            return await Promise.all(res.data.results.map((atbi: any) => mapAtbiData(atbi, true)));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const mapAtbiData = async (atbi: any, isAssociatedDataIncluded: boolean = false): Promise<ATBI> => {
        const baseData = {
            uuid: atbi.uuid,
            name: atbi.name || '',
            logo: atbi.logo || 'https://dummyimage.com/600x400/023768/fff.png&text=ATBI',
            description: atbi.description || '',
            owner: atbi.owner,
            ownerData: atbi.ownerData,
            mobile: atbi.mobile || '',
            email: atbi.email || '',
            facebook: atbi.facebook || '',
            additional_info: atbi.additional_info || '',
            is_deleted: atbi.is_deleted,
            is_active: atbi.is_active,
            image_urls: atbi.image_urls,
            technology: atbi.technology,
            tech_name: atbi.tech_name,
            tech_image: atbi.tech_image
        }

        if (!isAssociatedDataIncluded) return baseData;

        const owner = await mapCustomUsers(JSON.parse(atbi?.owners).data)

        return{
            ...baseData,
            ownerData: owner
        }
    };

    const fetchAtbiData = async (id: string): Promise<ATBI | null> => {
        try {
            const res = await server.get(`/atbis/${id}/`, {
                headers: authorizationHeader
            });
            return await mapAtbiData(res.data, true);
        } catch (error) {
            console.error(error);
            return null
        }
    }
    const deleteAtbi = async (id: string) => {
        try {
            await server.delete(`/atbis/${id}/`, {
                headers: authorizationHeader
            })
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAllAtbis = async (
        pageNumber: number,
        pageSize: number,
        searchQuery?: string,
        technology?: string,
        owners?: string,
        isForUser: boolean = false
    ): Promise<ATBI[]> => {
        try {
            let url = `/atbis/?page=${pageNumber}&page_size=${pageSize}`

            if (searchQuery && searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`
            }
            if (technology) {
                url += `&technology=${technology}`
            }
            if (owners) {
                url += `&owners=${owners}`
            }
            if (isForUser) {
                url += `&user=${userData.uid}`;
            }
            const res = await server.get(url, {
                headers: authorizationHeader
            });
            return await Promise.all(res.data.results.map((atbi: any) => mapAtbiData(atbi, true)));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const fetchTotalAtbisCount = async (
        pageNumber: number,
        pageSize: number,
        searchQuery?: string,
        technology?: string,
        owners?: string,
        isForUser: boolean = false
    ) : Promise<number> => {
        try {
            let url = `/atbis/?page=${pageNumber}&page_size=${pageSize}`

            if (searchQuery && searchQuery.trim()) {
                url += `&search=${encodeURIComponent(searchQuery.trim())}`
            }
            if (technology) {
                url += `&technology=${technology}`
            }
            if (owners) {
                url += `&owners=${owners}`
            }
            if (isForUser) {
                url += `&user=${userData.uid}`;
            }
            const res = await server.get(url, {
                headers: authorizationHeader
            });
            return res.data.results.length;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }


    return {
        loading,
        errorMessage,
        hasErrorMessages,
        addAtbi,
        updateAtbi,
        manageATBIStatus,
        manageATBIStatusByAdmin,
        fetchAtbiByTechnology,
        fetchAtbis,
        fetchAtbiData,
        deleteAtbi,
        fetchAllAtbis,
        fetchTotalAtbisCount
    }


}