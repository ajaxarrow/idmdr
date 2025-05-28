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
                .map((user: any) => ({
                    uid: user.uid,
                    username: user.username ?? `${user.first_name} ${user.last_name}`,
                    first_name: user.first_name ?? user.username,
                    last_name: user.last_name,
                    email: user.email,
                    is_active: user.is_active,
                    is_superuser: user.is_superuser,
                    is_approved: user.is_approved,
                    profile_picture: user.profile_picture ? user.profile_picture : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
                }));
        } catch {
            return [];
        }
    }

    const fetchTotalUsers = async (
        pageNumber: number,
        pageSize: number,
        searchQuery?: string,
        isApproved?: string | boolean,
        isActive?: string | boolean,
    ): Promise<number> => {
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
            return res.data.results.length
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

    const manageAdminPrivileges = async (uid: string, value: boolean) => {
        try {
            await server.patch(`/users/${uid}`, {
                is_superuser: value,
            }, {
                headers: authorizationHeader,
            });
        } catch (e) {
            console.log(e);
        }
    }

    return {fetchAllUsers, fetchTotalUsers, manageUserStatus, manageAdminPrivileges};

};