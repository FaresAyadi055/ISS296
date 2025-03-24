<template>
  <v-app style="background-color: #f8fafc;">
    <NavBar />
    
    <v-main>
      <v-container>
        
        <v-row class="d-flex align-center mt-8 mb-16">
          <v-col cols="12" md="6" class="pr-10">
            <h1 class="text-h2 font-weight-black mb-6" style="color: #1e3a8a;">
              Take care of your<br>
              <span style="color: #0ea5e9;">health in time</span>
            </h1>
            <p class="text-h5 mb-8" style="color: #64748b; line-height: 1.7;">
              Connect with trusted healthcare professionals anytime,<br>
              anywhere with our easy-to-use web application
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <v-img
              :src="doctorIllustration"
              contain
              max-height="600"
            ></v-img>
          </v-col>
        </v-row>

        
        <v-row class="my-16 py-16" style="background-color: #f0f9ff;">
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">
              Why book with MedEase?
            </h2>
            <p class="text-h5" style="color: #64748b;">
              Book your doctor's appointment online differently
            </p>
          </v-col>

          <v-col cols="12" md="6" class="d-flex pa-8">
            <v-img
              :src="heartIcon"
              max-width="72"
              class="mr-6"
            ></v-img>
            <div>
              <h3 class="text-h4 font-weight-bold mb-2" style="color: #1e3a8a;">
                Faster Access to Care
              </h3>
              <p class="text-body-1" style="color: #64748b; line-height: 1.7;">
                Real-time availability updates and instant booking system
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-flex pa-8">
            <v-img
              :src="calendarIcon"
              max-width="72"
              class="mr-6"
            ></v-img>
            <div>
              <h3 class="text-h4 font-weight-bold mb-2" style="color: #1e3a8a;">
                Health Management
              </h3>
              <p class="text-body-1" style="color: #64748b; line-height: 1.7;">
                Smart reminders and in-person appointment management
              </p>
            </div>
          </v-col>
        </v-row>

        
        <v-row class="my-16 py-16 text-center">
          <v-col cols="12">
            <div class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">
              MedEase by the numbers
            </div>
            <div class="text-h1 font-weight-black mb-4" style="color: #0ea5e9;">
              200,000+
            </div>
            <p class="text-h5" style="color: #64748b;">
              people getting better healthcare
            </p>
            <div class="text-h1 font-weight-black mb-4" style="color: #0ea5e9; margin-top: 50px;">
              10,000,000+
            </div>
            <p class="text-h5" style="color: #64748b;">
              people getting better
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import NavBar from '@/components/navbarpatient.vue'
import Footer from '@/components/footer.vue'
import doctorIllustration from '@/assets/doctor-illustration.png'
import heartIcon from '@/assets/heart-icon.png'
import calendarIcon from '@/assets/calendar-icon.png'

</script>

<style scoped>
.v-main {
  padding: 80px 0;
}

@media (max-width: 960px) {
  .text-h2 {
    font-size: 2.5rem !important;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .text-h5 {
    font-size: 1.1rem !important;
  }
}

.v-btn {
  text-transform: none;
  padding: 20px 40px !important;
  font-size: 1.1rem;
  font-weight: 600;
}
</style> 