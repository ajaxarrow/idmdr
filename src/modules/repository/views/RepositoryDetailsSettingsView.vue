<script setup lang="ts">
import {onMounted, ref, watch, computed} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useRepositoryMemberServices} from "../services/repository-member.services.ts";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import AccessLeveLInfoDialog from "../../organization/components/AccessLeveLInfoDialog.vue";
import {
  PhArrowDown,
  PhDotsThreeOutlineVertical,
  PhInfo,
  PhMagnifyingGlass,
  PhPencil,
  PhTrash,
  PhWarning
} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import AddRepoMemberDialog from "../components/AddRepoMemberDialog.vue";
import jsPDF from 'jspdf';
import DOMPurify from 'dompurify';
import {useAccessRequestServices} from "../services/access-request.services.ts";
import {AccessRequest} from "../../../interfaces/access-request.interface.ts";
import AccessRequestConfirmationDialog from "../components/AccessRequestConfirmationDialog.vue";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {useNotificationsServices} from "../../user/services/notifications.services.ts";
import ChangeVisibilityDialog from "../../../core/components/ChangeVisibilityDialog.vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useVisibilityHelper} from "../../../core/composables/useVisibilityHelper.ts";

const {addNotification} = useNotificationsServices()
const {userData} = useUserStore();
const {showSnackbarMessage} = useSnackbarStore();
const {repository} = useRepositoryStore();
const {fetchRepositoryData, fetchRepositoryIDsByUser, manageRepositoryStatus} = useRepositoryServices()
const {fetchRepoMembers, removeRepoMember} = useRepositoryMemberServices()
const {fetchAccessRequestsByRepository, updateAccessRequest} = useAccessRequestServices()
const {getVisibilityLabel} = useVisibilityHelper()
const {arrayToString} = useStringArrayHelper()
const {route} = useRouting()
const loading = ref(false)
const searchQuery = ref('')
const currentRepo = ref<Repository | null>(null)
const entityTitle = computed(() => {
  return currentRepo.value
      ? currentRepo.value?.type! === 'Project Repository'
          ? 'IP Technology'
          : 'Project'
      : 'Project';
});
const accessRequestSearchQuery = ref('')
const memberActionMenu = ref(false)
const overlayLoading = ref(false)
const path = ref('repositories')
const repoMemberData = ref<OrgMember[]>([])
const repoMembers = ref<OrgMember[]>([])
const accessRequests = ref<AccessRequest[]>([])
const accessRequestData = ref<AccessRequest[]>([])
const userRepoInfo = ref<OrgMember | null | undefined>(null)

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
};
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


