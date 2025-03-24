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
import { doctorlist } from '../repos/doctors.js'; // Import doctor data

// Form fields
const firstName = ref("");
const lastName = ref("");
const address = ref("");
const specialty = ref("");
const phoneNumber = ref("");
const photo = ref(null);
const location = ref("");
const dialog = ref(false);
const autocompleteInput = ref(null);

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
const handleRequest = () => {
  const newDoctor = {
    id: doctorlist.doctors.length + 1, // Simple ID generation
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    specialty: specialty.value,
    phoneNumber: phoneNumber.value,
    photo: photo.value,
    email: email.value, // Add email field
    password: password.value, // Add password field
  };
  doctorlist.doctors.push(newDoctor); // Add to the doctor data
  console.log("Doctor Request Sent:", newDoctor);
  dialog.value = false;
  alert("Your request has been sent successfully!");
};

// Confirm request
const confirmRequest = () => {
  console.log("Doctor Request Sent:", {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    specialty: specialty.value,
    phoneNumber: phoneNumber.value,
    photo: photo.value,
    location: location.value,
  });
  dialog.value = false;
  alert("Your request has been sent successfully!");
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
  