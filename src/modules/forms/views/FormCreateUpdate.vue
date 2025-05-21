<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import { PhWarning, PhPlus, PhTrash, PhCopy } from "@phosphor-icons/vue";
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../../core/stores/user.store.ts";
import { v4 as uuidv4 } from 'uuid';

const { user, userData } = useUserStore();

// Form creation mode: 'create' or 'preview'
const mode = ref('create');

// Define the type for a question
type Question = {
  id?: string;
  title: string;
  type?: string;
  required: boolean;
  options: string[];
  answer: any;
};

// Current form data
const formData = ref<{
  title: string;
  description: string;
  questions: Question[];
}>({
  title: 'Untitled Form',
  description: '',
  questions: []
});

// Form questions types
const questionTypes = [
  { value: 'short', text: 'Short Answer' },
  { value: 'paragraph', text: 'Paragraph' },
  { value: 'multiple', text: 'Multiple Choice' },
  { value: 'checkbox', text: 'Checkboxes' },
  { value: 'dropdown', text: 'Dropdown' },
  { value: 'date', text: 'Date' },
  { value: 'time', text: 'Time' }
];

// Add a new question
const addQuestion = () => {
  formData.value.questions.push({
  
    title: 'Untitled Question',
    required: false,
    options: ['Option 1'],
    answer: null
  });
};

// Add option to a question (for multiple choice, checkbox, dropdown)
const addOption = (questionIndex: number) => {
  const optionsCount = formData.value.questions[questionIndex].options.length;
  formData.value.questions[questionIndex].options.push(`Option ${optionsCount + 1}`);
};

// Remove option from a question
const removeOption = (questionIndex: number, optionIndex: number) => {
  formData.value.questions[questionIndex].options.splice(optionIndex, 1);
};

// Remove a question
const removeQuestion = (index: number) => {
  formData.value.questions.splice(index, 1);
};

// Duplicate a question
const duplicateQuestion = (index: number) => {
  const question = JSON.parse(JSON.stringify(formData.value.questions[index]));
  question.id = uuidv4();
  formData.value.questions.splice(index + 1, 0, question);
};

// Switch between create and preview modes
const toggleMode = () => {
  mode.value = mode.value === 'create' ? 'preview' : 'create';
};

// Save the form
const saveForm = () => {
  // Here you would save the form to your backend
  alert('Form saved successfully');
  console.log('Form data:', formData.value);
  
  // In a real application, you would make an API call here
  // For example:
  // await fetch('/api/forms', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData.value)
  // });
};

// Load forms (for demonstration)
const userForms = ref<{ id: string; title: string; responses: number }[]>([]);

onMounted(() => {
  // In a real application, you would load forms from your backend
  // For demonstration, we'll add a sample form
  userForms.value = [
    { id: '1', title: 'Customer Feedback', responses: 12 },
    { id: '2', title: 'Event Registration', responses: 5 }
  ];
});

// Form responses (for demonstration)
const hasResponses = computed(() => {
  return formData.value.questions.some(q => q.answer !== null && q.answer !== undefined);
});
</script>

