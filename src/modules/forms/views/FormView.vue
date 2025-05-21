<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import { PhWarning, PhPlus, PhTrash, PhCopy, PhUser, PhMapPin, PhGear, PhFolder, PhUsers, PhNote } from "@phosphor-icons/vue";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../../core/stores/user.store.ts";
import { v4 as uuidv4 } from 'uuid';

const { user, userData } = useUserStore();

// Current project data
const projectData = ref<{
  title: string;
  description: string;
  siteOfImplementation: string;
  type: string;
  category: string;
  collaborators: string;
  projectLead: string;
}>({
  title: 'New Project',
  description: '',
  siteOfImplementation: '',
  type: '',
  category: '',
  collaborators: '',
  projectLead: ''
});

// Project types
const projectTypes = [
  { value: 'tech', text: 'With Associated Technology' },
  { value: 'notech', text: 'Without Associated Technology' },
  { value: 'research', text: 'Research Only' }
];

// Project categories
const projectCategories = [
  { value: 'project', text: 'Project' },
  { value: 'program', text: 'Program' },
  { value: 'initiative', text: 'Initiative' }
];

// Rich text editor options
const formatOptions = [
  { icon: 'mdi-format-bold', action: 'bold', tooltip: 'Bold' },
  { icon: 'mdi-format-italic', action: 'italic', tooltip: 'Italic' },
  { icon: 'mdi-format-underline', action: 'underline', tooltip: 'Underline' },
  { icon: 'mdi-format-strikethrough', action: 'strikethrough', tooltip: 'Strikethrough' },
  { icon: 'mdi-format-quote-close', action: 'quote', tooltip: 'Quote' },
  { icon: 'mdi-code-tags', action: 'code', tooltip: 'Code' },
  { icon: 'mdi-link', action: 'link', tooltip: 'Link' },
  { icon: 'mdi-image', action: 'image', tooltip: 'Image' },
  { icon: 'mdi-format-list-bulleted', action: 'bullet-list', tooltip: 'Bullet List' },
  { icon: 'mdi-format-list-numbered', action: 'ordered-list', tooltip: 'Ordered List' },
  { icon: 'mdi-format-header-1', action: 'h1', tooltip: 'Heading 1' },
  { icon: 'mdi-format-header-2', action: 'h2', tooltip: 'Heading 2' },
  { icon: 'mdi-format-align-left', action: 'align-left', tooltip: 'Align Left' },
  { icon: 'mdi-format-align-center', action: 'align-center', tooltip: 'Align Center' },
  { icon: 'mdi-format-align-right', action: 'align-right', tooltip: 'Align Right' }
];

// Font options
const fontOptions = [
  { value: 'sans-serif', text: 'Sans Serif' },
  { value: 'serif', text: 'Serif' },
  { value: 'monospace', text: 'Monospace' }
];

// Font size options
const fontSizeOptions = [
  { value: 'normal', text: 'Normal' },
  { value: 'small', text: 'Small' },
  { value: 'medium', text: 'Medium' },
  { value: 'large', text: 'Large' }
];

// Save the project
const saveProject = () => {
  // Here you would save the project to your backend
  alert('Project saved successfully');
  console.log('Project data:', projectData.value);
  
  // In a real application, you would make an API call here
  // For example:
  // await fetch('/api/projects', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(projectData.value)
  // });
};

// Navigation items
const navItems = [
  { icon: PhMapPin, text: 'Dashboard', route: '/dashboard' },
  { icon: PhFolder, text: 'Projects', route: '/projects' },
  { icon: PhGear, text: 'IP Technologies', route: '/ip-technologies' },
  { icon: PhNote, text: 'E-Library', route: '/e-library' },
  { icon: PhNote, text: 'ATBI', route: '/atbi' },
  { icon: PhUsers, text: 'CMIs', route: '/cmis' },
  { icon: PhMapPin, text: 'Map', route: '/map' },
  { icon: PhFolder, text: 'My Projects', route: '/my-projects' },
  { icon: PhUsers, text: 'My CMIs', route: '/my-cmis' },
  { icon: PhUsers, text: 'Experts', route: '/experts' },
  { icon: PhNote, text: 'Posts', route: '/posts' },
  { icon: PhNote, text: 'Calendar', route: '/calendar' },
  { icon: PhUser, text: 'My Profile', route: '/my-profile' },
  { icon: PhNote, text: 'Help Center', route: '/help-center' }
];
</script>

