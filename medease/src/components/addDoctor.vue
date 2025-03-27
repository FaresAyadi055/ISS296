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

          <!-- Specialty -->
          <v-text-field v-model="specialty" label="Specialty" required></v-text-field>

          <!-- Phone Number -->
          <v-text-field v-model="phoneNumber" label="Phone Number" type="tel" required></v-text-field>

          <!-- Photo Upload -->
          <v-file-input v-model="photo" label="Upload Photo" accept="image/*" required></v-file-input>

          <!-- Google Maps Location Autocomplete -->
          <v-text-field 
            v-model="location" 
            label="Enter your location"
            ref="autocompleteInput"
            required
          ></v-text-field>

          <!-- Submit Button -->
          <v-btn type="submit" color="primary" block>Send Request</v-btn>
        </v-form>
      </v-card>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title class="text-center">Confirmation</v-card-title>
          <v-card-text>We will confirm your enrollment in a few days. Are you sure?</v-card-text>
          <v-card-actions>
            <v-btn text @click="dialog = false">No</v-btn>
            <v-btn text @click="confirmRequest">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
const location = ref("");
const email = ref("");
const password = ref("");
const dialog = ref(false);
const autocompleteInput = ref(null);
const error = ref("");

// Initialize Google Places Autocomplete
const initGoogleAutocomplete = () => {
  if (!window.google) {
    console.error("Google Places API not loaded!");
    return;
  }
  const autocomplete = new google.maps.places.Autocomplete(
    autocompleteInput.value.$el.querySelector("input"),
    { types: ["geocode"] }
  );
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    location.value = place.formatted_address || "";
  });
};

// Handle form submission
const handleRequest = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/doctors/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      address: address.value,
      specialty: specialty.value,
      phoneNumber: phoneNumber.value,
      location: location.value
    });

    if (response.status === 201) {
      alert('Registration successful! Please login.');
      router.push('/doctorSignin');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// Confirm request
const confirmRequest = () => {
  handleRequest();
  dialog.value = false;
};

onMounted(() => {
  initGoogleAutocomplete();
});
</script>

<style scoped>
.v-card {
  width: 600px;
  margin: auto;
  background-color: white;
}

.text-black {
  color: black;
}

.v-btn.primary {
  color: white;
}
</style>
  