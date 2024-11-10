<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import AddMemberDialog from "../components/AddMemberDialog.vue";
import AccessLeveLInfoDialog from "../components/AccessLeveLInfoDialog.vue";
import {PhDotsThreeOutlineVertical, PhInfo, PhMagnifyingGlass, PhPencil, PhTrash} from "@phosphor-icons/vue";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {useOrganizationMembersServices} from "../services/organization-members.services.ts";
import {watch} from "vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import jsPDF from 'jspdf';
import DOMPurify from 'dompurify';
import {useOrgType} from "../composables/useOrgType.ts";

const {route} = useRouting()
const {organization} = useOrganizationStore();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchOrgMembers, removeOrgMember} = useOrganizationMembersServices()
const {getOrganizationType, getOrganizationSubType} = useOrgType()
const loading = ref(false)
const {userData} = useUserStore();
const searchQuery = ref('')
const memberActionMenu = ref(false)
const path = ref('organizations')
const orgMemberData = ref<OrgMember[]>([])
const orgMembers = ref<OrgMember[]>([])
const userOrgInfo = ref<OrgMember | null | undefined>(null)

const stripHtml = (html: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = DOMPurify.sanitize(html);
  return temp.textContent || temp.innerText || '';
};

const wrapText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, align: 'left' | 'justify' = 'left'): number => {
  const words = text.split(' ');
  const lineHeight = doc.getTextDimensions('Text').h * 1.5;
  let currentLine = '';
  let currentY = y;

  words.forEach((word, index) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testLineWidth = doc.getTextWidth(testLine);

    if (testLineWidth > maxWidth) {
      // For justified text, we need to calculate word spacing
      if (align === 'justify' && index < words.length - 1) {
        const words = currentLine.split(' ');
        const spaces = words.length - 1;
        if (spaces > 0) {
          const spaceWidth = (maxWidth - doc.getTextWidth(currentLine.replace(/ /g, ''))) / spaces;
          let xPos = x;
          words.forEach((word) => {
            doc.text(word, xPos, currentY);
            xPos += doc.getTextWidth(word) + spaceWidth;
          });
        } else {
          doc.text(currentLine, x, currentY);
        }
      } else {
        doc.text(currentLine, x, currentY);
      }
      currentY += lineHeight;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  // Print the last line
  if (currentLine) {
    doc.text(currentLine, x, currentY);
  }

  return currentY + lineHeight;
};

const formatLabelAndContent = (doc: jsPDF, label: string, content: string, x: number, y: number, maxWidth: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.text(label, x, y);

  const labelWidth = doc.getTextWidth(label);
  doc.setFont('helvetica', 'normal');

  // If content is too long, wrap it
  if (doc.getTextWidth(content) > maxWidth - labelWidth) {
    return wrapText(doc, content, x + labelWidth, y, maxWidth - labelWidth);
  } else {
    doc.text(content, x + labelWidth, y);
    return y + 7;
  }
};

const downloadOrganizationDataPDF = async (organization: Organization) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;

// Header Section with blue background
  doc.setFillColor(0, 123, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F'); // Draws a filled rectangle for the header

// Repository title in white
  doc.setTextColor(255, 255, 255); // Set text color to white
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);

// Split text to fit within the page width for wrapping
  const titleLines = doc.splitTextToSize(`${organization.name} (${organization.acronym})`, doc.internal.pageSize.width - 2 * margin);
  doc.text(titleLines, margin, 25);

// Reset text color for body
  doc.setTextColor(0, 0, 0);
  currentY = 60;

  // Contact Information Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const contactInfo = [
    `President: ${organization.president}`,
    `Telephone: ${organization.tel_phone || 'N/A'}`,
    `Cell Number: ${organization.phone || 'N/A'}`,
    `Email: ${organization.email || 'N/A'}`,
    `Website: ${organization.website || 'N/A'}`
  ];

  contactInfo.forEach(info => {
    const infoWidth = doc.getTextWidth(info);
    if (infoWidth > contentWidth) {
      currentY = wrapText(doc, info, margin, currentY, contentWidth);
    } else {
      doc.text(info, margin, currentY);
      currentY += 7;
    }
  });

  currentY += 5;

  // About Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('About Organization', margin, currentY);
  currentY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const cleanDescription = stripHtml(organization.description);
  currentY = wrapText(doc, cleanDescription, margin, currentY, contentWidth, 'justify');

  currentY += 15;

  // Check if we need a new page
  if (currentY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Consortium Type', margin, currentY);
  currentY += 10;

  doc.setFontSize(12);
  currentY = formatLabelAndContent(
      doc,
      'Organization Type: ',
      getOrganizationType(<number>organization.org_type) || 'N/A',
      margin,
      currentY,
      contentWidth
  );

  currentY = formatLabelAndContent(
      doc,
      'Organization Sub Type: ',
      getOrganizationSubType(<number>organization.sub_org_type) || 'N/A',
      margin,
      currentY,
      contentWidth
  );


  currentY += 8;

  // Check if we need a new page for representatives
  if (currentY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    currentY = margin;
  }

  // Representatives Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Cluster Representatives', margin, currentY);
  currentY += 10;

  doc.setFontSize(12);
  const representatives = [
    { title: 'Research & Development', rep: organization.rd_rep },
    { title: 'Technology Transfer', rep: organization.tt_rep },
    { title: 'Information Communication', rep: organization.ic_rep },
    { title: 'Science Communication', rep: organization.sc_rep }
  ];

  representatives.forEach(({ title, rep }) => {
    if (currentY > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = margin;
    }

    const repInfo = `${rep.full_name || 'N/A'}${rep.email ? ` | ${rep.email}` : ''}`;
    const availableWidth = contentWidth - (margin + 70); // Space available for the info

    doc.setFont('helvetica', 'bold');
    doc.text(`${title}:`, margin, currentY);
    doc.setFont('helvetica', 'normal');

    if (doc.getTextWidth(repInfo) > availableWidth) {
      // Split the text into lines that fit the available width
      const words = repInfo.split(' ');
      let currentLine = '';
      let firstLine = true;

      words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (doc.getTextWidth(testLine) > availableWidth) {
          // Print the current line
          doc.text(currentLine, firstLine ? margin + 70 : margin + 70, currentY);
          currentY += 7;
          currentLine = word;
          firstLine = false;
        } else {
          currentLine = testLine;
        }
      });

      // Print the last line
      if (currentLine) {
        doc.text(currentLine, firstLine ? margin + 70 : margin + 70, currentY);
        currentY += 7;
      }

      // Add some extra spacing after wrapped text
      currentY += 3;
    } else {
      // No wrapping needed
      doc.text(repInfo, margin + 70, currentY);
      currentY += 7;
    }
  });

  // Save the PDF
  doc.save(`${organization.name}-Info.pdf`);
};