<template>
  <MainLayout title="Feedback Forms">
    <div>
      <div class="pa-6 mt-3">
        <!-- Alert for unapproved users -->
        <VAlert
          v-if="!userData.is_approved && user"
          color="#ff9800"
          variant="tonal"
          border="start"
          class="inactive-repo-banner mb-8"
          style="margin: 0;"
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

        <!-- Forms List View -->
        <div v-if="mode === 'create' && formData.questions.length === 0">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h5">Your Forms</h2>
            <VBtn 
              color="primary" 
              prepend-icon="mdi-plus" 
              @click="addQuestion"
            >
              Create New Form
            </VBtn>
          </div>
          
          <VCard v-if="userForms.length === 0">
            <VCardText class="text-center pa-8">
              <div class="text-h6 mb-4">No forms created yet</div>
              <div class="text-body-1 mb-6">Create your first form to collect responses</div>
              <VBtn 
                color="primary" 
                prepend-icon="mdi-plus" 
                @click="addQuestion"
              >
                Create New Form
              </VBtn>
            </VCardText>
          </VCard>
          
          <VRow v-else>
            <VCol 
              v-for="form in userForms" 
              :key="form.id"
              cols="12" 
              sm="6" 
              md="4"
            >
              <VCard>
                <VCardTitle>{{ form.title }}</VCardTitle>
                <VCardText>{{ form.responses }} responses</VCardText>
                <VCardActions>
                  <VBtn variant="text" color="primary">Edit</VBtn>
                  <VBtn variant="text" color="primary">View Responses</VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </div>

        <!-- Form Builder View -->
        <div v-else>
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center">
              <VBtn 
                v-if="formData.questions.length > 0"
                variant="text" 
                icon 
                class="me-2" 
                @click="mode = 'create'; formData.questions = []"
              >
                <VIcon>mdi-arrow-left</VIcon>
              </VBtn>
              <h2 class="text-h5">{{ mode === 'create' ? 'Create Form' : 'Preview Form' }}</h2>
            </div>
            <div>
              <VBtn 
                v-if="formData.questions.length > 0"
                variant="outlined" 
                class="me-2" 
                @click="toggleMode"
              >
                {{ mode === 'create' ? 'Preview' : 'Edit' }}
              </VBtn>
              <VBtn 
                v-if="mode === 'create'"
                color="primary" 
                @click="saveForm"
              >
                Save
              </VBtn>
            </div>
          </div>

          <!-- Form Title Card -->
          <VCard class="mb-6" elevation="2">
            <VCardItem>
              <VTextField
                v-if="mode === 'create'"
                v-model="formData.title"
                variant="underlined"
                class="text-h5"
                placeholder="Form Title"
                hide-details
              ></VTextField>
              <h2 v-else class="text-h5">{{ formData.title }}</h2>
              <VTextarea
                v-if="mode === 'create'"
                v-model="formData.description"
                variant="underlined"
                placeholder="Form Description"
                auto-grow
                hide-details
                rows="1"
                class="mt-2"
              ></VTextarea>
              <p v-else-if="formData.description" class="mt-2">{{ formData.description }}</p>
            </VCardItem>
          </VCard>

          <!-- Questions Section -->
          <div v-if="formData.questions.length > 0">
            <VCard 
              v-for="(question, qIndex) in formData.questions" 
              :key="question.id"
              class="mb-6" 
              elevation="2"
            >
              <VCardItem>
                <!-- Question Title & Type -->
                <div class="d-flex flex-column flex-sm-row justify-space-between align-start">
                  <div class="flex-grow-1">
                    <VTextField
                      v-if="mode === 'create'"
                      v-model="question.title"
                      variant="underlined"
                      placeholder="Question"
                      hide-details
                      class="mb-2"
                    ></VTextField>
                    <h3 v-else class="text-subtitle-1 font-weight-bold">
                      {{ question.title }}
                      <span v-if="question.required" class="text-error">*</span>
                    </h3>
                  </div>
                  <VSelect
                    v-if="mode === 'create'"
                    v-model="question.type"
                    :items="questionTypes"
                    item-title="text"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    class="question-type-select"
                    style="max-width: 180px"
                    hide-details
                  ></VSelect>
                </div>

                <!-- Question Input Area -->
                <div class="mt-4">
                  <!-- Short Answer -->
                  <VTextField
                    v-if="question.type === 'short'"
                    :disabled="mode === 'create'"
                    v-model="question.answer"
                    variant="outlined"
                    placeholder="Short answer text"
                    :hide-details="mode !== 'preview'"
                  ></VTextField>

                  <!-- Paragraph -->
                  <VTextarea
                    v-else-if="question.type === 'paragraph'"
                    :disabled="mode === 'create'"
                    v-model="question.answer"
                    variant="outlined"
                    placeholder="Long answer text"
                    auto-grow
                    rows="3"
                    :hide-details="mode !== 'preview'"
                  ></VTextarea>

                  <!-- Multiple Choice -->
                  <div v-else-if="question.type === 'multiple'">
                    <VRadioGroup
                      v-if="mode === 'preview'"
                      v-model="question.answer"
                      :hide-details="mode !== 'preview'"
                    >
                      <VRadio
                        v-for="(option, oIndex) in question.options"
                        :key="`${question.id}-${oIndex}`"
                        :label="option"
                        :value="option"
                      ></VRadio>
                    </VRadioGroup>
                    <div v-else>
                      <div 
                        v-for="(option, oIndex) in question.options" 
                        :key="`${question.id}-${oIndex}`"
                        class="d-flex align-center mb-2"
                      >
                        <VIcon size="small" class="me-2">mdi-radiobox-blank</VIcon>
                        <VTextField
                          v-model="question.options[oIndex]"
                          variant="outlined"
                          placeholder="Option text"
                          density="compact"
                          hide-details
                          class="flex-grow-1"
                        ></VTextField>
                        <VBtn
                          v-if="question.options.length > 1"
                          variant="text"
                          icon
                          size="small"
                          class="ms-2"
                          @click="removeOption(qIndex, oIndex)"
                        >
                          <PhTrash />
                        </VBtn>
                      </div>
                      <VBtn
                        variant="text"
                        size="small"
                        class="mt-2"
                        @click="addOption(qIndex)"
                      >
                        <PhPlus class="me-2" /> Add Option
                      </VBtn>
                    </div>
                  </div>

                  <!-- Checkboxes -->
                  <div v-else-if="question.type === 'checkbox'">
                    <VCheckboxGroup
                      v-if="mode === 'preview'"
                      v-model="question.answer"
                      :hide-details="mode !== 'preview'"
                    >
                      <VCheckbox
                        v-for="(option, oIndex) in question.options"
                        :key="`${question.id}-${oIndex}`"
                        :label="option"
                        :value="option"
                      ></VCheckbox>
                    </VCheckboxGroup>
                    <div v-else>
                      <div 
                        v-for="(option, oIndex) in question.options" 
                        :key="`${question.id}-${oIndex}`"
                        class="d-flex align-center mb-2"
                      >
                        <VIcon size="small" class="me-2">mdi-checkbox-blank-outline</VIcon>
                        <VTextField
                          v-model="question.options[oIndex]"
                          variant="outlined"
                          placeholder="Option text"
                          density="compact"
                          hide-details
                          class="flex-grow-1"
                        ></VTextField>
                        <VBtn
                          v-if="question.options.length > 1"
                          variant="text"
                          icon
                          size="small"
                          class="ms-2"
                          @click="removeOption(qIndex, oIndex)"
                        >
                          <PhTrash />
                        </VBtn>
                      </div>
                      <VBtn
                        variant="text"
                        size="small"
                        class="mt-2"
                        @click="addOption(qIndex)"
                      >
                        <PhPlus class="me-2" /> Add Option
                      </VBtn>
                    </div>
                  </div>

                  <!-- Dropdown -->
                  <div v-else-if="question.type === 'dropdown'">
                    <VSelect
                      v-if="mode === 'preview'"
                      v-model="question.answer"
                      :items="question.options"
                      variant="outlined"
                      placeholder="Choose an option"
                      :hide-details="mode !== 'preview'"
                    ></VSelect>
                    <div v-else>
                      <div 
                        v-for="(option, oIndex) in question.options" 
                        :key="`${question.id}-${oIndex}`"
                        class="d-flex align-center mb-2"
                      >
                        <span class="me-2 text-grey">{{ oIndex + 1 }}.</span>
                        <VTextField
                          v-model="question.options[oIndex]"
                          variant="outlined"
                          placeholder="Option text"
                          density="compact"
                          hide-details
                          class="flex-grow-1"
                        ></VTextField>
                        <VBtn
                          v-if="question.options.length > 1"
                          variant="text"
                          icon
                          size="small"
                          class="ms-2"
                          @click="removeOption(qIndex, oIndex)"
                        >
                          <PhTrash />
                        </VBtn>
                      </div>
                      <VBtn
                        variant="text"
                        size="small"
                        class="mt-2"
                        @click="addOption(qIndex)"
                      >
                        <PhPlus class="me-2" /> Add Option
                      </VBtn>
                    </div>
                  </div>

                  <!-- Date -->
                  <VDatePicker
                    v-else-if="question.type === 'date'"
                    v-if="mode === 'preview'"
                    v-model="question.answer"
                    :hide-details="mode !== 'preview'"
                  ></VDatePicker>
                  <div v-else-if="question.type === 'date'" class="pa-4 text-grey bg-grey-lighten-4 rounded">
                    Date selector will appear here for users
                  </div>

                  <!-- Time -->
                  <VTextField
                    v-else-if="question.type === 'time'"
                    :disabled="mode === 'create'"
                    v-model="question.answer"
                    type="time"
                    variant="outlined"
                    :hide-details="mode === 'create'"
                  ></VTextField>
                </div>
              </VCardItem>

              <!-- Question Controls -->
              <VCardActions v-if="mode === 'create'">
                <VSpacer></VSpacer>
                <VSwitch
                  v-model="question.required"
                  label="Required"
                  hide-details
                  density="compact"
                  class="me-2"
                ></VSwitch>
                <VBtn
                  variant="text"
                  icon
                  @click="duplicateQuestion(qIndex)"
                >
                  <PhCopy />
                </VBtn>
                <VBtn
                  variant="text"
                  icon
                  color="error"
                  @click="removeQuestion(qIndex)"
                >
                  <PhTrash />
                </VBtn>
              </VCardActions>
            </VCard>

            <!-- Preview Submit Button -->
            <div v-if="mode === 'preview'" class="d-flex justify-end mt-4">
              <VBtn
                color="primary"
                @click="mode = 'create'"
              >
                Submit
              </VBtn>
            </div>
          </div>

          <!-- Add Question Button -->
          <div v-if="mode === 'create'" class="d-flex justify-center mt-4">
            <VBtn
              variant="outlined"
              rounded
              @click="addQuestion"
              prepend-icon="mdi-plus"
            >
              Add Question
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
  .flip-horizontal {
    transform: scaleX(-1);
  }

  .link {
    text-decoration: none !important;
    color: #191919;
    padding: 4px 10px;
  }

  .link:hover {
    background: #e4e4e4;
    color: black;
    font-weight: 500;
    border-radius: 4px;
  }

  .question-type-select {
    min-width: 150px;
  }

  @media (max-width: 600px) {
    .question-type-select {
      margin-top: 12px;
      width: 100%;
      max-width: 100%;
    }
  }

  </style>