const downloadRepositoryDataPDF = async (repository: Repository) => {
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

  const titleLines = doc.splitTextToSize(repository?.title || 'Repository', pageWidth - (margin * 4));
  doc.text(titleLines, margin + 10, pageHeight/3);

  // Repository type and date
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(repository?.type || 'Repository', margin + 10, pageHeight/3 + 30);
  doc.text(`Last Updated: ${formatDate(repository?.updated_at || '')}`, margin + 10, pageHeight/3 + 40);

  // Org details on cover
  if (repository?.org_data?.name) {
    doc.setFontSize(16);
    doc.text(repository.org_data.name, margin + 10, pageHeight - 60);
    if (repository.org_data?.acronym) {
      doc.text(`(${repository.org_data.acronym})`, margin + 10, pageHeight - 50);
    }
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

  const sections = ['Basic Information', 'About Repository'];
  if (repository?.type === 'Project Repository') {
    sections.push('Project Components', 'Technology Details');
    if (repository?.transfer_plan === 'Commercialization' && repository?.commercialization) {
      sections.push('Commercialization');
    }
    // if (repository?.atbi && repository.atbi.trim().length !== 0) {
    //   sections.push('Agri-Aqua Technology Business Incubator');
    // }
    // if (repository?.abh && repository.abh.trim().length !== 0) {
    //   sections.push('Agri-Aqua Business Hub');
    // }
  }
  if (repository?.additional_info && repository.additional_info.trim().length > 0) {
    sections.push('Additional Information');
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.text);
  sections.forEach((section, index) => {
    doc.text(`${index + 1}. ${section}`, margin + 5, currentY);
    currentY += 7;
  });

  currentY += 15;

  // Basic Information Section - clean design
  doc.addPage();
  currentY = 40;

  // Simple section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('Basic Information', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 50, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Single column layout for clarity
  doc.setFont('helvetica', 'bold');
  doc.text('Owner:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(repository?.owner_data?.username || 'N/A', margin + 70, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Associated CMI:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  const orgText = `${repository?.org_data?.name || 'N/A'} (${repository?.org_data?.acronym || 'N/A'})`;
  doc.text(orgText, margin + 70, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Last Updated:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(repository?.updated_at || ''), margin + 70, currentY);
  currentY += 8;

  // Ensure Basic Information is always present
  doc.setFont('helvetica', 'bold');
  doc.text('Lead:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(repository?.leadData?.data?.first_name ? `${repository?.leadData?.data?.first_name} ${repository?.leadData?.data?.last_name}`: 'N/A', margin + 70, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Collaborators:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(
      !repository?.authorsData || repository.authorsData.length === 0
          ? 'N/A'
          : repository.authorsData.map((owner) => `${owner?.data?.first_name} ${owner?.data?.last_name}`).filter(Boolean).join(', '),
      margin + 70, currentY
  );
  currentY += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Location:', margin, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(repository?.location || 'N/A', margin + 70, currentY);
  currentY += 8;

  // Tags with minimal styling
  if (repository?.tags && Array.isArray(repository.tags) && repository.tags.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Tags:', margin, currentY);
    currentY += 8;

    if (typeof repository.tags !== "string") {
      const tags = repository.tags;
      let tagText = tags.filter(Boolean).join(', ');

      doc.setFont('helvetica', 'normal');
      if (doc.getTextWidth(tagText) > contentWidth) {
        currentY = wrapText(doc, tagText, margin + 10, currentY, contentWidth - 10);
      } else {
        doc.text(tagText, margin + 10, currentY);
        currentY += 8;
      }
    }
  }

  // About section
  currentY += 10;

  // Section heading with underline
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('About Project', margin, currentY);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 2, margin + 50, currentY + 2);
  currentY += 12;

  doc.setTextColor(colors.text);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const cleanDescription = stripHtml(repository?.description || '');
  currentY = wrapText(doc, cleanDescription, margin, currentY, contentWidth);

  // Project Components Section (conditional)
  if (repository?.type === 'Project Repository') {
    currentY += 15;
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 40;
    }

    // Section heading with underline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(colors.primary);
    doc.text('Project Components', margin, currentY);
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 2, margin + 50, currentY + 2);
    currentY += 12;

    doc.setTextColor(colors.text);
    doc.setFontSize(11);

    // Single column layout for project components
    const projectItems = [
      { label: 'Start Date:', content: repository?.start_date ? formatDate(repository.start_date) : 'N/A' },
      { label: 'End Date:', content: repository?.end_date ? formatDate(repository.end_date) : 'N/A' },
      { label: 'Funding Agency:', content: arrayToString(repository?.funding_agency as string[] || []) || 'N/A' },
      { label: 'Affiliation:', content: arrayToString(repository?.affiliation as string[] || []) || 'N/A' },
      { label: 'Commodity:', content: arrayToString(repository?.commodity as string[] || []) || 'N/A' },
      { label: 'Industry:', content: arrayToString(repository?.industry as string[] || []) || 'N/A' },
      { label: 'Research Project/s:', content: arrayToString(repository?.rpt as string[] || []) || 'N/A' },
      { label: 'Priority Level:', content: repository?.priority_level ?
            repository.priority_level.charAt(0).toUpperCase() + repository.priority_level.slice(1) : 'N/A' }
    ];

    // Render items in single column
    projectItems.forEach(({ label, content }) => {
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = 40;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, currentY);

      doc.setFont('helvetica', 'normal');
      if (content && doc.getTextWidth(content) > contentWidth - 70) {
        currentY = wrapText(doc, content, margin + 70, currentY, contentWidth - 70);
      } else {
        doc.text(content || 'N/A', margin + 70, currentY);
        currentY += 8;
      }
    });

    // Technology Details Section
    currentY += 10;
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 40;
    }

    // Section heading with underline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(colors.primary);
    doc.text('Technology Details', margin, currentY);
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 2, margin + 50, currentY + 2);
    currentY += 12;

    doc.setTextColor(colors.text);
    doc.setFontSize(11);

    // Technology items in a single column
    const techItems = [
      { label: 'Patenting Status:', content: repository?.is_patentable ? 'Applicable for Patenting' : 'Not Applicable' },
      { label: 'Technology Category:', content: repository?.technology_category || 'N/A' },
      { label: 'Technology Status:', content: repository?.technology_status || 'N/A' },
      { label: 'Technology Readiness Level:', content: repository?.technology_readiness_level || 'N/A' },
      { label: 'Technology Generator:', content: !repository?.techGeneratorData || repository.techGeneratorData.length === 0 ?
            'N/A' : repository.techGeneratorData.map((owner) => `${owner?.data?.first_name} ${owner?.data?.last_name}`).filter(Boolean).join(', ') },
      { label: 'Technology Owner:', content: !repository?.techOwnerData || repository.techOwnerData?.length === 0 ?
            'N/A' : repository.techOwnerData?.map((owner) => `${owner?.data?.first_name} ${owner?.data?.last_name}`).filter(Boolean).join(', ') },

      { label: 'Existing/Potential Adopters:', content: arrayToString(repository?.adaptors as string[] || []) || 'N/A' },
      { label: 'Transfer Plan:', content: repository?.transfer_plan || 'N/A' },
      { label: 'Transfer Status:', content: repository?.technology_transfer_status || 'N/A' }
    ];

    // Render tech items in single column
    techItems.forEach(({ label, content }) => {
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = 40;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, currentY);

      doc.setFont('helvetica', 'normal');
      if (content && doc.getTextWidth(content) > contentWidth - 70) {
        currentY = wrapText(doc, content, margin + 70, currentY, contentWidth - 70);
      } else {
        doc.text(content || 'N/A', margin + 70, currentY);
        currentY += 8;
      }
    });

    // Commercialization Section (conditional)
    if (repository?.transfer_plan === 'Commercialization' && repository?.commercialization) {
      currentY += 10;
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 40;
      }

      // Section heading with underline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(colors.primary);
      doc.text('Commercialization', margin, currentY);
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 2, margin + 50, currentY + 2);
      currentY += 12;

      doc.setTextColor(colors.text);
      doc.setFontSize(11);

      // Commercialization items in a single column
      const commItems = [
        { label: 'IP Type:', content: repository.commercialization?.ipType || 'N/A' },
        { label: 'IP Status:', content: repository.commercialization?.ipStatus || 'N/A' },
        { label: 'IP Registration Number:', content: repository.commercialization?.regNo || 'N/A' },
        { label: 'Mode Status:', content: repository.commercialization?.modeStatus || 'N/A' },
        { label: 'Current Status:', content: repository.commercialization?.currentStatus || 'N/A' },
        { label: 'Adopter Status:', content: repository.commercialization?.adopterStatus || 'N/A' }
      ];

      // Render commercialization items
      commItems.forEach(({ label, content }) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 40;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(label, margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text(content, margin + 70, currentY);
        currentY += 8;
      });
    }

    // ATBI Section (conditional)
    // if (repository?.atbi && repository.atbi.trim().length !== 0) {
    //   currentY += 10;
    //   if (currentY > pageHeight - 40) {
    //     doc.addPage();
    //     currentY = 40;
    //   }
    //
    //   // Section heading with underline
    //   doc.setFont('helvetica', 'bold');
    //   doc.setFontSize(16);
    //   doc.setTextColor(colors.primary);
    //   doc.text('Agri-Aqua Technology Business Incubator', margin, currentY);
    //   doc.setDrawColor(colors.accent);
    //   doc.setLineWidth(0.5);
    //   doc.line(margin, currentY + 2, margin + 100, currentY + 2);
    //   currentY += 12;
    //
    //   doc.setTextColor(colors.text);
    //   doc.setFontSize(11);
    //   doc.setFont('helvetica', 'normal');
    //
    //   // Clean HTML and wrap text
    //   const cleanATBI = stripHtml(repository.atbi);
    //   currentY = wrapText(doc, cleanATBI, margin, currentY, contentWidth);
    // }

    // ABH Section (conditional)
    // if (repository?.abh && repository.abh.trim().length !== 0) {
    //   currentY += 10;
    //   if (currentY > pageHeight - 40) {
    //     doc.addPage();
    //     currentY = 40;
    //   }
    //
    //   // Section heading with underline
    //   doc.setFont('helvetica', 'bold');
    //   doc.setFontSize(16);
    //   doc.setTextColor(colors.primary);
    //   doc.text('Agri-Aqua Business Hub', margin, currentY);
    //   doc.setDrawColor(colors.accent);
    //   doc.setLineWidth(0.5);
    //   doc.line(margin, currentY + 2, margin + 70, currentY + 2);
    //   currentY += 12;
    //
    //   doc.setTextColor(colors.text);
    //   doc.setFontSize(11);
    //   doc.setFont('helvetica', 'normal');
    //
    //   // Clean HTML and wrap text
    //   const cleanABH = stripHtml(repository.abh);
    //   currentY = wrapText(doc, cleanABH, margin, currentY, contentWidth);
    // }
  }

  // Additional Information Section (conditional)
  if (repository?.additional_info && repository.additional_info.trim().length > 0) {
    currentY += 10;
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 40;
    }

    // Section heading with underline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(colors.primary);
    doc.text('Additional Information', margin, currentY);
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 2, margin + 70, currentY + 2);
    currentY += 12;

    doc.setTextColor(colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    // Clean HTML and wrap text
    const cleanAdditionalInfo = stripHtml(repository.additional_info);
    currentY = wrapText(doc, cleanAdditionalInfo, margin, currentY, contentWidth);
  }

  // Add minimal header, footer and page numbers
  addHeaderAndFooter(doc);
  addPageNumber(doc);

  // Save the PDF
  doc.save(`${repository?.title || 'Repository'}-Info.pdf`);
};

