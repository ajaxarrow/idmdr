<script setup lang="ts">

import organizations from "../../data/organizations.ts";
import {useSnackbarStore} from "../stores/snackbar.store.ts";
import {Status} from "../../interfaces/enums/status.enum.ts";
import MainLayout from "../layouts/MainLayout.vue";
import {useUserStore} from "../stores/user.store.ts";
import {server} from "../../plugins/axios.ts";
import {Organization} from "../../interfaces/organization.interface.ts";

const {userData} = useUserStore()
const {showSnackbarMessage} = useSnackbarStore()

const addMemberToOrganization = async(orgID: string) => {
  try {
    await server.post(`/v1/user/${userData.uid}/organizations`, {
      user: userData.uid,
      organization: orgID,
      access_level: 'admin'
    }, {
      headers: {
        'Authorization': `Bearer ${userData.accessToken}`
      }
    });
    // console.log(res.data);
  } catch (e: any) {
    showSnackbarMessage('OOPS! Something went wrong', Status.error);
    // console.log(e.response?.data);
    return;
  }
}

const seedOrg = async (organization: Organization, endpoint: string,) => {
  const res = await (server.post)(
      endpoint,
      {
        sub_org_type: organization.sub_org_type,
        description: organization.description,
        president: organization.president,
        visibility: organization.visibility,
        org_type: organization.org_type,
        name: organization.name,
        acronym: organization.acronym,
        address: organization.address,
        phone: organization.phone,
        email: organization.email,
        website: organization.website,
        geojson: organization.geojson,
        rdc_rep: organization.rd_rep,
        ttc_rep: organization.tt_rep,
        icc_rep: organization.ic_rep,
        scc_rep: organization.sc_rep,
      },
      {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      }
  );

  await addMemberToOrganization(res.data.uid);
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function seedData() {
  for (const org of organizations) {
    await seedOrg(org, `/v1/organization/`);
    await delay(1000); // Add a 1-second delay between each call (adjust as needed)
  }

  showSnackbarMessage('Seeding Data Done!', Status.success);
  window.location.href = '/my-organizations';
}


</script>

<template>
  <MainLayout>
    <div class="center">
      <VBtn @click="seedData">Seed</VBtn>
    </div>
  </MainLayout>
</template>

<style scoped>

</style>