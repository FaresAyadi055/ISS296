<template>
  <v-app style="background-color: #f8fafc;">
    <navbar app />
    
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-6" style="background-color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
              <div v-if="!isUserLoggedIn()" class="text-center pa-6">
                <h1 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">Access Denied</h1>
                <p class="text-h6 mb-6" style="color: #64748b;">Please sign in to view your profile</p>
                <v-btn
                  color="#0ea5e9"
                  class="text-white"
                  @click="router.push('/signin')"
                >
                  Sign In
                </v-btn>
              </div>

              <div v-else-if="!hasAccessToProfile()" class="text-center pa-6">
                <h1 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">Access Denied</h1>
                <p class="text-h6 mb-6" style="color: #64748b;">You don't have permission to view this profile</p>
                <v-btn
                  color="#0ea5e9"
                  class="text-white"
                  @click="router.push('/HomeDoctor')"
                >
                  Back to Home
                </v-btn>
              </div>

              <template v-else>
                <div v-if="!doctor" class="text-center pa-6">
                  <h1 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">Doctor Not Found</h1>
                  <p class="text-h6 mb-6" style="color: #64748b;">The requested doctor profile could not be found.</p>
                  <v-btn
                    color="#0ea5e9"
                    class="text-white"
                    @click="router.push('/HomeDoctor')"
                  >
                    Back to Home
                  </v-btn>
                </div>

                <template v-else>
                  <div class="d-flex align-center mb-6">
                    <div class="profile-picture-container mr-4">
                      <v-img 
                        :src="doctor?.image" 
                        cover
                        class="profile-picture"
                        width="120"
                        height="120"
                        style="border-radius: 50%; object-fit: cover;"
                      ></v-img>
                    </div>
                    <div>
                      <h1 class="text-h3 font-weight-bold mb-2" style="color: #1e3a8a;">
                        {{ doctor?.name }}
                      </h1>
                      <p class="text-h6" style="color: #64748b;">Doctor Profile</p>
                    </div>
                  </div>

                  <v-divider class="mb-6"></v-divider>

                  <v-row>
                    <v-col cols="12" md="6">
                      <h2 class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">Personal Information</h2>
                      <div class="info-list">
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-email</v-icon>
                          <template v-if="isEditing">
                            <v-text-field
                              v-model="editedDoctor.email"
                              density="compact"
                              hide-details
                              class="flex-grow-1"
                            ></v-text-field>
                          </template>
                          <span v-else>{{ doctor?.email }}</span>
                        </div>
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-phone</v-icon>
                          <template v-if="isEditing">
                            <v-text-field
                              v-model="editedDoctor.phone"
                              density="compact"
                              hide-details
                              class="flex-grow-1"
                            ></v-text-field>
                          </template>
                          <span v-else>{{ doctor?.phone }}</span>
                        </div>
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-map-marker</v-icon>
                          <template v-if="isEditing">
                            <v-text-field
                              v-model="editedDoctor.location"
                              density="compact"
                              hide-details
                              class="flex-grow-1"
                            ></v-text-field>
                          </template>
                          <span v-else>{{ doctor?.location }}</span>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <h2 class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">Professional Information</h2>
                      <div class="info-list">
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-stethoscope</v-icon>
                          <template v-if="isEditing">
                            <v-text-field
                              v-model="editedDoctor.specialty"
                              label="Specialty"
                              density="compact"
                              hide-details
                              class="flex-grow-1"
                            ></v-text-field>
                          </template>
                          <span v-else><strong>Specialty:</strong> {{ doctor?.specialty }}</span>
                        </div>
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-text-box</v-icon>
                          <template v-if="isEditing">
                            <v-textarea
                              v-model="editedDoctor.description"
                              label="Description"
                              density="compact"
                              hide-details
                              class="flex-grow-1"
                              rows="3"
                            ></v-textarea>
                          </template>
                          <span v-else><strong>Description:</strong> {{ doctor?.description }}</span>
                        </div>
                        <div class="info-item">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-star</v-icon>
                          <span>
                            <strong>Rating:</strong> 
                            <v-rating
                              v-model="doctor.rating"
                              color="#0ea5e9"
                              readonly
                              half-increments
                              class="d-inline-block ml-2"
                            ></v-rating>
                            {{ doctor.rating }}
                          </span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <div class="d-flex justify-end mb-4">
                    <v-btn
                      color="#0ea5e9"
                      class="text-white"
                      @click="toggleEdit"
                    >
                      {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
                    </v-btn>
                  </div>

                  <v-divider class="my-6"></v-divider>

                  <div class="d-flex justify-end">
                    <v-btn
                      color="#0ea5e9"
                      class="text-white"
                      @click="router.push('/HomeDoctor')"
                    >
                      Back to Home
                    </v-btn>
                  </div>
                </template>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';
import { doctorlist } from '@/repos/doctors.js';

const router = useRouter();
const route = useRoute();
const doctor = ref(null);
const isEditing = ref(false);
const editedDoctor = ref(null);

// Function to check if user is logged in
const isUserLoggedIn = () => {
  const currentDoctor = sessionStorage.getItem('currentDoctor');
  if (!currentDoctor) return false;
  
  const doctorId = parseInt(currentDoctor);
  return doctorlist.doctors.some(d => d.id === doctorId);
};

// Function to check if doctor has access to this profile
const hasAccessToProfile = () => {
  const currentDoctor = sessionStorage.getItem('currentDoctor');
  if (!currentDoctor) return false;
  
  const currentDoctorId = parseInt(currentDoctor);
  const requestedDoctorId = parseInt(route.params.id);
  
  return currentDoctorId === requestedDoctorId;
};

// Function to load doctor data
const loadDoctorData = () => {
  if (!isUserLoggedIn()) {
    router.push('/signin');
    return;
  }

  if (!hasAccessToProfile()) {
    router.push('/HomeDoctor');
    return;
  }

  const doctorId = parseInt(route.params.id);
  const foundDoctor = doctorlist.doctors.find(d => d.id === doctorId);
  
  if (!foundDoctor) {
    doctor.value = null;
    return;
  }
  
  doctor.value = foundDoctor;
  editedDoctor.value = JSON.parse(JSON.stringify(foundDoctor));
};

// Function to toggle edit mode
const toggleEdit = () => {
  if (isEditing.value) {
    // Save changes
    Object.assign(doctor.value, editedDoctor.value);
    // Here you would typically make an API call to save the changes
    isEditing.value = false;
  } else {
    // Start editing
    editedDoctor.value = JSON.parse(JSON.stringify(doctor.value));
    isEditing.value = true;
  }
};

onMounted(() => {
  loadDoctorData();
});
</script>

<style scoped>
.v-main {
  padding: 80px 0;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.profile-picture-container {
  position: relative;
  display: inline-block;
}

.profile-picture {
  border: 3px solid #0ea5e9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: #1e3a8a;
  font-size: 1rem;
}

.info-item strong {
  color: #1e3a8a;
  margin-right: 8px;
}

.v-text-field, .v-select, .v-textarea {
  background-color: white;
}

.v-text-field .v-field__input,
.v-select .v-field__input,
.v-textarea .v-field__input {
  color: #1e3a8a;
}

.v-text-field .v-label,
.v-select .v-label,
.v-textarea .v-label {
  color: #64748b;
}

.v-text-field .v-field__outline,
.v-select .v-field__outline,
.v-textarea .v-field__outline {
  color: #e2e8f0;
}

.v-text-field .v-field:hover .v-field__outline,
.v-select .v-field:hover .v-field__outline,
.v-textarea .v-field:hover .v-field__outline {
  color: #0ea5e9;
}

.v-text-field .v-field--focused .v-field__outline,
.v-select .v-field--focused .v-field__outline,
.v-textarea .v-field--focused .v-field__outline {
  color: #0ea5e9;
}
</style> 