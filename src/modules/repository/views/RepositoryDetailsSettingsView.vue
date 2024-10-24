<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useRepositoryMemberServices} from "../services/repository-member.services.ts";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {RepoMemberAccess, Repository} from "../../../interfaces/repository.interface.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import AccessLeveLInfoDialog from "../../organization/components/AccessLeveLInfoDialog.vue";
import {PhDotsThreeOutlineVertical, PhInfo, PhMagnifyingGlass, PhPencil, PhTrash} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import AddRepoMemberDialog from "../components/AddRepoMemberDialog.vue";
import jsPDF from 'jspdf';
import DOMPurify from 'dompurify';

const {userData} = useUserStore();
const {showSnackbarMessage} = useSnackbarStore();
const {repository} = useRepositoryStore();
const {fetchRepositoryData, fetchRepositoriesByUser} = useRepositoryServices()
const {fetchRepoMembers, removeRepoMember} = useRepositoryMemberServices()

const {route} = useRouting()
const loading = ref(false)
const searchQuery = ref('')
const memberActionMenu = ref(false)
const path = ref('repositories')
const repoMemberData = ref<OrgMember[]>([])
const repoMembers = ref<OrgMember[]>([])
const userRepoInfo = ref<OrgMember | null | undefined>(null)

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

  if (currentLine) {
    doc.text(currentLine, x, currentY);
  }

  return currentY + lineHeight;
};

