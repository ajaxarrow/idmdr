import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {Attachment} from "../../../interfaces/repository.interface.ts";

const { userData } = useUserStore();
export const useRepositoryAttachmentServices = () => {
  const saveAttachment = async (attachment: Attachment, endpoint: string, type: string) => {
    try {
      await (type === 'create' ? server.post : server.patch)(endpoint, attachment, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  const addAttachment = async(attachment: Attachment)=> {
    await saveAttachment(attachment, `/v1/repository/attachments/`, 'create')
  }

  const updateAttachment = async(attachment: Attachment)=> {
    await saveAttachment(attachment, `/v1/repository/attachments/${attachment.uid}/`, 'update')
  }

  const fetchAttachmentsByRepository = async(repositoryId: string, type: string = 'create'): Promise<Attachment[]> => {
    try {
      const res = await server.get(`/v1/repository/attachments/?repository=${repositoryId}`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      });

      return res.data.map((attachment: any)=> {
        return {
          uid: attachment.uid,
          repository: attachment.repository,
          attachment: attachment.attachment,
          file_type: attachment.file_type,
          mime_type: attachment.mime_type,
          name: attachment.name,
          description: attachment.description,
          created_at: attachment.created_at,
          updated_at: attachment.updated_at,
          is_deleted: attachment.is_deleted,
          deleted_at: attachment.deleted_at,
          visibility: attachment.visibility,
          type: type == 'create' ? 'create' : 'update',
        }
      })
    } catch (e) {
      console.log(e);
      return []
    }
  }


  const deleteAttachment = async(id: string) => {
    try {
      await server.delete(`/v1/repository/attachments/${id}/`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return{
    addAttachment,
    updateAttachment,
    fetchAttachmentsByRepository,
    deleteAttachment
  }
}