<template>
  <div class="kmhub-app">
    <!-- Top Navigation Bar -->
    <div class="top-navbar">
      <div class="navbar-left">
        <div class="logo">
          <span class="logo-icon">🌐</span>
          <span class="logo-text">KMHUB</span>
        </div>
        <h2 class="page-title">
          {{ projectData.title }}
        </h2>
      </div>
      <div class="navbar-right">
        <div class="notification-icon">
          <VBtn icon variant="text">
            <VIcon>mdi-bell</VIcon>
            <VBadge content="1" color="error" />
          </VBtn>
        </div>
        <div class="user-profile">
          <span class="user-name">{{ (userData?.firstName && userData?.lastName) ? userData.firstName + ' ' + userData.lastName : 'Khent Mark Dahay' }}</span>
          <span class="user-email">{{ userData?.email || 'khentmark2dahay@gmail.com' }}</span>
        </div>
      </div>
    </div>
    
    <div class="app-container">
      <!-- Sidebar Navigation -->
      <div class="sidebar">
        <div v-for="(item, index) in navItems" :key="index" class="nav-item" :class="{ active: index === 1 }">
          <component :is="item.icon" class="nav-icon" />
          <span class="nav-text">{{ item.text }}</span>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Alert for unapproved users -->
        <VAlert
          v-if="!userData.is_approved && user"
          color="#ff9800"
          variant="tonal"
          border="start"
          class="inactive-repo-banner mb-8"
        >
          <div class="d-flex align-center">
            <div class="warning-icon-container me-3">
              <PhWarning size="24" weight="fill" class="warning-icon" />
            </div>
            <div class="warning-content">
              <VAlert-title class="warning-title font-weight-bold">
                Account Awaiting Approval
              </VAlert-title>
              <div class="warning-message">
                Your account has not yet been approved, and access is currently restricted. Reach out to the system administrator to request approval and gain full user privileges.
              </div>
            </div>
          </div>
        </VAlert>
        
        <!-- Project Creation Form -->
        <div class="form-section">
          <div class="form-field">
            <label class="form-label">Description<span class="required-indicator">*</span></label>
            <div class="text-editor-toolbar">
              <button v-for="(option, index) in formatOptions.slice(0, 4)" :key="index" class="toolbar-btn">
                <VIcon small>{{ option.icon }}</VIcon>
              </button>
              <span class="toolbar-divider"></span>
              <button v-for="(option, index) in formatOptions.slice(4, 8)" :key="index + 4" class="toolbar-btn">
                <VIcon small>{{ option.icon }}</VIcon>
              </button>
              <span class="toolbar-divider"></span>
              <button v-for="(option, index) in formatOptions.slice(8, 13)" :key="index + 8" class="toolbar-btn">
                <VIcon small>{{ option.icon }}</VIcon>
              </button>
              <span class="toolbar-divider"></span>
              <VSelect
                density="compact"
                variant="plain"
                :items="fontSizeOptions"
                v-model="fontSizeOptions[0].value"
                hide-details
                class="font-select"
              ></VSelect>
              <span class="toolbar-divider"></span>
              <VSelect
                density="compact"
                variant="plain"
                :items="fontOptions"
                v-model="fontOptions[0].value"
                hide-details
                class="font-select"
              ></VSelect>
              <span class="toolbar-divider"></span>
              <button v-for="(option, index) in formatOptions.slice(13)" :key="index + 13" class="toolbar-btn">
                <VIcon small>{{ option.icon }}</VIcon>
              </button>
            </div>
            <VTextarea
              v-model="projectData.description"
              variant="outlined"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
              auto-grow
              rows="4"
              class="description-textarea"
            ></VTextarea>
          </div>
          
          <div class="form-field">
            <label class="form-label">Site of Implementation</label>
            <VTextField
              v-model="projectData.siteOfImplementation"
              variant="outlined"
              placeholder="E.g. Musuan, Bukidnon"
            ></VTextField>
          </div>
          
          <div class="form-field">
            <label class="form-label">Type</label>
            <VSelect
              v-model="projectData.type"
              :items="projectTypes"
              item-title="text"
              item-value="value"
              variant="outlined"
              placeholder="With Associated Technology"
            ></VSelect>
          </div>
          
          <div class="form-field">
            <label class="form-label">Project Category</label>
            <VSelect
              v-model="projectData.category"
              :items="projectCategories"
              item-title="text"
              item-value="value"
              variant="outlined"
              placeholder="Project"
            ></VSelect>
          </div>
          
          <div class="form-field">
            <label class="form-label">Collaborator(s)</label>
            <VSelect
              v-model="projectData.collaborators"
              variant="outlined"
              placeholder="Enter Collaborator"
            ></VSelect>
          </div>
          
          <div class="form-field">
            <label class="form-label">Project Lead</label>
            <VSelect
              v-model="projectData.projectLead"
              variant="outlined"
              placeholder="Enter Project Lead"
            ></VSelect>
          </div>
          
          <div class="form-actions">
            <VBtn
              color="primary"
              class="save-button"
              @click="saveProject"
            >
              Save Project
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kmhub-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  height: 60px;
  border-bottom: 1px solid #e0e0e0;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 2rem;
}

.logo-icon {
  margin-right: 0.5rem;
}

.page-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.notification-icon {
  margin-right: 1.5rem;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
}

.user-email {
  color: #666;
  font-size: 0.75rem;
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background-color: white;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #e8f0fe;
  color: #1a73e8;
}

.nav-icon {
  margin-right: 0.75rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.form-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.required-indicator {
  color: red;
  margin-left: 2px;
}

.text-editor-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0.25rem;
}

.toolbar-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.toolbar-btn:hover {
  background-color: #e0e0e0;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  margin: 0 0.5rem;
}

.font-select {
  max-width: 120px;
}

.description-textarea {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-button {
  min-width: 120px;
}
</style>