const filterRepoMembersBySearchQuery = () => {
  if(searchQuery.value) {
    repoMembers.value = repoMemberData.value.filter(member => member.user.username.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) || member.user.email.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    repoMembers.value = repoMemberData.value
  }
}

const filterAccessRequestBySearchQuery = () => {
  if(accessRequestSearchQuery.value) {
    accessRequests.value = accessRequestData.value.filter(request => request.requestor_user_obj?.username.toLowerCase().includes(accessRequestSearchQuery.value.toLowerCase().trim()) || request.requestor_user_obj?.email.toLowerCase().includes(accessRequestSearchQuery.value.toLowerCase().trim()));
  } else {
    accessRequests.value = accessRequestData.value
  }
}
const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

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
  await removeRepoMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
  loading.value = false
}


const fetchMembers = async () => {
  loading.value = true
  const data = await fetchRepoMembers(<string>route.params.slug)
  const requests = await fetchAccessRequestsByRepository(route.params.slug as string)
  accessRequests.value = requests
  accessRequestData.value = requests
  repoMembers.value = data
  repoMemberData.value = data
  loading.value = false
}

const manageRepoStatusCallback = async (isActive: boolean) => {
  overlayLoading.value = true
  await manageRepositoryStatus(route.params.slug as string, isActive)
  overlayLoading.value = false
  showSnackbarMessage("Project Visibility Changed Successfully", Status.success)
  repository!.value!.is_active = isActive!
}

