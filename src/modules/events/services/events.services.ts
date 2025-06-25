import {useUserStore} from "../../../core/stores/user.store.ts";
import {ref} from "vue";
import {server} from "../../../plugins/axios.ts";
import {OrganizationEvent} from "../../../interfaces/organization.interface.ts";

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}

export const useEventsServices = () => {
  const loading = ref(false);

  const saveEvent = async (event: OrganizationEvent, endpoint: string, type: string) => {
    loading.value = true;
    try {
      await (type === 'create' ? server.post : server.put)(endpoint, event, {
        headers: authorizationHeader
      });
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.error(error);
    }
  }

  const addEvent = async (event: OrganizationEvent) => {
    await saveEvent(event, '/events/', 'create');
  }

  const updateEvent = async (event: OrganizationEvent) => {
    await saveEvent(event, `/events/${event.uid}/`, 'update');
  }

  const deleteEvent = async (id: string) => {
    try {
      await server.delete(`/events/${id}/`, {
        headers: authorizationHeader
      });
    } catch (error) {
      console.error(error);
    }
  }

  const fetchEvents = async (): Promise<OrganizationEvent[]> => {
    try {
      const res = await server.get('/events/?page_size=1000', {
        headers: authorizationHeader
      });
      return res.data.map((event: any) => mapEventData(event));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const fetchEventByID = async (id: string): Promise<OrganizationEvent | null> => {
    try {
      const res = await server.get(`/events/${id}/`, {
        headers: authorizationHeader
      });
      return mapEventData(res.data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const fetchEventsByOrganization = async (id: string): Promise<OrganizationEvent[]> => {
    try {
      const res = await server.get(`/events/?organization=${id}`, {
        headers: authorizationHeader
      });
      return res.data.map((event: any) => mapEventData(event));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const mapEventData = (event: any) => {
    return {
      uid: event.uid,
      title: event.title,
      description: event.description,
      repository: event.repository.uid,
      repositoryData: event.repository,
      organization: event.organization ? event.organization.uid : '',
      organizationData: event.organization,
      start_date: event.start_date,
      end_date: event.end_date,
      start_date_object: JSON.parse(event.start_date),
      end_date_object: JSON.parse(event.end_date),
      created_at: event.created_at,
      updated_at: event.updated_at,
      created_by: event.created_by,
      is_deleted: event.is_deleted
    }
  }

  return{
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    fetchEventsByOrganization,
    fetchEventByID
  }
}