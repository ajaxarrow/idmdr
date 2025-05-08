<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import MapSnippet from "../components/Contact/MapSnippet.vue";
import {IconBrandFacebookFilled, IconBrandYoutubeFilled, IconMailFilled} from "@tabler/icons-vue";
</script>

<template>
  <VLayout>
    <div style="width: 100%">
    <Navbar>
<!--        <div class="landing-container">-->
<!--          <VContainer>-->
<!--            <p class="text-heading text-center gradient-text">-->
<!--              Connect with Us-->
<!--            </p>-->
<!--            <p class="text-center text-subtitle px-sm-10 px-xs-5">-->
<!--              Reach out to us with any questions or inquiries you may have. We're here to assist you <br v-if=" !isSmall && !isMobile "/> and provide the information you need. Feel free to ask us anything.-->
<!--            </p>-->
<!--            <VRow class="ma-0 my-10" justify="center">-->
<!--              <div class="w-75 bg-white rounded-lg pa-6" style="border: 1px solid #e4e4e4;">-->
<!--                <div class="mb-5">-->
<!--                  <label class="input-label">First Name</label>-->
<!--                  <VTextField-->
<!--                      placeholder="e.g. John"-->
<!--                      class="my-2"-->
<!--                      hide-details-->
<!--                      rounded="lg"-->
<!--                      density="comfortable"-->
<!--                      variant="outlined"-->
<!--                      color="primary"-->
<!--                      base-color="gs60"-->
<!--                  />-->
<!--                </div>-->
<!--                <div class="mb-5">-->
<!--                  <label class="input-label">Last Name</label>-->
<!--                  <VTextField-->
<!--                      placeholder="e.g. Doe"-->
<!--                      class="my-2"-->
<!--                      hide-details-->
<!--                      rounded="lg"-->
<!--                      density="comfortable"-->
<!--                      variant="outlined"-->
<!--                      color="primary"-->
<!--                      base-color="gs60"-->
<!--                  />-->
<!--                </div>-->
<!--                <div class="mb-5">-->
<!--                  <label class="input-label">Email</label>-->
<!--                  <VTextField-->
<!--                      placeholder="user@example.com"-->
<!--                      class="my-2"-->
<!--                      hide-details-->
<!--                      rounded="lg"-->
<!--                      density="comfortable"-->
<!--                      variant="outlined"-->
<!--                      color="primary"-->
<!--                      base-color="gs60"-->
<!--                  />-->
<!--                </div>-->
<!--                <div class="mb-5">-->
<!--                  <label class="input-label">How can we help?</label>-->
<!--                  <VTextarea-->
<!--                      placeholder="E.g. Repository Issues"-->
<!--                      class="my-2"-->
<!--                      hide-details-->
<!--                      rounded="lg"-->
<!--                      density="comfortable"-->
<!--                      variant="outlined"-->
<!--                      color="primary"-->
<!--                      base-color="gs60"-->
<!--                  />-->
<!--                </div>-->
<!--                <VRow class="ma-0" justify="end">-->
<!--                  <VBtnPrimaryFilled-->
<!--                      rounded="lg"-->
<!--                      height="44px"-->
<!--                      width="166px"-->
<!--                  >-->
<!--                    Submit-->
<!--                  </VBtnPrimaryFilled>-->
<!--                </VRow>-->
<!--              </div>-->
<!--            </VRow>-->
<!--          </VContainer>-->
<!--        </div>-->
      <div class="">
        <VContainer>
          <p class="text-heading text-center gradient-text">
            <em class="heading-font">Get in touch with us</em>
          </p>
          <VRow justify="center" class="ma-0 pa-5">
            <VCol cols="12" sm="12" md="7" xxl="8" xl="8" lg="8" class="my-2">
              <MapSnippet class=""/>
            </VCol>
            <VCol cols="12" sm="12" md="5" xxl="4" xl="4" lg="4" class="my-2">
              <div class="bg-sb20 contact-details-card pa-5">
                <div>
                  <div class="my-2">
                    <p class="text-contact-title">
                      Address
                    </p>
                    <p class="text-desc">
                      2nd floor RDE Building, College Park, Musuan, Bukidnon
                    </p>
                  </div>
                  <div class="my-2">
                    <p class="text-contact-title">
                      Phone
                    </p>
                    <p class="text-desc">
                      0917-1027-065
                    </p>
                  </div>
                  <div class="my-2">
                    <p class="text-contact-title">
                      Email
                    </p>
                    <p class="text-desc">
                      nomcaarrd@cmu.edu.ph
                    </p>
                  </div>
                </div>
                <div class="d-flex ga-2">
                  <a href="https://web.facebook.com/NOMCAARRD/" target="_blank">
                    <div class="logo-icon" >
                      <IconBrandFacebookFilled :size="30" color="#050E14"/>
                    </div>
                  </a>
                  <a href="https://www.youtube.com/channel/UCWc3VFaHFLj9LDMjfyWdjEA" target="_blank">
                    <div class="logo-icon" >
                      <IconBrandYoutubeFilled :size="30" color="#050E14"/>
                    </div>
                  </a>
                  <a href="https://mail.google.com/mail/u/0/?fs=1&to=nomcaarrd@cmu.edu.ph&tf=cm" target="_blank">
                    <div class="logo-icon" >
                      <IconMailFilled :size="30" color="black"/>

                    </div>
                  </a>
                </div>
              </div>
            </VCol>
          </VRow>
        </VContainer>
      </div>
      <Footer/>
    </Navbar>
    </div>
  </VLayout>
</template>

<style scoped>
.text-contact-title{
  font-size: 18px;
  font-weight: 500;
  color: #5e5e5e;
}

.text-desc{
  font-family: 'Gambetta', serif !important;
  font-size: 20px;
  font-weight: 700;
  color: #050E14;
}
.logo-icon{
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 50px;
  height: 50px;
  text-decoration: none;
  border-radius: 50%;

}
.contact-details-card{
  height: 400px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

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