import {User} from "../../../interfaces/member.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";

export const useUserManagementServices = () => {

    const { userData, user } = useUserStore();
    const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}

    const fetchAllUsers = async (
        pageNumber: number,
        pageSize: number,
        searchQuery?: string,
        isApproved?: string | boolean,
        isActive?: string | boolean,
    ): Promise<User[]> => {
        try {
            let url = `/users/?page=${pageNumber}&page_size=${pageSize}`;

            if (searchQuery?.trim()) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            if (typeof isApproved === 'boolean') {
                url += `&is_approved=${isApproved}`;
            }
            if (typeof isActive === 'boolean') {
                url += `&is_active=${isActive}`;
            }
            const res = await server.get(url, {
                headers: authorizationHeader
            });
            return res.data.results
                .filter((user: any) => user.uid != userData.uid)
                .map((user: any) => ({
                    uid: user.uid,
                    username: user.username ?? `${user.first_name} ${user.last_name}`,
                    first_name: user.first_name ?? user.username,
                    last_name: user.last_name,
                    email: user.email,
                    is_active: user.is_active,
                    is_approved: user.is_approved,
                    profile_picture: user.profile_picture ?? 'https://mighty.tools/mockmind-api/content/abstract/46.jpg',
                }));
        } catch {
            return [];
        }
    }

    const fetchTotalUsers = async (): Promise<number> => {
        try {
            const res = await server.get(`/users/?page_size=100000`, {
                headers: authorizationHeader,
            });
            return res.data.count - 1;
        } catch {
            return 0;
        }
    }

    const manageUserStatus = async (uid: string, value: boolean, forAccount: boolean) => {
        try {
            if(forAccount){
                await server.patch(`/users/${uid}`, {
                    is_active: value,
                }, {
                    headers: authorizationHeader,
                });
            } else {
                await server.patch(`/users/${uid}`, {
                    is_approved: value,
                }, {
                    headers: authorizationHeader,
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    return {fetchAllUsers, fetchTotalUsers, manageUserStatus};

};