const filterOrganizationMembersBySearchQuery = () => {
  if(searchQuery.value) {
    orgMembers.value = orgMemberData.value.filter(member => member.user.username.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    orgMembers.value = orgMemberData.value
  }
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

watch(() => searchQuery.value, () => {
  filterOrganizationMembersBySearchQuery()
});


const fetchMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Added Successfully', Status.success)
}

const updateMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Updated Successfully', Status.success)
  memberActionMenu.value = false
}

const deleteMemberCallback = async (member: OrgMember) => {
  await removeOrgMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
}


const fetchMembers = async () => {
  const data = await fetchOrgMembers(<string>route.params.slug)
  orgMembers.value = data
  orgMemberData.value = data
}

onMounted(async () => {
  loading.value = true
  const allUserOrg = await fetchOrganizationByUser();
  path.value = getFirstPath(<string>route.path)
  await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
  await fetchMembers()
  userOrgInfo.value = orgMembers.value.find(member => member.user.uid === userData.uid);
  loading.value = false
})
</script>

<template>
  <OrganizationDetailsLayout
    :organization="organization"
    activeTab="settings">
    <div v-if="loading" class="loading-state-container mt-15">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="organization" class="py-6 px-7">
        <VRow  class="ma-0" justify="space-between" align="center">
          <div>
            <p class="section-title">Download Organization Information</p>
            <p class="text-gs20 mb-2" style="font-size: 14px;">Download the Organization Information in PDF</p>
          </div>
          <VBtnPrimaryFilled
              @click="downloadOrganizationDataPDF(organization)"
              height="41px"
              rounded="lg"
              class="satoshi-md"
              style="font-size: 14px !important;">
            Download Organization Info
          </VBtnPrimaryFilled>
        </VRow>
        <div v-if="organization.is_member">
          <VDivider v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager'" class="my-5"/>
          <div v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager'" class="mt-2">
            <VRow  class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Update Organization Information</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your organization details and information</p>
              </div>
              <VBtnPrimaryFilled
                  :to="{ name: path == 'organizations' ? 'edit-organization' : 'edit-organization-my', params: {slug: organization?.slug}}"
                  height="41px"
                  rounded="lg"
                  class="satoshi-md"
                  style="font-size: 14px !important;">
                Update Organization Info
              </VBtnPrimaryFilled>
            </VRow>
          </div>
          <VDivider v-if="organization?.is_member" class="my-5"/>
          <div class="mt-2">
            <VRow v-if="organization?.is_member" class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Organization Members</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage organization members and their roles. <AccessLeveLInfoDialog/></p>
              </div>
              <AddMemberDialog :form-type="FormType.create" v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager'" @callback="fetchMembersCallback">
                <VBtnPrimaryFilled  height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                  Add Member
                </VBtnPrimaryFilled>
              </AddMemberDialog>
            </VRow>
            <VTextField
                class="my-3"
                v-model="searchQuery"
                hide-details
                variant="outlined"
                rounded="xl"
                density="comfortable"
                color="primary"
                base-color="gs60"
            >
              <template v-slot:prepend-inner>
                <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
              </template>
              <template v-slot:label>
                <p class="text-gs20">Find members</p>
              </template>
            </VTextField>
            <div class="my-5 mx-1" v-if="orgMembers.length > 0">
              <div
                  v-for="member in orgMembers"
                  :key="member.membership_uid"
              >
                <VRow v-if="!member.is_deleted" class="ma-0 my-3" justify="space-between" align="center">
                  <div class="d-flex align-center">
                    <VAvatar
                        size="40"
                        class="mr-1 cursor-pointer"
                    >
                      <VImg :src="member.user.profile_picture ?? 'https://dummyimage.com/400x400/023768/fff.png&text=N/A'"></VImg>
                    </VAvatar>
                    <div class="mr-2">
                      <p class="text-name text-container">{{member.user.username}}</p>
                      <p class="text-name-subtitle">{{member.user.email}} · {{member.access_level}}</p>
                    </div>
                  </div>
                  <VMenu
                      v-if="member.user.uid != userData.uid && (userOrgInfo?.access_level == 'owner' || userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager') && member.access_level != 'owner' && !(userOrgInfo?.access_level === 'manager' && (member.access_level === 'owner' || member.access_level === 'admin'))"
                      location="bottom"
                      :close-on-content-click="false"
                  >
                    <template #activator="{ props }">
                      <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                        Options
                        <PhDotsThreeOutlineVertical weight="fill"/>
                      </p>
                    </template>
                    <VSheet width="200" class="rounded-b-lg py-2">
                      <AddMemberDialog
                          :form-type="FormType.edit"
                          :member="member"
                          :user-access-level="userOrgInfo?.access_level"
                          @callback="updateMembersCallback"
                      >
                        <p class="cursor-pointer action-menu-item">
                          <PhPencil/>
                          Edit Access
                        </p>
                      </AddMemberDialog>
                      <DeleteDialog @callback="deleteMemberCallback(member)">
                        <p class="cursor-pointer action-menu-item">
                          <PhTrash/>
                          Remove User
                        </p>
                      </DeleteDialog>
                    </VSheet>
                  </VMenu>
                </VRow>
                <VDivider v-if="!member.is_deleted" class="mt-3"/>
              </div>
            </div>
            <div class="my-5 mx-1" v-else>
              <p class="d-flex align-center justify-center">
                <PhInfo class="mr-1"/>No Organization Members Found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.action-button{
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover{
  background-color: #F0F5F9;
}

.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.action-menu-item:hover{
  background-color: #e0e3e3;
}

.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.text-name{
  font-size: 16px !important;
  font-weight: 700 !important;
}

.text-name-subtitle{
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 0.75;
}

</style>