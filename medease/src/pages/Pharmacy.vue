<template>
  <v-app style="background-color: #f8fafc;">
    <NavBarDoctor v-if="isDoctor" />
    <NavBar v-else />
    
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h3 font-weight-bold mb-6" style="color: #1e3a8a;">
              MedEase Pharmacy
            </h1>
            
            <!-- Search Bar -->
            <v-card class="mb-6 pa-4" style="background-color: white; color: #1e3a8a;">
              <v-text-field
                v-model="search"
                label="Search medications..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="mb-4"
                style="color: #1e3a8a;"
                input-class="pharmacy-search-input"
              ></v-text-field>
              
              <!-- Category Filter -->
              <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Filter by category"
                variant="outlined"
                hide-details
                style="color: #1e3a8a;"
                input-class="pharmacy-search-input"
              ></v-select>
            </v-card>

            <!-- Medications Grid -->
            <v-row>
              <v-col v-for="medication in filteredMedications" :key="medication._id" cols="12" sm="6" md="4" lg="3">
                <v-card class="h-100" style="background-color: white;">
                  <v-img
                    :src="medication.image || 'https://via.placeholder.com/300x200'"
                    height="200"
                    cover
                    class="align-end"
                  >
                    <v-card-title
                      class="font-weight-bold"
                      style="background: rgba(255,255,255,0.85); color: #1e3a8a;"
                    >
                      {{ medication.name }}
                    </v-card-title>
                  </v-img>

                  <v-card-text>
                    <div class="text-subtitle-1 font-weight-bold mb-2">{{ medication.category }}</div>
                    <div class="text-body-2 mb-2">{{ medication.description }}</div>
                    <div class="text-h6 font-weight-bold" style="color: #0ea5e9;">
                      ${{ medication.price.toFixed(2) }}
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="flat"
                      block
                      @click="showMedicationDetails(medication)"
                    >
                      View Details
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Medication Details Dialog -->
    <v-dialog v-model="showDetails" max-width="600">
      <v-card v-if="selectedMedication">
        <v-img
          :src="selectedMedication.image || 'https://via.placeholder.com/600x300'"
          height="300"
          cover
        ></v-img>

        <v-card-title class="text-h4">
          {{ selectedMedication.name }}
        </v-card-title>

        <v-card-text>
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Category: {{ selectedMedication.category }}
          </div>
          <div class="text-body-1 mb-4">
            {{ selectedMedication.description }}
          </div>
          <div class="text-h5 font-weight-bold mb-4" style="color: #0ea5e9;">
            ${{ selectedMedication.price.toFixed(2) }}
          </div>
          <div class="text-body-2">
            <strong>Dosage:</strong> {{ selectedMedication.dosage }}
          </div>
          <div class="text-body-2">
            <strong>Side Effects:</strong> {{ selectedMedication.sideEffects }}
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showDetails = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Footer />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import NavBarDoctor from '@/components/navbardoctor.vue'
import NavBar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'

// State
const search = ref('')
const selectedCategory = ref('All')
const showDetails = ref(false)
const selectedMedication = ref(null)
const medications = ref([]);
const loading = ref(true);

// Check if user is doctor
const isDoctor = computed(() => {
  return localStorage.getItem('doctor') !== null
})

// Categories
const categories = [
  'All',
  'Pain Relief',
  'Antibiotics',
  'Vitamins',
  'Heart Health',
  'Diabetes',
  'Respiratory',
  'Mental Health'
]

onMounted(async () => {
  try {
    loading.value = true;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/medications`);
    console.log('Fetched medications:', response.data);
    medications.value = response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
  } finally {
    loading.value = false;
  }
});

// Filtered medications
const filteredMedications = computed(() => {
  return medications.value.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(search.value.toLowerCase()) ||
                         medication.description.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || medication.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Show medication details
const showMedicationDetails = (medication) => {
  selectedMedication.value = medication
  showDetails.value = true
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}

.pharmacy-search-input {
  color: #1e3a8a !important;
}
</style> 