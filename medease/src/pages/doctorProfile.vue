<template>
  <v-app style="background-color: #f8fafc;">
    <NavbarDoctor />
    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccess"
      color="success"
      timeout="3000"
    >
      {{ message }}
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ message }}
    </v-snackbar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="pa-6" style="background-color: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
              <div v-if="!doctor" class="text-center pa-6">
                <h1 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">Loading Profile...</h1>
              </div>

              <template v-else>
                <div class="d-flex align-center mb-6">
                  <div class="profile-picture-container mr-4">
                    <v-img 
                      :src="doctor?.photo || '/default-doctor.png'" 
                      cover
                      class="profile-picture"
                      width="120"
                      height="120"
                      style="border-radius: 50%; object-fit: cover;"
                    ></v-img>
                  </div>
                  <div>
                    <h1 class="text-h3 font-weight-bold mb-2" style="color: #1e3a8a;">
                      Dr. {{ doctor?.firstName }} {{ doctor?.lastName }}
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
                            v-model="editedDoctor.phoneNumber"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ doctor?.phoneNumber }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-map-marker</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedDoctor.address"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ doctor?.address }}</span>
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
import { useRouter } from 'vue-router';
import NavbarDoctor from '@/components/navbardoctor.vue';
import Footer from '@/components/footer.vue';
import axios from 'axios';

const router = useRouter();
const doctor = ref(null);
const isEditing = ref(false);
const editedDoctor = ref(null);
const showSuccess = ref(false);
const showError = ref(false);
const message = ref('');

// Function to check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  const doctorData = localStorage.getItem('doctor');
  return !!(token && doctorData);
};

// Function to load doctor data
const loadDoctorData = async () => {
  try {
    const doctorData = JSON.parse(localStorage.getItem('doctor'));
    if (!doctorData || !doctorData.id) {
      router.push('/signInDoctor');
      return;
    }

    const response = await axios.get(`http://localhost:3001/api/doctors/${doctorData.id}`);
    doctor.value = response.data;
    editedDoctor.value = JSON.parse(JSON.stringify(response.data));
  } catch (error) {
    console.error('Error loading doctor data:', error);
    router.push('/signInDoctor');
  }
};

// Function to toggle edit mode
const toggleEdit = async () => {
  if (isEditing.value) {
    try {
      const doctorData = JSON.parse(localStorage.getItem('doctor'));
      const token = localStorage.getItem('token');
      
      // Create a copy of editedDoctor without sensitive data
      const updateData = {
        firstName: editedDoctor.value.firstName,
        lastName: editedDoctor.value.lastName,
        email: editedDoctor.value.email,
        phoneNumber: editedDoctor.value.phoneNumber,
        address: editedDoctor.value.address,
        specialty: editedDoctor.value.specialty,
        description: editedDoctor.value.description
      };

      const response = await axios.put(
        `http://localhost:3001/api/doctors/${doctorData.id}`, 
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local data
      doctor.value = response.data;
      editedDoctor.value = JSON.parse(JSON.stringify(response.data));
      isEditing.value = false;
      
      // Show success message
      message.value = 'Profile updated successfully!';
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);

      // Update localStorage with new data
      const updatedDoctorData = {
        ...doctorData,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        specialty: response.data.specialty
      };
      localStorage.setItem('doctor', JSON.stringify(updatedDoctorData));
    } catch (error) {
      console.error('Error updating doctor data:', error);
      message.value = error.response?.data?.message || 'Failed to update profile. Please try again.';
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 3000);
    }
  } else {
    editedDoctor.value = JSON.parse(JSON.stringify(doctor.value));
    isEditing.value = true;
  }
};

onMounted(() => {
  if (!isUserLoggedIn()) {
    router.push('/signInDoctor');
    return;
  }
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