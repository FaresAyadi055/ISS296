<template>
  <v-app-bar app color="#0a1930" dark>
    <v-toolbar-title class="font-weight-bold mr-4" style="color: #D5DE58;">MedEase.</v-toolbar-title>
    
    <template v-if="isAuthenticated">
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/HomePatient">Home</v-btn>
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/emergency-trackingPatient">Emergency Tracking</v-btn>
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/bookingPagePatient">Booking</v-btn>
      
      <v-spacer></v-spacer>
      
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn class="mx-2" rounded style="background-color: #579AFE;" v-bind="props">
            <v-icon class="mr-2">
              <img src="@/assets/profile.png" alt="Profile" style="width: 24px; height: 24px;">
            </v-icon>
            {{ patientName }}
          </v-btn>
        </template>

        <v-card min-width="200" class="profile-dropdown" style="background-color: white; border-radius: 15px;">
          <v-card-text class="pa-4">
            <div class="text-h6 pb-2" style="color: #1976D2; font-weight: bold;">{{ patientName }}</div>
            <div class="text-caption pb-2" style="color: #579AFE;">Connected</div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn 
              variant="text"
              block 
              class="profile-btn"
              to="/patient/profile"
              @click="menu = false"
            >
              View Profile
            </v-btn>
            <v-btn 
              variant="text"
              block 
              class="logout-btn"
              @click="logout"
            >
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>

    <template v-else>
      <v-spacer></v-spacer>
      <v-btn 
        class="mx-2" 
        rounded 
        style="background-color: #579AFE; color: #FFFFFF;" 
        to="/signInPatient"
      >
        Sign In
      </v-btn>
      <v-btn 
        class="mx-2" 
        rounded 
        style="background-color: #579AFE; color: #FFFFFF;" 
        to="/signInPatient"
      >
        Register
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menu = ref(false);
const patientName = ref('');
const isAuthenticated = ref(false);

onMounted(() => {
  const token = localStorage.getItem('token');
  const patient = localStorage.getItem('patient');
  
  if (token && patient) {
    isAuthenticated.value = true;
    const patientData = JSON.parse(patient);
    patientName.value = `${patientData.firstName} ${patientData.lastName}`;
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('patient');
  sessionStorage.removeItem('currentPatient');
  sessionStorage.removeItem('bookingRedirect');
  isAuthenticated.value = false;
  patientName.value = '';
  router.push('/');
  menu.value = false;
};
</script>

<style scoped>
.profile-dropdown {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-btn, .logout-btn {
  color: #1976D2 !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
  transition: all 0.3s ease;
}

.profile-btn:hover, .logout-btn:hover {
  color: #1976D2 !important;
  background-color: rgba(25, 118, 210, 0.04) !important;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.15);
  transform: translateY(-1px);
}
</style> 