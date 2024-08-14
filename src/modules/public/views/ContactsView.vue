<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
const {isMobile, isSmall} = useScreenStore();
</script>

<template>
  <VLayout>
    <div style="width: 100%">
    <Navbar>
        <div class="landing-container">
          <VContainer>
            <p class="text-heading text-center gradient-text">
              Connect with Us
            </p>
            <p class="text-center text-subtitle px-sm-10 px-xs-5">
              Reach out to us with any questions or inquiries you may have. We're here to assist you <br v-if=" !isSmall && !isMobile "/> and provide the information you need. Feel free to ask us anything.
            </p>
            <VRow class="ma-0 my-10" justify="center">
              <div class="w-75 bg-white rounded-lg pa-6" style="border: 1px solid #e4e4e4;">
                <div class="mb-5">
                  <label class="input-label">First Name</label>
                  <VTextField
                      placeholder="e.g. John"
                      class="my-2"
                      hide-details
                      rounded="lg"
                      density="comfortable"
                      variant="outlined"
                      color="primary"
                      base-color="gs60"
                  />
                </div>
                <div class="mb-5">
                  <label class="input-label">Last Name</label>
                  <VTextField
                      placeholder="e.g. Doe"
                      class="my-2"
                      hide-details
                      rounded="lg"
                      density="comfortable"
                      variant="outlined"
                      color="primary"
                      base-color="gs60"
                  />
                </div>
                <div class="mb-5">
                  <label class="input-label">Email</label>
                  <VTextField
                      placeholder="user@example.com"
                      class="my-2"
                      hide-details
                      rounded="lg"
                      density="comfortable"
                      variant="outlined"
                      color="primary"
                      base-color="gs60"
                  />
                </div>
                <div class="mb-5">
                  <label class="input-label">How can we help?</label>
                  <VTextarea
                      placeholder="E.g. Repository Issues"
                      class="my-2"
                      hide-details
                      rounded="lg"
                      density="comfortable"
                      variant="outlined"
                      color="primary"
                      base-color="gs60"
                  />
                </div>
                <VRow class="ma-0" justify="end">
                  <VBtnPrimaryFilled
                      rounded="lg"
                      height="44px"
                      width="166px"
                  >
                    Submit
                  </VBtnPrimaryFilled>
                </VRow>
              </div>
            </VRow>
          </VContainer>
        </div>
      <Footer/>
    </Navbar>
    </div>
  </VLayout>
</template>

<style scoped>
.text-heading{
  font-family: 'Gambetta', serif !important;
  font-weight: 500;
  font-size: 56px !important;
  line-height: 60px;
  margin-top: 30px;
}

.text-subtitle{
  font-size: 21px;
  color: #0c0c0c;
  margin: 15px 0;
  padding: 0 5px;
}

@media (max-width: 960px) {
  .text-heading{
    font-size: 62px !important;
    line-height: 80px;
    margin-top: 70px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .text-heading, .heading-font{
    font-size: 40px !important;
    line-height: 46px;
    margin-top: 40px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 18px;
  }
}

@media (max-width: 476px) {
  .text-heading, .heading-font{
    font-size: 28px !important;
    line-height: 33px;
    margin-top: 25px;
  }

  .text-subtitle{
    margin: 15px 0;
    font-size: 16px;
  }
}

.gradient-text {
  color: #062b3e;
}

.heading-font{
  font-family: 'Gambetta', serif !important;
}


:deep(.v-label){
  opacity: 100% !important;
}

:deep(.v-icon){
  --v-icon-size-multiplier: 1.23
}

:deep(.v-field__outline){
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder){
  color: #5F6061;
  opacity: 90%;
}

:deep(textarea::placeholder){
  color: #5F6061;
  opacity: 90%;
}

</style>