import {useUserStore} from "../../../core/stores/user.store.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {server} from "../../../plugins/axios.ts";
import {Notification} from "../../../interfaces/notification.interface.ts"

const { userData, user } = useUserStore();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {stringToArray} = useStringArrayHelper()

export const useNotificationsServices = () => {

  const saveNotification = async (notification: Notification, endpoint: string, type: string) => {
    try {
      await (type === 'create' ? server.post : server.patch)(
        endpoint,
        notification, {
          headers: authorizationHeader
        }
      );
    } catch (e: any) {
      console.log(e)
    }
  }

  const addNotification = async (notification: Notification) => {
    await saveNotification(notification, '/notification/', 'create')
  }

  const updateNotification = async (notification: Notification, id: string) => {
    await saveNotification(notification, `/notification/${id}/`, 'update')
  }

  const fetchNotificationsByReceiver = async (): Promise<Notification[]> => {
    try {
      const res = await server.get(`/notification/?receiver=${userData.uid}`, {
        headers: authorizationHeader
      })
      return res.data.map((notif: any) => {
        return mapNotificationData(notif)
      })
    } catch (e: any) {
      console.log(e)
      return []
    }
  }

  const isThereUnreadNotif = async (): Promise<boolean> => {
    try {
      const notifications = (await fetchNotificationsByReceiver()).filter(notif => notif.is_read === false)
      return notifications.length > 0;
    } catch (e: any) {
      console.log(e)
      return false;
    }
  }


  const mapNotificationData = (notification: Notification) => {
    return {
      pk: notification.pk,
      sender: notification.sender,
      receiver: stringToArray(<string>notification.receiver),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      content_type: notification.content_type,
      object_id: notification.object_id,
      created_at: notification.created_at,
      updated_at: notification.updated_at,
      is_read: notification.is_read,
      is_deleted: notification.is_deleted
    }
  }

  return {
    addNotification,
    updateNotification,
    fetchNotificationsByReceiver,
    isThereUnreadNotif
  }
}