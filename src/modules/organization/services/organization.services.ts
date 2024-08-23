import {Organization} from "../../../interfaces/organization.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";

export const useOrganizationServices = () => {
  const {userData} = useUserStore();
  const addOrganization = async (organization: Organization) => {
    try{
      const res = await server.post('/v1/organization', {
        is_public: organization.is_public,
        name: organization.name,
        acronym: organization.acronym,
        // slug: organization.slug,
        // description: organization.description,
        // geojson: organization.geojson,
        // image: organization.image,
        // type: organization.type,
        address: organization.address,
        // tel: organization.tel,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        // president: organization.president,

        rdc_rep: {
          name: organization.rd_rep?.name,
          email: organization.rd_rep?.email,
          phone: organization.rd_rep?.phone
        },
        ttc_rep: {
          name: organization.tt_rep?.name,
          email: organization.tt_rep?.email,
          phone: organization.tt_rep?.phone
        },
        icc_rep: {
          name: organization.ic_rep?.name,
          email: organization.ic_rep?.email,
          phone: organization.ic_rep?.phone
        },
        scc_rep: {
          name: organization.sc_rep?.name,
          email: organization.sc_rep?.email,
          phone: organization.sc_rep?.phone
        }
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });

      console.log(res.data)
    } catch (e) {
      console.log (e)
    }
  }

  const updateOrganization = async (organization: Organization, id: string) => {
    try{
      const res = await server.post(`/v1/organization/${id}/update`, {
        is_public: organization.is_public,
        name: organization.name,
        acronym: organization.acronym,
        // slug: organization.slug,
        // description: organization.description,
        // geojson: organization.geojson,
        // image: organization.image,
        // type: organization.type,
        address: organization.address,
        // tel: organization.tel,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        // president: organization.president,

        rdc_rep: {
          name: organization.rd_rep?.name,
          email: organization.rd_rep?.email,
          phone: organization.rd_rep?.phone
        },
        ttc_rep: {
          name: organization.tt_rep?.name,
          email: organization.tt_rep?.email,
          phone: organization.tt_rep?.phone
        },
        icc_rep: {
          name: organization.ic_rep?.name,
          email: organization.ic_rep?.email,
          phone: organization.ic_rep?.phone
        },
        scc_rep: {
          name: organization.sc_rep?.name,
          email: organization.sc_rep?.email,
          phone: organization.sc_rep?.phone
        }
      }, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });

      console.log(res.data)
    } catch (e) {
      console.log (e)
    }
  }


  return {
    addOrganization,
    updateOrganization
  }
}