const manageRequestCallback = async (id: string, isApproved: boolean, accessRequest: AccessRequest) => {
  loading.value = true;
  await updateAccessRequest({
    content_type: 30,
    object_id: <string>route.params.slug,
    is_approved: isApproved,
    is_reviewed: true}, id
  )

  await addNotification({
    sender: userData.uid,
    receiver: accessRequest.requestor_user_obj?.uid,
    title: isApproved ? 'Access Request Approved' : 'Access Request Denied',
    message: isApproved ? `Your request for access to ${repository.value?.title} has been approved.` : `Your access request for ${repository.value?.title} has been denied.`,
    type: 'Access Request',
    object_id: <string> route.params.slug,
    content_type: 30,
    is_read: false,
    is_deleted: false
  })

  await fetchMembers()
  showSnackbarMessage(`Access Request ${isApproved ? 'Approved' : 'Denied'} Successfully`, Status.success)
  memberActionMenu.value = false
  loading.value = false
}

const changeVisibilityCallback = async (newVisibility: number) => {
  showSnackbarMessage("Project Visibility Changed Successfully", Status.success)
  repository!.value!.visibility = newVisibility
}

watch(() => searchQuery.value, () => {
  filterRepoMembersBySearchQuery()
});

watch(() => accessRequestSearchQuery.value, () => {
  filterAccessRequestBySearchQuery()
});

