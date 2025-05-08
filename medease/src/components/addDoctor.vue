<template>
  <v-app style="background-color: #f8fafc;">
    <v-container class="d-flex justify-center align-center">
      <v-card class="pa-6 max-width-800 text-black">
        <v-card-title class="text-center text-blue-800">Doctor Registration</v-card-title>

        <v-form @submit.prevent="handleRequest">
          <!-- First Name -->
          <v-text-field v-model="firstName" label="First Name" required></v-text-field>

          <!-- Last Name -->
          <v-text-field v-model="lastName" label="Last Name" required></v-text-field>

          <!-- Email -->
          <v-text-field v-model="email" label="Email" type="email" required></v-text-field>

          <!-- Password -->
          <v-text-field v-model="password" label="Password" type="password" required></v-text-field>

          <!-- Address -->
          <v-text-field v-model="address" label="Address" required></v-text-field>

          <!-- Specialty (Dropdown) -->
          <v-select v-model="specialty" :items="specialtyOptions" label="Specialty" required></v-select>

          <!-- Phone Number -->
          <v-text-field v-model="phoneNumber" label="Phone Number" type="tel" required></v-text-field>

          <!-- Description -->
          <v-textarea v-model="description" label="Description" required></v-textarea>

          <!-- Working Hours (Schedule) -->
          <v-container>
            <div v-for="day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']" :key="day" class="mb-4">
              <h3 class="text-capitalize mb-2">{{ day }}</h3>
              <div v-if="workingHours[day].length === 0">
                <v-btn @click="addHour(day)" class="modern-add-hour-btn mb-4" color="primary" rounded>
                  <v-icon left size="20">mdi-plus</v-icon>
                  Add Working Hour for {{ day }}
                </v-btn>
              </div>
              <v-row v-else v-for="(hour, index) in workingHours[day]" :key="index" align="center" class="align-center mb-2">
                <v-col>
                  <v-text-field v-model="hour.startTime" label="Start Time" type="time" required class="modern-input"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="hour.endTime" label="End Time" type="time" required class="modern-input"></v-text-field>
                </v-col>
                <v-col class="d-flex align-center">
                  <v-btn @click="removeHour(day, index)" class="modern-remove-hour-btn" icon variant="text">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <div v-if="workingHours[day].length > 0">
                <v-btn @click="addHour(day)" class="modern-add-hour-btn mt-2" color="primary" rounded variant="outlined">
                  <v-icon left size="20">mdi-plus</v-icon>
                  Add Another Hour
                </v-btn>
              </div>
            </div>
          </v-container>

          <!-- Photo Upload -->
          <v-file-input v-model="photo" label="Upload Photo" accept="image/*" required></v-file-input>

          <!-- Submit Button -->
          <v-btn type="submit" color="primary" block>Send Request</v-btn>
        </v-form>
      </v-card>
    </v-container>

    <!-- Error Dialog -->
    <v-dialog v-model="errorDialog" max-width="400px">
      <v-card class="custom-dialog-card">
        <v-card-title class="headline text-center">Error</v-card-title>
        <v-card-text class="text-center">
          <p class="font-weight-medium text-blue">{{ errorMessage }}</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="errorDialog = false" color="blue" class="custom-btn">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400px">
      <v-card class="custom-dialog-card">
        <v-card-title class="headline text-center">Success</v-card-title>
        <v-card-text class="text-center">
          <p class="font-weight-medium text-blue">{{ successMessage }}</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="successDialog = false" color="blue" class="custom-btn">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Form fields
const firstName = ref("");
const lastName = ref("");
const address = ref("");
const specialty = ref("");
const phoneNumber = ref("");
const photo = ref(null);
const email = ref("");
const password = ref("");
const description = ref("");
const errorDialog = ref(false);
const successDialog = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Initialize working hours for all days
const workingHours = ref({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
});

// Specialty options
const specialtyOptions = ref([
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic Surgeon",
  "General Practitioner",
  "Ophthalmologist",
  "Psychiatrist"
]);

const addHour = (day) => {
  if (workingHours.value[day].length === 0) {
    workingHours.value[day].push({ startTime: "", endTime: "" });
  }
};

const removeHour = (day, index) => {
  workingHours.value[day].splice(index, 1);
};

const showError = (message) => {
  errorMessage.value = message;
  errorDialog.value = true;
};

const showSuccess = (message) => {
  successMessage.value = message;
  successDialog.value = true;
};

// Handle form submission
const handleRequest = async () => {
  try {
    // Check if all required fields are filled
    if (!firstName.value || !lastName.value || !email.value || !password.value || !address.value || !specialty.value || !phoneNumber.value || !description.value) {
      showError("Please fill in all the required fields.");
      return;
    }

    // Check if at least one working hour is set for each day
    const hasWorkingHours = Object.values(workingHours.value).some(day => day.length > 0);
    if (!hasWorkingHours) {
      showError("Please add at least one working hour for each day.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName.value);
    formData.append("lastName", lastName.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("address", address.value);
    formData.append("specialty", specialty.value);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("description", description.value);
    formData.append("workingHours", JSON.stringify(workingHours.value));

    if (photo.value) {
      formData.append("photo", photo.value);
    }

    const response = await axios.post('http://localhost:3001/api/doctors/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 201) {
      showSuccess('Registration successful! Please login.');
      router.push('/doctorSignin');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};
</script>

<style scoped>
.v-card {
  width: 600px;
  margin: auto;
  background-color: white;
}

.modern-add-hour-btn {
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%) !important;
  color: #fff !important;
  border-radius: 25px !important;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px 0 rgba(14, 165, 233, 0.10);
  transition: background 0.2s, box-shadow 0.2s;
}
.modern-add-hour-btn:hover {
  background: linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%) !important;
  box-shadow: 0 4px 16px 0 rgba(14, 165, 233, 0.16);
}
.modern-remove-hour-btn {
  border-radius: 50% !important;
  background: #ffeaea !important;
  color: #e53935 !important;
  min-width: 36px !important;
  min-height: 36px !important;
  width: 36px !important;
  height: 36px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.modern-remove-hour-btn:hover {
  background: #ffbdbd !important;
  color: #b71c1c !important;
}
</style>
