<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import AddMemberDialog from "../components/AddMemberDialog.vue";
import AccessLeveLInfoDialog from "../components/AccessLeveLInfoDialog.vue";
import {
  PhArrowDown,
  PhDotsThreeOutlineVertical,
  PhInfo,
  PhMagnifyingGlass,
  PhPencil,
  PhTrash, PhWarning
} from "@phosphor-icons/vue";
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
import ChangeVisibilityDialog from "../../../core/components/ChangeVisibilityDialog.vue";
import {useVisibilityHelper} from "../../../core/composables/useVisibilityHelper.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";

const {route} = useRouting()
const {organization} = useOrganizationStore();
const currentOrg = ref<Organization | null>(null)
const {showSnackbarMessage} = useSnackbarStore();
const {fetchOrganizationData, fetchOrganizationIDsByUser, manageOrgStatus} = useOrganizationServices();
const {fetchOrgMembers, removeOrgMember} = useOrganizationMembersServices()
const {getOrganizationType, getOrganizationSubType} = useOrgType()
const {getVisibilityLabel} = useVisibilityHelper()
const overlayLoading = ref(false);
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


const downloadOrganizationDataPDF = async (organization: Organization) => {
  // Initialize PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Define minimal color palette
  const colors = {
    primary: "#2c3e50",    // Dark blue-gray
    accent: "#3498db",     // Blue accent
    text: "#333333",       // Text color
    light: "#f8f9fa",      // Light background
    white: "#FFFFFF"
  };

  // Set up document variables
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = 40;

  // Helper function to add page numbers
  const addPageNumber = (doc: any) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(colors.text);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    }
  };

  // Helper function to add simple header and footer
  const addHeaderAndFooter = (doc: any) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Minimal header - just a thin line
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, 20, pageWidth - margin, 20);

      // Footer with thin line
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      // Add date in footer
      doc.setFontSize(9);
      doc.setTextColor(colors.text);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, margin, pageHeight - 10);
    }
  };

  // Cover page - clean and minimal
  doc.setFillColor(colors.white);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Simple accent bar
  doc.setFillColor(colors.accent);
  doc.rect(0, 0, 10, pageHeight, 'F');

  // Title on cover page
  doc.setTextColor(colors.primary);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');

  const titleLines = doc.splitTextToSize(`${organization.name} (${organization.acronym})`, pageWidth - (margin * 4));
  doc.text(titleLines, margin + 10, pageHeight/3);

  // Organization type
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(getOrganizationType(<number>organization.org_type) || 'Organization', margin + 10, pageHeight/3 + 30);

  // President info
  if (organization?.president) {
    doc.setFontSize(14);
    doc.text(`President: ${organization.president}`, margin + 10, pageHeight/3 + 40);
  }

  // Add new page for content
  doc.addPage();
  currentY = 40;

  // Table of contents
  doc.setTextColor(colors.primary);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, currentY);
  currentY += 10;

  const sections = ['Contact Information', 'About Organization', 'Consortium Type', 'Cluster Representatives'];

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.text);
  sections.forEach((section, index) => {
    doc.text(`${index + 1}. ${section}`, margin + 5, currentY);
    currentY += 7;
  });

  currentY += 15;

  // Contact Information Section
  doc.addPage();
  currentY = 40;

  // Simple section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('Contact Information', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 60, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Contact items in single column for clarity
  const contactItems = [
    { label: 'President:', content: organization.president || 'N/A' },
    { label: 'Telephone:', content: organization.tel_phone || 'N/A' },
    { label: 'Cell Number:', content: organization.phone || 'N/A' },
    { label: 'Email:', content: organization.email || 'N/A' },
    { label: 'Website:', content: organization.website || 'N/A' }
  ];

  contactItems.forEach(({ label, content }) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, currentY);
    doc.setFont('helvetica', 'normal');

    if (content && doc.getTextWidth(content) > contentWidth - 70) {
      currentY = wrapText(doc, content, margin + 70, currentY, contentWidth - 70);
    } else {
      doc.text(content, margin + 70, currentY);
      currentY += 8;
    }
  });

  // About Organization Section
  currentY += 10;
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 40;
  }

  // Section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('About Organization', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 60, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const cleanDescription = stripHtml(organization.description);
  currentY = wrapText(doc, cleanDescription, margin, currentY, contentWidth);

  // Consortium Type Section
  currentY += 10;
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 40;
  }

  // Section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('Consortium Type', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 50, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);

  // Organization type items in single column
  const typeItems = [
    { label: 'Organization Type:', content: getOrganizationType(<number>organization.org_type) || 'N/A' },
    { label: 'Organization Sub Type:', content: getOrganizationSubType(<number>organization.sub_org_type) || 'N/A' }
  ];

  typeItems.forEach(({ label, content }) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, currentY);
    doc.setFont('helvetica', 'normal');

    if (content && doc.getTextWidth(content) > contentWidth - 70) {
      currentY = wrapText(doc, content, margin + 70, currentY, contentWidth - 70);
    } else {
      doc.text(content, margin + 70, currentY);
      currentY += 8;
    }
  });

  // Cluster Representatives Section
  currentY += 10;
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 40;
  }

  // Section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('Cluster Representatives', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 70, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);

  // Representatives in single column with improved formatting
  const representatives = [
    { title: 'Research & Development', rep: organization.rd_repData },
    { title: 'Technology Transfer', rep: organization.tt_repData },
    { title: 'Information Communication', rep: organization.ic_repData },
    { title: 'Science Communication', rep: organization.sc_repData }
  ];

  representatives.forEach(({ title, rep }) => {
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 40;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${title}:`, margin, currentY);
    doc.setFont('helvetica', 'normal');

    const repInfo = rep?.length === 0 ?
        'N/A' : rep?.map((owner) => `${owner?.data?.first_name} ${owner?.data?.last_name}`).filter(Boolean).join(', ')

    if (repInfo && doc.getTextWidth(repInfo) > contentWidth - 70) {
      currentY = wrapText(doc, repInfo, margin + 70, currentY, contentWidth - 70);
    } else {
      doc.text(repInfo!, margin + 70, currentY);
      currentY += 8;
    }
  });

  // Add minimal header, footer and page numbers
  addHeaderAndFooter(doc);
  addPageNumber(doc);

  // Save the PDF
  doc.save(`${organization.name}-Info.pdf`);
};

const filterOrganizationMembersBySearchQuery = () => {
  if(searchQuery.value) {
    orgMembers.value = orgMemberData.value.filter(member => member.user.first_name?.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) || member.user.last_name?.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
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
  loading.value = true
  await fetchMembers()
  showSnackbarMessage('Member Added Successfully', Status.success)
  loading.value = false
}

const updateMembersCallback = async () => {
  loading.value = true
  await fetchMembers()
  showSnackbarMessage('Member Updated Successfully', Status.success)
  memberActionMenu.value = false
  loading.value = false
}

const deleteMemberCallback = async (member: OrgMember) => {
  loading.value = true
  await removeOrgMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
  loading.value = false
}

const changeVisibilityCallback = (newVisibility: number) => {
  showSnackbarMessage("CMI Visibility Changed Successfully", Status.success)
  organization!.value!.visibility = newVisibility
}

const manageOrgStatusCallback = async (isActive: boolean) => {
  overlayLoading.value = true
  await manageOrgStatus(route.params.slug as string, isActive)
  overlayLoading.value = false
  showSnackbarMessage("Project Visibility Changed Successfully", Status.success)
  organization!.value!.is_active = isActive!
}

const fetchMembers = async () => {
  const data = await fetchOrgMembers(<string>route.params.slug)
  orgMembers.value = data
  orgMemberData.value = data
}

// const deleteOrgCallback = async () => {
//   overlayLoading.value = true
//   await deleteOrganization(route.params.slug as string)
//   overlayLoading.value = false
//   await router.push({ name: 'my-organizations' })
// }

onMounted(async () => {
  loading.value = true
  const allUserOrg = await fetchOrganizationIDsByUser();
  path.value = getFirstPath(<string>route.path)
  currentOrg.value = await fetchOrganizationData(route.params.slug as string);

  if(currentOrg.value){
    if( isSlugInOrgList(currentOrg.value, allUserOrg) || userData.is_superuser){
      if ("is_member" in currentOrg.value) {
        currentOrg.value.is_member = true;
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
      <VAlert
          v-if="currentOrg && !currentOrg.is_active"
          color="#ff9800"
          variant="tonal"
          border="start"
          class="inactive-repo-banner mb-4"
      >
        <div class="d-flex align-center">
          <div class="warning-icon-container me-3">
            <PhWarning size="24" weight="fill" class="warning-icon" />
          </div>
          <div class="warning-content">
            <VAlert-title class="warning-title">
              CMI Is Currently Inactive
            </VAlert-title>
            <div class="warning-message">
              This CMI is not visible to the public. Only members can view it.
              <a v-if="userOrgInfo?.access_level == 'owner'" href="#organization-status" class="status-link">
                Change status now <PhArrowDown class="ms-1" />
              </a>
            </div>
          </div>
        </div>
      </VAlert>
      <div v-if="currentOrg" class="py-6 px-7">
        <VRow  class="ma-0" justify="space-between" align="center">
          <div>
            <p class="section-title">Download Consortium Member Institution Information</p>
            <p class="text-gs20 mb-2" style="font-size: 14px;">Download the Consortium Member Institution Information in PDF</p>
          </div>
          <VBtnPrimaryFilled
              @click="downloadOrganizationDataPDF(currentOrg)"
              height="41px"
              rounded="lg"
              class="satoshi-md"
              style="font-size: 14px !important;">
            Download CMI Info
          </VBtnPrimaryFilled>
        </VRow>
        <div v-if="currentOrg.is_member || userData.is_superuser">
          <VDivider v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
          <div v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="mt-2">
            <VRow  class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Update CMI Visibility (Current Visibility: {{getVisibilityLabel(organization?.visibility as number)}})</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your consortium member institution visibility</p>
              </div>
              <ChangeVisibilityDialog
                  :id="<string>organization?.uid!"
                  :visibility="organization?.visibility"
                  type="organization"
                  @callback="changeVisibilityCallback"
              >
                <VBtnPrimaryFilled
                    height="41px"
                    rounded="lg"
                    class="satoshi-md"
                    style="font-size: 14px !important;">
                  Change CMI Visibility
                </VBtnPrimaryFilled>
              </ChangeVisibilityDialog>
            </VRow>
          </div>
          <VDivider v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
          <div v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="mt-2">
            <VRow  class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Update Consortium Member Institution Information</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your consortium member institution details and information</p>
              </div>
              <VBtnPrimaryFilled
                  :to="{ name: path == 'organizations' ? 'edit-organization' : 'edit-organization-my', params: {slug: organization?.slug}}"
                  height="41px"
                  rounded="lg"
                  class="satoshi-md"
                  style="font-size: 14px !important;">
                Update CMI Info
              </VBtnPrimaryFilled>
            </VRow>
          </div>
          <VDivider v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
          <div v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" class="mt-2">
            <VRow  class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Upload CMI Files</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Upload files to your consortium member institution</p>
              </div>
              <VBtnPrimaryFilled
                  :to="{ name: path == 'organizations' ? 'upload-files-organizations' : 'upload-files-organizations-my', params: {slug: organization?.slug}}"
                  height="41px"
                  rounded="lg"
                  class="satoshi-md"
                  style="font-size: 14px !important;">
                Update CMI Files
              </VBtnPrimaryFilled>
            </VRow>
          </div>
          <VDivider v-if="currentOrg?.is_member || userData.is_superuser" class="my-5"/>
          <div class="mt-2">
            <VRow v-if="currentOrg?.is_member || userData.is_superuser" class="ma-0" justify="space-between" align="center">
              <div>
                <p class="section-title">Consortium Member Institution Members</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage consortium member institution members and their roles. <AccessLeveLInfoDialog/></p>
              </div>
              <AddMemberDialog :form-type="FormType.create" v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager' || userData.is_superuser" @callback="fetchMembersCallback">
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
                  v-for="(member, index) in orgMembers"
                  :key="member.membership_uid"
              >
                <VRow v-if="!member.is_deleted" class="ma-0 my-3" justify="space-between" align="center">
                  <div class="d-flex align-center">
                    <VAvatar
                        size="40"
                        class="mr-1 cursor-pointer"
                    >
                      <VImg :src="member.user.profile_picture ?? 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"></VImg>
                    </VAvatar>
                    <div class="mr-2">
                      <p class="text-name text-container">{{member.user.first_name}} {{member.user.last_name}}</p>
                      <p class="text-name-subtitle">{{member.user.email}} · {{member.access_level}}</p>
                    </div>
                  </div>
                  <VMenu
                      v-if="member.user.uid != userData.uid && (userOrgInfo?.access_level == 'owner' || userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'manager') && member.access_level != 'owner' && !(userOrgInfo?.access_level === 'manager' && (member.access_level === 'owner' || member.access_level === 'admin')) || userData.is_superuser"
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
                <VDivider v-if="!member.is_deleted && index !== orgMembers.length - 1" class="mt-3"/>
              </div>
            </div>
            <div class="my-5 mx-1" v-else>
              <p class="d-flex align-center justify-center">
                <PhInfo class="mr-1"/>No CMI Members Found
              </p>
            </div>
          </div>
          <VDivider v-if="userOrgInfo?.access_level == 'owner'|| userData.is_superuser" class="my-5"/>
          <div v-if="userOrgInfo?.access_level == 'owner'|| userData.is_superuser" class="mt-2" id="organization-status">
            <VRow  class="ma-0" justify="space-between" align="center">
              <div>
                  <p class="section-title">Manage Consortium Member Institution Status (Current Status: {{currentOrg.is_active ? 'Active' : 'Inactive'}})</p>
                <p class="text-gs20 mb-2" style="font-size: 14px;">This will change the status of consortium member institution</p>
              </div>
              <ConfirmationDialog
                  :isWarning="currentOrg?.is_active"
                  @callback="manageOrgStatusCallback(!currentOrg?.is_active)"
                  :confirm-content="currentOrg?.is_active ? 'Deactivate CMI' : 'Activate CMI'"
                  :content="currentOrg?.is_active ? 'Are you sure you want to deactivate this CMI? All CMI data not will be available to the public.' : 'Are you sure you want to activate this CMI?'"
              >
                <VBtnPrimaryFilled
                    height="41px"
                    rounded="lg"
                    class="satoshi-md"
                    :color="currentOrg?.is_active ? '#C83246' : '#01579B'"
                    style="font-size: 14px !important; color: white !important;">
                  {{currentOrg?.is_active ? 'Deactivate CMI' : 'Activate CMI'}}
                </VBtnPrimaryFilled>
              </ConfirmationDialog>
            </VRow>
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