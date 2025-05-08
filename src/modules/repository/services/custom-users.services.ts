import {CustomUserData, User} from "../../../interfaces/member.interface.ts";
import {useOrganizationExpertsServices} from "../../organization/services/organization-experts.services.ts";

import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
const { userData, user } = useUserStore();
const authorizationHeader = user.value
    ? { Authorization: `Bearer ${userData.accessToken}` }
    : {};
const {fetchExpertById} = useOrganizationExpertsServices();
export const useCustomUsersServices = () => {

    const fetchUser = async (uid: string): Promise<User | null> => {
        try {
            const res = await server.get(`/users/${uid}`, {
                headers: authorizationHeader,
            });

            return res.data.results
                .filter((user: any) => user.username)
                .map((user: any) => ({
                    uid: user.uid,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    profile_picture: user.profile_picture,
                }))[0];
        } catch (e){
            console.log(e)
            return null;
        }
    }
    const mapCustomUsers = async (userData: CustomUserData[]): Promise<CustomUserData[]> => {
        try {
            return await Promise.all(
                userData.map(async (customUser) => {
                    if (customUser.type === 'user') {
                        const user = await fetchUser(customUser.data?.uid!);
                        if (user) {
                            return {
                                type: 'user',
                                data: {
                                    uid: user?.uid ?? '',
                                    username: user?.username ?? '',
                                    first_name: user?.first_name ?? '',
                                    last_name: user?.last_name ?? '',
                                    email: user?.email ?? '',
                                }
                            };
                        }
                        return {
                            type: 'user', data: {
                                uid: customUser.data?.uid ?? '',
                                username: customUser.data?.username ?? '',
                                first_name: customUser.data?.first_name ?? '',
                                last_name: customUser.data?.last_name ?? '',
                                email: customUser.data?.email ?? '',
                            }
                        };
                    }

                    if (customUser.type === 'expert') {
                        const expert = await fetchExpertById(customUser.data?.uid!);
                        if(expert) {
                            return {
                                type: 'expert',
                                data: {
                                    uid: expert?.uid ?? '',
                                    // @ts-ignore
                                    username: `${expert?.name?.first_name ?? ''} ${expert?.name?.middle_name ?? ''} ${expert?.name?.last_name ?? ''} ${expert?.name?.extension ?? ''}`.trim(),
                                    // @ts-ignore
                                    first_name: expert?.name?.first_name ?? '',
                                    // @ts-ignore
                                    last_name: expert?.name?.last_name ?? '',
                                    email: ''
                                }
                            };
                        } else {
                            return {
                                type: 'expert', data: {
                                    uid: customUser.data?.uid ?? '',
                                    username: customUser.data?.username ?? '',
                                    first_name: customUser.data?.first_name ?? '',
                                    last_name: customUser.data?.last_name ?? '',
                                    email: customUser.data?.email ?? '',
                                }
                            };
                        }

                    }
                    // Default case
                    return {
                        type: 'custom',
                        data: {
                            uid: '',
                            username: customUser.data?.username ?? '',
                            first_name: customUser.data?.first_name ?? '',
                            last_name: customUser.data?.last_name ?? '',
                            email: ''
                        }
                    };
                })
            );
        } catch (e: any) {
            console.error(e);
            return [];
        }
    };

    return {mapCustomUsers};
}