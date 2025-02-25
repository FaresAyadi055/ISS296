<template>
  <v-container class="search-container mt-8">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="doctorName"
                label="Doctor Name"
                prepend-inner-icon="mdi-account-search"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="3">
              <v-select
                v-model="speciality"
                :items="specialities"
                label="Speciality"
                prepend-inner-icon="mdi-stethoscope"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="city"
                :items="cities"
                label="City"
                prepend-inner-icon="mdi-city"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>

            <v-col cols="12" md="2">
              <v-btn 
                color="#6CAEED" 
                block 
                height="56"
                class="white--text"
              >
                Search
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const doctorName = ref('');
const speciality = ref(null);
const city = ref(null);

const specialities = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'General Medicine',
];

const cities = [
  'Tunis',
  'Sfax',
  'Sousse',
  'Kairouan',
  'Bizerte',
  'Gabès',
];
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 