<template>
  <v-app style="background-color: #f8fafc;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />
    <v-main>
      <v-container>
        <v-row>
          <!-- Sidebar Filters -->
          <v-col cols="12" md="3">
            <v-card class="pa-4" style="background-color: white; color: black;">
              <v-card-title>Filters</v-card-title>
              <v-divider></v-divider>

              <div v-for="(subcategories, category) in categories" :key="category">
                <v-checkbox
                  v-if="category !== 'rating'"
                  v-model="selectedCategories"
                  :label="category"
                  :value="category"
                  hide-details
                  dense
                ></v-checkbox>

                <v-expand-transition>
                  <div v-if="selectedCategories.includes(category)" class="ml-4">
                    <v-checkbox
                      v-for="subcategory in subcategories"
                      :key="subcategory"
                      v-model="selectedSubcategories"
                      :label="subcategory"
                      :value="subcategory"
                      hide-details
                      dense
                    ></v-checkbox>
                  </div>
                </v-expand-transition>
              </div>

              <!-- Rating Sorting Checkbox -->
              <v-checkbox
                v-model="sortByRating"
                label="Sort by Rating"
                hide-details
                dense
              ></v-checkbox>
            </v-card>
          </v-col>

          <!-- Doctors List -->
          <v-col cols="12" md="9">
            <div v-if="loading" class="text-center my-5">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-2">Loading doctors...</p>
            </div>
            
            <div v-else-if="doctors.length === 0" class="text-center my-5">
              <p>No doctors found. Please try again later.</p>
            </div>
            
            <v-row v-else>
              <v-col v-for="doctor in filteredDoctors" :key="doctor._id" cols="12" sm="6" md="4">
                <v-card class="pa-3" style="background-color: white; border-radius: 20px; color: black;">
                  <v-img :src="doctor.photo || 'https://i.pravatar.cc/300'" height="150px" contain></v-img>
                  <v-card-title>Dr. {{ doctor.firstName }} {{ doctor.lastName }}</v-card-title>
                  <v-card-subtitle>{{ doctor.specialty }} - {{ doctor.address }}</v-card-subtitle>
                  <v-card-text>⭐ {{ parseFloat(doctor.rating || 0).toFixed(1) }}/5.0</v-card-text>

                  <v-card-actions>
                    <v-btn style="background-color: #6CACFC; color: white; border-radius: 20px;" @click="toggleExpand(doctor._id)">See more</v-btn>
                    <v-btn style="background-color: #6CACFC; color: white; border-radius: 20px;" @click="handleBooking(doctor._id)">Book</v-btn>
                  </v-card-actions>

                  <v-expand-transition>
                    <v-card-text v-if="expandedIndex === doctor._id">
                      {{ doctor.description }}
                    </v-card-text>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Footer from '@/components/footer.vue';
import NavbarAuthPatient from '@/components/navbarAuthPatient.vue';
import Navbar from '@/components/navbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const expandedIndex = ref(null);
const selectedCategories = ref([]);
const selectedSubcategories = ref([]);
const sortByRating = ref(false);
const doctors = ref([]);
const loading = ref(true);

// Define categories locally
const categories = {
  Speciality: [
    "Dermatologist",
    "Cardiologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Hematologist",
    "Neurologist",
    "Pediatrician",
    "Obstetrician",
    "Psychiatrist",
    "Ophthalmologist",
    "Otolaryngologist"
  ],
  Location: [
    "Tunis", "Bizerte", "Zaghouan", "Nabeul", "Sousse", "Kairouan", "Monastir", "Mahdia",
    "Jendouba", "Beja", "Siliana", "Kef", "Kasserine", "Sidi Bouzid", "Sfax", "Gafsa",
    "Gabes", "Tozeur", "Kebili", "Medenine", "Tataouine"
  ]
};

// Fetch doctors from the backend
onMounted(async () => {
  try {
    loading.value = true;
    console.log('Fetching doctors from backend...');
    // Use a baseURL that will work both in development and production
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/doctors`);
    console.log('API Response:', response);
    
    if (response.data && Array.isArray(response.data)) {
      doctors.value = response.data;
      console.log(`Successfully fetched ${doctors.value.length} doctors`);
      if (doctors.value.length > 0) {
        console.log('Sample doctor data:', doctors.value[0]);
      } else {
        console.warn('No doctors found in database');
      }
    } else {
      console.error('Unexpected API response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
  } finally {
    loading.value = false;
  }
});

// Function to check if user is logged in
const isUserLoggedIn = () => {
  const currentUser = sessionStorage.getItem('currentPatient');
  return !!currentUser;
};

// Function to handle booking button click
const handleBooking = (doctorId) => {
  if (isUserLoggedIn()) {
    router.push(`/booking/${doctorId}`);
  } else {
    sessionStorage.setItem('bookingRedirect', `/booking/${doctorId}`);
    router.push('/signIn');
  }
};

const filteredDoctors = computed(() => {
  let filtered = doctors.value;

  if (selectedCategories.value.includes("Speciality") && selectedSubcategories.value.length > 0) {
    filtered = filtered.filter(doctor => selectedSubcategories.value.includes(doctor.specialty));
  }

  if (selectedCategories.value.includes("Location") && selectedSubcategories.value.length > 0) {
    filtered = filtered.filter(doctor => selectedSubcategories.value.includes(doctor.address));
  }

  if (sortByRating.value) {
    return filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }
  return filtered;
});

const toggleExpand = (id) => {
  expandedIndex.value = expandedIndex.value === id ? null : id;
};
</script>
