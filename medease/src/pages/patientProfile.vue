<template>
  <v-app style="background-color: #f8fafc;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />
    
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

              <template v-else>
                <div class="d-flex align-center mb-6">
                  <div class="profile-picture-container mr-4">
                    <v-img 
                      :src="patient?.photo || 'https://via.placeholder.com/150'" 
                      cover
                      class="profile-picture"
                      width="120"
                      height="120"
                      style="border-radius: 50%; object-fit: cover;"
                    ></v-img>
                  </div>
                  <div>
                    <h1 class="text-h3 font-weight-bold mb-2" style="color: #1e3a8a;">
                      {{ patient?.firstName }} {{ patient?.lastName }}
                    </h1>
                    <p class="text-h6" style="color: #64748b;">Patient Profile</p>
                  </div>
                </div>

                <v-divider class="mb-6"></v-divider>

                <div class="d-flex justify-end mb-4">
                  <v-btn
                    :color="isEditing ? 'success' : '#0ea5e9'"
                    class="text-white"
                    @click="toggleEdit"
                  >
                    {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
                  </v-btn>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <h2 class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">Personal Information</h2>
                    <div class="info-list">
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-email</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.email"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ patient?.email }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-phone</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.phone"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ patient?.phone }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-map-marker</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.address"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ patient?.address }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-gender-male-female</v-icon>
                        <template v-if="isEditing">
                          <v-select
                            v-model="editedPatient.gender"
                            :items="['Male', 'Female']"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-select>
                        </template>
                        <span v-else>{{ patient?.gender }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-calendar</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.dob"
                            type="date"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else>{{ patient?.dob }}</span>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <h2 class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">Health Information</h2>
                    <div class="info-list">
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-heart-pulse</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.healthConditions.chronic"
                            label="Chronic Conditions"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else><strong>Chronic Conditions:</strong> {{ patient?.healthConditions?.chronic || 'None' }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-pill</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.healthConditions.medications"
                            label="Current Medications"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else><strong>Current Medications:</strong> {{ patient?.healthConditions?.medications || 'None' }}</span>
                      </div>
                      <div class="info-item">
                        <v-icon color="#0ea5e9" class="mr-2">mdi-alert</v-icon>
                        <template v-if="isEditing">
                          <v-text-field
                            v-model="editedPatient.healthConditions.allergies"
                            label="Allergies"
                            density="compact"
                            hide-details
                            class="flex-grow-1"
                          ></v-text-field>
                        </template>
                        <span v-else><strong>Allergies:</strong> {{ patient?.healthConditions?.allergies || 'None' }}</span>
                      </div>
                    </div>

                    <h2 class="text-h5 font-weight-bold mb-4 mt-6" style="color: #1e3a8a;">Medication Reminders</h2>
                    <div class="reminders-list">
                      <div v-for="(reminder, index) in patient?.healthConditions?.reminders || []" :key="index" class="reminder-item">
                        <div class="d-flex align-center">
                          <v-icon color="#0ea5e9" class="mr-2">mdi-bell</v-icon>
                          <div class="reminder-content">
                            <div class="text-subtitle-1" style="color: #0ea5e9;">{{ reminder.medication }}</div>
                            <div class="text-caption" style="color: #64748b;">
                              Frequency: {{ reminder.frequency }} | Time: {{ reminder.time }} | Duration: {{ reminder.duration }}
                            </div>
                          </div>
                        </div>
                        <v-btn
                          v-if="isEditing"
                          icon="mdi-delete"
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeReminder(index)"
                        ></v-btn>
                      </div>
                    </div>

                    <v-dialog v-model="showAddReminder" max-width="500px">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="#0ea5e9"
                          class="text-white mt-4"
                          v-bind="props"
                        >
                          Add Reminder
                        </v-btn>
                      </template>

                      <v-card class="dialog-card">
                        <v-card-title class="text-h5 pa-4 dialog-title">
                          Add Medication Reminder
                        </v-card-title>
                        <v-card-text class="pa-4 dialog-content">
                          <v-form ref="reminderForm">
                            <v-text-field
                              v-model="newReminder.medication"
                              label="Medication Name"
                              required
                              class="mb-4"
                              bg-color="#f8fafc"
                              variant="outlined"
                              color="#0ea5e9"
                            ></v-text-field>
                            <v-select
                              v-model="newReminder.frequency"
                              :items="['Once daily', 'Twice daily', 'Three times daily', 'Four times daily']"
                              label="Frequency"
                              required
                              class="mb-4"
                              bg-color="#f8fafc"
                              variant="outlined"
                              color="#0ea5e9"
                            ></v-select>
                            <v-text-field
                              v-model="newReminder.time"
                              label="Time"
                              type="time"
                              required
                              class="mb-4"
                              bg-color="#f8fafc"
                              variant="outlined"
                              color="#0ea5e9"
                            ></v-text-field>
                            <v-text-field
                              v-model="newReminder.duration"
                              label="Duration (e.g., 7 days, 1 month)"
                              required
                              class="mb-4"
                              bg-color="#f8fafc"
                              variant="outlined"
                              color="#0ea5e9"
                            ></v-text-field>
                          </v-form>
                        </v-card-text>
                        <v-card-actions class="pa-4 dialog-actions">
                          <v-spacer></v-spacer>
                          <v-btn
                            color="#64748b"
                            variant="outlined"
                            class="cancel-btn"
                            @click="showAddReminder = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="#0ea5e9"
                            class="add-btn"
                            @click="addReminder"
                          >
                            Add Reminder
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <div class="d-flex justify-end">
                  <v-btn
                    color="#0ea5e9"
                    class="text-white"
                    @click="router.push('/HomePatient')"
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
import { useRouter, useRoute } from 'vue-router';
import NavbarAuthPatient from '@/components/navbarAuthPatient.vue';
import Navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';
import patientData from '@/repos/patient.js';

const router = useRouter();
const route = useRoute();
const patient = ref(null);
const isEditing = ref(false);
const editedPatient = ref(null);
const showAddReminder = ref(false);
const reminderForm = ref(null);
const newReminder = ref({
  medication: '',
  frequency: '',
  time: '',
  duration: ''
});

// Function to check if user is logged in
const isUserLoggedIn = () => {
  const currentUser = sessionStorage.getItem('currentPatient');
  if (!currentUser) return false;
  
  // Verify the user exists in patient.js
  const patientId = parseInt(currentUser);
  return patientData.patients.some(patient => patient.id === patientId);
};

// Function to check if user has access to this profile
const hasAccessToProfile = () => {
  const currentUser = sessionStorage.getItem('currentPatient');
  if (!currentUser) return false;
  
  const currentPatientId = parseInt(currentUser);
  const requestedPatientId = parseInt(route.params.id);
  
  return currentPatientId === requestedPatientId;
};

// Function to load patient data
const loadPatientData = () => {
  const patientId = parseInt(route.params.id);
  const foundPatient = patientData.patients.find(p => p.id === patientId);
  
  if (!foundPatient) {
    router.push('/HomePatient');
    return;
  }
  
  patient.value = foundPatient;
  editedPatient.value = JSON.parse(JSON.stringify(foundPatient));
};

// Function to toggle edit mode
const toggleEdit = () => {
  if (isEditing.value) {
    // Save changes
    Object.assign(patient.value, editedPatient.value);
    // Here you would typically make an API call to save the changes
    isEditing.value = false;
  } else {
    // Start editing
    editedPatient.value = JSON.parse(JSON.stringify(patient.value));
    isEditing.value = true;
  }
};

// Function to add a new reminder
const addReminder = () => {
  if (!patient.value.healthConditions) {
    patient.value.healthConditions = {};
  }
  if (!patient.value.healthConditions.reminders) {
    patient.value.healthConditions.reminders = [];
  }
  
  // Create a new reminder object
  const reminder = {
    medication: newReminder.value.medication,
    frequency: newReminder.value.frequency,
    time: newReminder.value.time,
    duration: newReminder.value.duration
  };

  // Add the reminder to both patient and editedPatient
  patient.value.healthConditions.reminders.push(reminder);
  editedPatient.value.healthConditions.reminders.push(reminder);

  // Reset the form
  newReminder.value = {
    medication: '',
    frequency: '',
    time: '',
    duration: ''
  };

  // Close the dialog
  showAddReminder.value = false;
};

// Function to remove a reminder
const removeReminder = (index) => {
  editedPatient.value.healthConditions.reminders.splice(index, 1);
};

onMounted(() => {
  if (!isUserLoggedIn()) {
    router.push('/signin');
    return;
  }
  
  if (!hasAccessToProfile()) {
    router.push('/HomePatient');
    return;
  }
  
  loadPatientData();
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

.v-text-field, .v-select {
  background-color: white;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.reminder-content {
  flex-grow: 1;
}

.dialog-card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dialog-title {
  background-color: #f8fafc;
  color: #1e3a8a;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-content {
  background-color: white;
}

.dialog-actions {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.cancel-btn {
  margin-right: 12px;
  border-color: #e2e8f0;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.cancel-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.add-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
}

.add-btn:hover {
  background-color: #0284c7;
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);
}

.v-text-field, .v-select {
  background-color: #f8fafc;
}

.v-text-field .v-field__input,
.v-select .v-field__input {
  color: #1e3a8a;
}

.v-text-field .v-label,
.v-select .v-label {
  color: #64748b;
}

.v-text-field .v-field__outline,
.v-select .v-field__outline {
  color: #e2e8f0;
}

.v-text-field .v-field:hover .v-field__outline,
.v-select .v-field:hover .v-field__outline {
  color: #0ea5e9;
}

.v-text-field .v-field--focused .v-field__outline,
.v-select .v-field--focused .v-field__outline {
  color: #0ea5e9;
}
</style> 