onMounted(async () => {
  loading.value = true;
  currentRepo.value = await fetchRepositoryData(route.params.slug as string);
  accessRequests.value = await fetchAccessRequestsByRepository(route.params.slug as string);
  accessRequestData.value = accessRequests.value
  path.value = getFirstPath(<string>route.path)

  const allUserRepo = await fetchRepositoryIDsByUser();

  if(currentRepo.value){
    if(isSlugInRepoList(currentRepo.value, allUserRepo) || userData.is_superuser) {
      if("is_member" in currentRepo.value){
        currentRepo.value.is_member = true;
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
     <VAlert
         v-if="repository && !repository.is_active"
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
             {{entityTitle}} Is Currently Inactive
           </VAlert-title>
           <div class="warning-message">
             This {{entityTitle}} is not visible to the public. Only members can view it.
             <a v-if="userRepoInfo?.access_level == 'owner'" href="#repository-status" class="status-link" >
               Change status now <PhArrowDown class="ms-1" />
             </a>
           </div>
         </div>
       </div>
     </VAlert>
     <div v-if="currentRepo" class="px-6 py-7">
       <VRow  class="ma-0" justify="space-between" align="center">
         <div>
           <p class="section-title">Download {{entityTitle}} Information</p>
           <p class="text-gs20 mb-2" style="font-size: 14px;">Download the {{entityTitle}} Information in PDF</p>
         </div>
         <VBtnPrimaryFilled
             @click="downloadRepositoryDataPDF(currentRepo)"
             height="41px"
             rounded="lg"
             class="satoshi-md"
             style="font-size: 14px !important;">
           Download {{entityTitle}} Info
         </VBtnPrimaryFilled>
       </VRow>
       <div v-if="currentRepo.is_member|| userData.is_superuser">
         <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
         <div class="mt-2" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser">
           <VRow  class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Update {{entityTitle}} Visibility (Current Visibility: {{getVisibilityLabel(repository?.visibility as number)}})</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your project visibility </p>
             </div>
             <ChangeVisibilityDialog
               :id="<string>repository?.uid!"
               :visibility="repository?.visibility"
               type="project"
              @callback="changeVisibilityCallback"
             >
               <VBtnPrimaryFilled
                   height="41px"
                   rounded="lg"
                   class="satoshi-md"
                   style="font-size: 14px !important;">
                 Change {{entityTitle}} Visibility
               </VBtnPrimaryFilled>
             </ChangeVisibilityDialog>
           </VRow>
         </div>
         <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
         <div class="mt-2" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser">
           <VRow  class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Update {{entityTitle}} Information</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your project details and information</p>
             </div>
             <VBtnPrimaryFilled
                 :to="{ name: path == 'repositories' ? 'edit-repository' : 'edit-repository-my', params: {slug: repository?.slug}}"
                 height="41px"
                 rounded="lg"
                 class="satoshi-md"
                 style="font-size: 14px !important;">
               Update {{entityTitle}} Info
             </VBtnPrimaryFilled>
           </VRow>
         </div>
         <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
         <div class="mt-2" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser">
           <VRow  class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Upload {{entityTitle}} Files</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Upload files to your project</p>
             </div>
             <VBtnPrimaryFilled
                 :to="{ name: path == 'repositories' ? 'upload-files-repository' : 'upload-files-repository-my', params: {slug: repository?.slug}}"
                 height="41px"
                 rounded="lg"
                 class="satoshi-md"
                 style="font-size: 14px !important;">
               Upload {{entityTitle}} Files
             </VBtnPrimaryFilled>
           </VRow>
         </div>

         <VDivider v-if="currentRepo?.is_member" class="my-5"/>
         <div class="mt-2">
           <VRow v-if="currentRepo?.is_member" class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">{{entityTitle}} Members</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage project members and their roles. <AccessLeveLInfoDialog/></p>
             </div>
             <AddRepoMemberDialog :form-type="FormType.create" v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" @callback="fetchMembersCallback">
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
                 v-for="(member, index) in repoMembers"
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
                     <p class="text-name text-container">{{member.user.first_name}} {{member.user.last_name}}</p>
                     <p class="text-name-subtitle">{{member.user.email}} · {{member.access_level}}</p>
                   </div>
                 </div>
                 <VMenu
                     v-if="member.user.uid != userData.uid && (userRepoInfo?.access_level == 'owner' || userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager') && member.access_level != 'owner' && !(userRepoInfo?.access_level === 'manager' && (member.access_level === 'owner' || member.access_level === 'admin')) || userData.is_superuser"
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
               <VDivider v-if="index != repoMembers.length - 1" class="mt-3"/>
             </div>
           </div>
           <div class="my-5 mx-1" v-else>
             <p class="d-flex align-center justify-center">
               <PhInfo class="mr-1"/>No {{entityTitle}} Members Found
             </p>
           </div>
         </div>
         <VDivider v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" class="my-5"/>
         <div v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser"  class="mt-2">
           <VRow v-if="userRepoInfo?.access_level == 'owner' ||userRepoInfo?.access_level == 'admin' || userRepoInfo?.access_level == 'manager' || userData.is_superuser" class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Access Requests</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage access requests in the project </p>
             </div>
           </VRow>
           <VTextField
               class="my-3"
               v-model="accessRequestSearchQuery"
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
               <p class="text-gs20">Find users who have requested access</p>
             </template>
           </VTextField>
           <div class="my-5 mx-1" v-if="accessRequests.length > 0">
             <div
                 v-for="(accessRequest, index) in accessRequestData"
                 :key="accessRequest.uid"
             >
               <VRow v-if="!(accessRequest.is_approved && accessRequest.is_reviewed)" class="ma-0 my-3" justify="space-between" align="center">
                 <div class="d-flex align-center">
                   <VAvatar
                       size="40"
                       class="mr-1 cursor-pointer"
                   >
                     <VImg :src="accessRequest.requestor_user_obj?.profile_picture ?? 'https://dummyimage.com/400x400/023768/fff.png&text=N/A'"></VImg>
                   </VAvatar>
                   <div class="mr-2">
                     <p class="text-name text-container">{{accessRequest.requestor_user_obj?.first_name}} {{accessRequest.requestor_user_obj?.last_name}}</p>
                     <p class="text-name-subtitle">{{accessRequest.requestor_user_obj?.email}} · {{accessRequest.is_reviewed ? 'Denied' : 'Pending'}}</p>
                   </div>
                 </div>
                 <VMenu
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
                         :form-type="FormType.create"
                         :selectedMember="accessRequest.requestor_user_obj"
                         :isMemberIncluded="true"
                         @callback="fetchMembersCallback"
                         @accessRequestCallback="manageRequestCallback(accessRequest.uid as string, true, accessRequest)"

                     >
                       <p class="cursor-pointer action-menu-item">
                         <PhPencil/>
                         Approve Request
                       </p>
                     </AddRepoMemberDialog>
                     <AccessRequestConfirmationDialog
                      content="Are you sure you want to deny this access request? The requester will be notified that access was not granted."
                      confirmContent="Yes, Deny Request"
                      @callback="manageRequestCallback(accessRequest.uid as string, false, accessRequest)"
                     >
                       <p class="cursor-pointer action-menu-item">
                         <PhTrash/>
                         Deny Request
                       </p>
                     </AccessRequestConfirmationDialog>
                   </VSheet>
                 </VMenu>
               </VRow>
               <VDivider v-if="!(accessRequest.is_approved && accessRequest.is_reviewed) && index != accessRequests.length - 1" class="mt-3"/>
             </div>
           </div>
           <div class="my-5 mx-1" v-else>
             <p class="d-flex align-center justify-center">
               <PhInfo class="mr-1"/>No Access Requests Found
             </p>
           </div>
         </div>
         <VDivider v-if="userRepoInfo?.access_level == 'owner' || userData.is_superuser" class="my-5"/>
         <div v-if="userRepoInfo?.access_level == 'owner' || userData.is_superuser" class="mt-2" id="repository-status">
           <VRow class="ma-0" justify="space-between" align="center">
             <div>
               <p class="section-title">Manage {{entityTitle}} Status Information (Current Status: {{repository?.is_active ? 'Active' : 'Inactive'}})</p>
               <p class="text-gs20 mb-2" style="font-size: 14px;">This will change the status of the project</p>
             </div>
             <ConfirmationDialog
                 :isWarning="repository?.is_active"
                 @callback="manageRepoStatusCallback(!repository?.is_active)"
                 :confirm-content="repository?.is_active ? `Deactivate ${entityTitle}` : `Activate ${entityTitle}`"
                 :content="repository?.is_active ? 'Are you sure you want to deactivate this project? All project data will not be available to the public.' : 'Are you sure you want to activate this project?'"
             >
               <VBtnPrimaryFilled
                   height="41px"
                   rounded="lg"
                   class="satoshi-md"
                   :color="repository?.is_active ? '#C83246' : '#01579B'"
                   style="font-size: 14px !important; color: white !important;">
                 {{repository?.is_active ? `Deactivate ${entityTitle}` : `Activate ${entityTitle}`}}
               </VBtnPrimaryFilled>
             </ConfirmationDialog>
           </VRow>
         </div>
       </div>
     </div>
   </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>




.status-activate-btn {
  background-color: #4caf50 !important;
}

.status-deactivate-btn {
  background-color: #b00020 !important;
}

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