const formatLabelAndContent = (doc: jsPDF, label: string, content: string | undefined, x: number, y: number, maxWidth: number): number => {
  if (!content) return y;

  doc.setFont('helvetica', 'bold');
  doc.text(label, x, y);

  const labelWidth = doc.getTextWidth(label);
  doc.setFont('helvetica', 'normal');

  if (doc.getTextWidth(content) > maxWidth - labelWidth) {
    return wrapText(doc, content, x + labelWidth, y, maxWidth - labelWidth);
  } else {
    doc.text(content, x + labelWidth, y);
    return y + 7;
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
};

const downloadRepositoryDataPDF = async (repository: Repository) => {
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
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Repository title in white
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(repository.title, margin, 25);

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  currentY = 50;

  // Basic Info Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const basicInfo = [
    `Owner: ${repository.owner?.username || 'N/A'}`,
    `Organization: ${repository.organizationData?.name || 'N/A'} (${repository.organizationData?.acronym || 'N/A'})`,
    `Last Updated: ${formatDate(<string>repository.updated_at)}`,
  ];

  basicInfo.forEach(info => {
    doc.text(info, margin, currentY);
    currentY += 7;
  });

  // Tags Section
  if (repository.tags && repository.tags.length > 0) {
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Tags:', margin, currentY);
    currentY += 7;
    doc.setFont('helvetica', 'normal');
    if (typeof repository.tags !== "string") {
      const tags = repository.tags.join(', ');
      currentY = wrapText(doc, tags, margin, currentY, contentWidth);
    }
  }

  // About Section
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('About Repository', margin, currentY);
  currentY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const cleanDescription = stripHtml(repository.description);
  currentY = wrapText(doc, cleanDescription, margin, currentY, contentWidth, 'justify');

  // Project Components Section
  currentY += 15;
  if (currentY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Project Components', margin, currentY);
  currentY += 10;

  doc.setFontSize(12);
  const projectComponents = [
    { label: 'Location: ', content: repository.location },
    { label: 'Start Date: ', content: repository.start_date ? formatDate(repository.start_date) : undefined },
    { label: 'End Date: ', content: repository.end_date ? formatDate(repository.end_date) : undefined },
    { label: 'Funding Agency: ', content: repository.funding_agency },
    { label: 'Affiliation: ', content: repository.affiliation },
    { label: 'Commodity: ', content: repository.commodity },
    { label: 'Industry: ', content: repository.industry },
    { label: 'Research Project/s: ', content: repository.rpt },
    { label: 'Priority Level: ', content: repository.priority_level ?
          repository.priority_level.charAt(0).toUpperCase() + repository.priority_level.slice(1) : undefined }
  ];

  projectComponents.forEach(({ label, content }) => {
    if (currentY > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = margin;
    }
    currentY = formatLabelAndContent(doc, label, content, margin, currentY, contentWidth);
  });

  // Technology Details Section
  currentY += 15;
  if (currentY > doc.internal.pageSize.height - 60) {
    doc.addPage();
    currentY = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Technology Details', margin, currentY);
  currentY += 10;

  doc.setFontSize(12);
  const techDetails = [
    { label: 'Technology Category: ', content: repository.technology_category },
    { label: 'Technology Status: ', content: repository.technology_status },
    { label: 'Technology Readiness Level: ', content: repository.technology_readiness_level },
    { label: 'Technology Generator: ', content: repository.technology_generator },
    { label: 'Technology Owner: ', content: repository.tech_owner },
    { label: 'Existing/Potential Adopters: ', content: repository.adaptors },
    { label: 'Transfer Plan: ', content: repository.transfer_plan },
    { label: 'Transfer Status: ', content: repository.technology_transfer_status }
  ];

  techDetails.forEach(({ label, content }) => {
    if (currentY > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = margin;
    }
    currentY = formatLabelAndContent(doc, label, content, margin, currentY, contentWidth);
  });

  // Commercialization Section (conditional)
  if (repository.transfer_plan === 'Commercialization' && repository.commercialization) {
    currentY += 15;
    if (currentY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      currentY = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Commercialization', margin, currentY);
    currentY += 10;

    doc.setFontSize(12);
    const commercializationDetails = [
      { label: 'IP Type: ', content: repository.commercialization.ipType },
      { label: 'IP Status: ', content: repository.commercialization.ipStatus },
      { label: 'IP Registration Number: ', content: repository.commercialization.regNo },
      { label: 'Mode Status: ', content: repository.commercialization.modeStatus },
      { label: 'Current Status: ', content: repository.commercialization.currentStatus },
      { label: 'Adopter Status: ', content: repository.commercialization.adopterStatus }
    ];

    commercializationDetails.forEach(({ label, content }) => {
      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = margin;
      }
      currentY = formatLabelAndContent(doc, label, content, margin, currentY, contentWidth);
    });
  }

  // Save the PDF
  doc.save(`${repository.title}-Info.pdf`);
};

const filterRepoMembersBySearchQuery = () => {
  if(searchQuery.value) {
    repoMembers.value = repoMemberData.value.filter(member => member.user.username.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    repoMembers.value = repoMemberData.value
  }
}
const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

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
  await removeRepoMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
}


const fetchMembers = async () => {
  const data = await fetchRepoMembers(<string>route.params.slug)
  repoMembers.value = data
  repoMemberData.value = data
}

watch(() => searchQuery.value, () => {
  filterRepoMembersBySearchQuery()
});

onMounted(async () => {
  loading.value = true;
  await fetchRepositoryData(route.params.slug as string);
  path.value = getFirstPath(<string>route.path)

  const allUserRepo = await fetchRepositoriesByUser();

  if(repository.value){
    if(isSlugInRepoList(repository.value, allUserRepo)) {
      if("is_member" in repository.value){
        repository.value.is_member = true;
      }
    }
  }

  await fetchMembers()
  userRepoInfo.value = repoMembers.value.find(member => member.user.uid === userData.uid)
  loading.value = false
})
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="settings">
    <div v-if="loading" class="loading-state-container mt-15">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
   <div v-else>
     <div v-if="repository" class="px-6 py-7">
       <VRow  class="ma-0" justify="space-between" align="center">
         <div>
           <p class="section-title">Download Repository Information</p>
           <p class="text-gs20 mb-2" style="font-size: 14px;">Download the Repository Information in PDF</p>
         </div>
         <VBtnPrimaryFilled
             @click="downloadRepositoryDataPDF(repository)"
             height="41px"
             rounded="lg"
             class="satoshi-md"
             style="font-size: 14px !important;">
           Download Repository Info
         </VBtnPrimaryFilled>
       </VRow>
       <div v-if="repository.is_member">
         <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager'" class="my-5"/>
         <div class="mt-2" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager'">
           <VRow  class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Update Repository Information</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your repository details and information</p>
             </div>
             <VBtnPrimaryFilled
                 :to="{ name: path == 'repositories' ? 'edit-repository' : 'edit-repository-my', params: {slug: repository?.slug}}"
                 height="41px"
                 rounded="lg"
                 class="satoshi-md"
                 style="font-size: 14px !important;">
               Update Repository Info
             </VBtnPrimaryFilled>
           </VRow>
         </div>
         <VDivider v-if="repository?.is_member" class="my-5"/>
         <div class="mt-2">
           <VRow v-if="repository?.is_member" class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Repository Members</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage repository members and their roles. <AccessLeveLInfoDialog/></p>
             </div>
             <AddRepoMemberDialog :form-type="FormType.create" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager'" @callback="fetchMembersCallback">
               <VBtnPrimaryFilled  height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                 Add Member
               </VBtnPrimaryFilled>
             </AddRepoMemberDialog>
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
           <div class="my-5 mx-1" v-if="repoMembers.length > 0">
             <div
                 v-for="member in repoMembers"
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
                     v-if="member.user.uid != userData.uid && (userRepoInfo?.access_level == 'owner' || userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager') && member.access_level != 'owner' && !(userRepoInfo?.access_level === 'manager' && (member.access_level === 'owner' || member.access_level === 'admin'))"
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
                     <AddRepoMemberDialog
                         :form-type="FormType.edit"
                         :member="member" :user-access-level="userRepoInfo?.access_level" @callback="updateMembersCallback"
                     >
                       <p class="cursor-pointer action-menu-item">
                         <PhPencil/>
                         Edit Access
                       </p>
                     </AddRepoMemberDialog>
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
               <PhInfo class="mr-1"/>No Repository Members Found
             </p>
           </div>
         </div>
       </div>
     </div>
   </div>
  </RepositoryDetailsLayout>
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