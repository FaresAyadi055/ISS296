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
                :menu-props="{ contentClass: 'category-menu' }"
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
                    <div class="text-body-2 mb-2" style="color: #334155;">{{ medication.description }}</div>
                    <div class="text-h6 font-weight-bold" style="color: #0ea5e9;">
                      {{ medication.price.toFixed(2) }} TND
                    </div>
                    <div
                      class="text-body-2 font-weight-bold mb-2"
                      :style="{ color: medication.stock > 0 ? '#16a34a' : '#dc2626' }"
                    >
                      {{ medication.stock > 0 ? 'Available' : 'Unavailable' }}
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
                    <v-btn
                      v-if="true"
                      color="success"
                      variant="flat"
                      block
                      class="mt-2"
                      @click="addToCart(medication)"
                    >
                      Add to Cart
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
      <v-card v-if="selectedMedication" style="background: #fff; border-radius: 24px; box-shadow: 0 8px 32px 0 rgba(14, 165, 233, 0.13); overflow: hidden;">
        <v-img
          :src="selectedMedication.image || 'https://via.placeholder.com/600x300'"
          height="240"
          cover
          style="border-top-left-radius: 24px; border-top-right-radius: 24px;"
        ></v-img>

        <v-card-title class="text-h4 font-weight-bold" style="color: #1e3a8a; padding-bottom: 0;">
          {{ selectedMedication.name }}
        </v-card-title>

        <v-card-text style="padding-top: 0;">
          <div class="text-subtitle-1 font-weight-bold mb-2" style="color: #0ea5e9;">
            {{ selectedMedication.category }}
          </div>
          <div class="text-body-1 mb-4" style="color: #334155;">
            {{ selectedMedication.description }}
          </div>
          <div class="text-h5 font-weight-bold mb-4" style="color: #0ea5e9;">
            {{ selectedMedication.price.toFixed(2) }} TND
          </div>
          <div class="text-body-2 mb-1"><strong style="color: #1e3a8a;">Dosage:</strong> <span style="color: #64748b;">{{ selectedMedication.dosage }}</span></div>
          <div class="text-body-2"><strong style="color: #1e3a8a;">Side Effects:</strong> <span style="color: #64748b;">{{ selectedMedication.sideEffects }}</span></div>
          <div class="text-body-2 mb-1">
            <strong style="color: #1e3a8a;">Stock:</strong>
            <span :style="{ color: selectedMedication.stock > 0 ? '#16a34a' : '#dc2626' }">
              {{ selectedMedication.stock > 0 ? 'Available' : 'Unavailable' }}
            </span>
          </div>
        </v-card-text>

        <v-card-actions style="justify-content: flex-end; padding-bottom: 20px; gap: 12px;">
          <v-btn
            v-if="selectedMedication && selectedMedication.stock > 0"
            color="success"
            variant="flat"
            style="border-radius: 20px; min-width: 120px;"
            @click="addToCart(selectedMedication)"
          >
            Add to Cart
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            style="border-radius: 20px; min-width: 100px;"
            @click="showDetails = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Floating Cart Button -->
    <v-btn
      color="primary"
      fab
      style="position: fixed; bottom: 32px; right: 32px; z-index: 200;"
      @click="showCart = true"
    >
      <v-icon>mdi-cart</v-icon>
      <span v-if="cart.length" style="margin-left: 8px;">{{ cart.length }}</span>
    </v-btn>

    <!-- Cart Drawer/Dialog -->
    <v-dialog v-model="showCart" max-width="500">
      <v-card style="border-radius: 24px; overflow: hidden; background-color: white;">
        <v-card-title class="d-flex align-center pa-6" style="background-color: #f8fafc; color: #1e3a8a; border-bottom: 1px solid #e2e8f0;">
          <v-icon size="large" class="mr-3" color="primary">mdi-cart</v-icon>
          <span class="text-h5 font-weight-bold">Your Shopping Cart</span>
          <v-spacer></v-spacer>
          <v-btn icon color="grey-darken-1" variant="text" @click="showCart = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6" style="background-color: white;">
          <div v-if="cart.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-cart-off</v-icon>
            <div class="text-h6 text-grey-darken-1">Your cart is empty</div>
            <div class="text-body-1 text-grey-darken-1 mt-2">Add some medications to get started</div>
          </div>

          <v-list v-else class="cart-list" style="background-color: white;">
            <v-list-item v-for="item in cart" :key="item._id" class="mb-4 pa-0">
              <v-card class="w-100" style="border-radius: 16px; overflow: hidden; background-color: #f8fafc;">
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-img
                      :src="item.image || 'https://via.placeholder.com/150'"
                      height="120"
                      cover
                      class="rounded-l"
                    ></v-img>
                  </v-col>
                  <v-col cols="8" class="pa-4">
                    <div class="d-flex justify-space-between align-start">
                      <div>
                        <div class="text-subtitle-1 font-weight-bold" style="color: #1e3a8a;">{{ item.name }}</div>
                        <div class="text-body-2 text-grey-darken-1">{{ item.category }}</div>
                        <div class="text-h6 font-weight-bold mt-2" style="color: #0ea5e9;">
                          {{ item.price.toFixed(2) }} TND
                        </div>
                      </div>
                      <v-btn
                        icon
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeFromCart(item._id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <div class="d-flex align-center mt-2">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="primary"
                        @click="item.quantity > 1 && item.quantity--"
                        :disabled="item.quantity <= 1"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <span class="mx-2 quantity-number">{{ item.quantity }}</span>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="primary"
                        @click="item.quantity++"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-list-item>
          </v-list>

          <v-divider v-if="cart.length" class="my-4"></v-divider>

          <div v-if="cart.length" class="d-flex justify-space-between align-center">
            <div class="text-h6 font-weight-bold" style="color: #1e3a8a;">Total Amount:</div>
            <div class="text-h5 font-weight-bold" style="color: #0ea5e9;">
              {{ cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) }} TND
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="cart.length" class="pa-6 pt-0" style="background-color: white;">
          <v-btn
            block
            color="primary"
            size="large"
            class="font-weight-bold"
            style="border-radius: 12px;"
            @click="checkout"
          >
            Proceed to Checkout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Footer />

    <v-btn @click="console.log('Test button works!')">Test</v-btn>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import NavBarDoctor from '@/components/navbardoctor.vue'
import NavBar from '@/components/navbarAuthPatient.vue'
import Footer from '@/components/footer.vue'

// State
const search = ref('')
const selectedCategory = ref('All')
const showDetails = ref(false)
const selectedMedication = ref(null)
const medications = ref([]);
const loading = ref(true);
const cart = ref([]);
const showCart = ref(false);

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
    console.log('Fetched medications:', medications.value);
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

// Add to cart function
const addToCart = (medication) => {
  const existing = cart.value.find(item => item._id === medication._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...medication, quantity: 1 });
  }
};

// Remove from cart function
const removeFromCart = (medicationId) => {
  cart.value = cart.value.filter(item => item._id !== medicationId);
};
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

:deep(.category-menu),
:deep(.category-menu .v-list),
:deep(.category-menu .v-list-item) {
  background-color: white !important;
  color: #1e3a8a !important;
}

.quantity-number {
  color: #1e3a8a !important;
  font-weight: bold;
}
</style>

<style>
.category-menu,
.category-menu .v-list,
.category-menu .v-list-item {
  background-color: white !important;
  color: #1e3a8a !important;
}
</style> 