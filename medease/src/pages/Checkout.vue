<template>
  <v-app style="background-color: #f3f6fa;">
    <NavBarDoctor v-if="isDoctor" />
    <NavBar v-else />
    
    <v-main>
      <v-container>
        <h1 class="text-h3 font-weight-bold mb-6" style="color: #1e3a8a;">
          Checkout
        </h1>
        <v-row>
          <v-col cols="12" md="8" class="h-100 d-flex flex-column">
            <!-- Delivery Information -->
            <v-card class="mb-6 pa-4 h-100" style="background-color: white; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(30,58,138,0.07);">
              <v-card-title class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">
                Delivery Information
              </v-card-title>
              
              <v-form ref="deliveryForm" v-model="deliveryFormValid">
                <v-text-field
                  v-model="deliveryAddress"
                  label="Delivery Address"
                  :rules="[v => !!v || 'Address is required']"
                  variant="outlined"
                  class="mb-4"
                  color="primary"
                  label-color="primary"
                  input-class="text-primary"
                  style="color: #1e3a8a;"
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>

                <v-text-field
                  v-model="phoneNumber"
                  label="Phone Number"
                  :rules="[v => !!v || 'Phone number is required']"
                  variant="outlined"
                  class="mb-4"
                  color="primary"
                  label-color="primary"
                  input-class="text-primary"
                  style="color: #1e3a8a;"
                  prepend-inner-icon="mdi-phone"
                ></v-text-field>

                <v-textarea
                  v-model="deliveryNotes"
                  label="Delivery Notes (Optional)"
                  variant="outlined"
                  class="mb-4"
                  color="primary"
                  label-color="primary"
                  input-class="text-primary"
                  style="color: #1e3a8a;"
                  prepend-inner-icon="mdi-note-text"
                ></v-textarea>
              </v-form>
            </v-card>

            <!-- Payment Method -->
            <v-card class="mb-6 pa-4 h-100" style="background-color: white; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(30,58,138,0.07);">
              <v-card-title class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">
                Payment Method
              </v-card-title>

              <v-radio-group v-model="paymentMethod" class="mb-4">
                <v-radio
                  :label="'Pay Online'"
                  value="online"
                  color="primary"
                  class="text-primary d-flex align-center"
                  style="color: #1e3a8a;"
                >
                  <template #label>
                    <v-icon left color="primary" class="mr-2">mdi-credit-card-outline</v-icon>
                    Pay Online
                  </template>
                </v-radio>
                <v-radio
                  :label="'Pay on Delivery'"
                  value="delivery"
                  color="primary"
                  class="text-primary d-flex align-center"
                  style="color: #1e3a8a;"
                >
                  <template #label>
                    <v-icon left color="primary" class="mr-2">mdi-truck-delivery-outline</v-icon>
                    Pay on Delivery
                  </template>
                </v-radio>
              </v-radio-group>

              <!-- Online Payment Form -->
              <v-form
                v-if="paymentMethod === 'online'"
                ref="paymentForm"
                v-model="paymentFormValid"
                class="mt-4"
              >
                <v-text-field
                  v-model="cardNumber"
                  label="Card Number"
                  :rules="[v => !!v || 'Card number is required']"
                  variant="outlined"
                  class="mb-4"
                  placeholder="1234 5678 9012 3456"
                  color="primary"
                  label-color="primary"
                  input-class="text-primary"
                  style="color: #1e3a8a;"
                  prepend-inner-icon="mdi-credit-card-outline"
                ></v-text-field>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="expiryDate"
                      label="Expiry Date"
                      :rules="[v => !!v || 'Expiry date is required']"
                      variant="outlined"
                      placeholder="MM/YY"
                      color="primary"
                      label-color="primary"
                      input-class="text-primary"
                      style="color: #1e3a8a;"
                      prepend-inner-icon="mdi-calendar"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="cvv"
                      label="CVV"
                      :rules="[v => !!v || 'CVV is required']"
                      variant="outlined"
                      placeholder="123"
                      type="password"
                      color="primary"
                      label-color="primary"
                      input-class="text-primary"
                      style="color: #1e3a8a;"
                      prepend-inner-icon="mdi-lock-outline"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="cardName"
                  label="Name on Card"
                  :rules="[v => !!v || 'Name is required']"
                  variant="outlined"
                  class="mb-4"
                  color="primary"
                  label-color="primary"
                  input-class="text-primary"
                  style="color: #1e3a8a;"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-form>
            </v-card>
          </v-col>

          <!-- Order Summary -->
          <v-col cols="12" md="4" class="h-100 d-flex flex-column">
            <v-card class="pa-4 h-100" style="background-color: white; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(30,58,138,0.07);">
              <v-card-title class="text-h5 font-weight-bold mb-4" style="color: #1e3a8a;">
                Order Summary
              </v-card-title>

              <v-list style="background-color: white;">
                <v-list-item v-for="item in cart" :key="item._id" class="mb-2" style="background-color: white; border-radius: 8px; box-shadow: none; border: 1px solid #f1f5f9;">
                  <template v-slot:prepend>
                    <v-img
                      :src="item.image || 'https://via.placeholder.com/50'"
                      width="50"
                      height="50"
                      cover
                      class="rounded"
                    ></v-img>
                  </template>
                  <v-list-item-title class="font-weight-bold" style="color: #1e3a8a;">{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle style="color: #334155;">
                    Quantity: {{ item.quantity }} × {{ item.price.toFixed(2) }} TND
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-4" color="white"></v-divider>

              <div class="d-flex justify-space-between mb-2">
                <span class="text-subtitle-1" style="color: #1e3a8a;">Subtotal:</span>
                <span class="text-subtitle-1 font-weight-bold" style="color: #1e3a8a;">{{ subtotal.toFixed(2) }} TND</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-subtitle-1" style="color: #1e3a8a;">Delivery Fee:</span>
                <span class="text-subtitle-1 font-weight-bold" style="color: #1e3a8a;">5.00 TND</span>
              </div>
              <v-divider class="my-2" color="white"></v-divider>
              <div class="d-flex justify-space-between mb-4">
                <span class="text-h6 font-weight-bold" style="color: #1e3a8a;">Total:</span>
                <span class="text-h6 font-weight-bold" style="color: #0ea5e9;">
                  {{ total.toFixed(2) }} TND
                </span>
              </div>

              <v-btn
                block
                color="primary"
                size="large"
                class="font-weight-bold"
                style="border-radius: 12px;"
                :loading="processing"
                :disabled="!isFormValid"
                @click="processOrder"
              >
                Place Order
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer />

    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card
        style="background: #fff; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(30,58,138,0.07); text-align: center; padding: 32px 16px;"
      >
        <v-icon size="56" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
        <v-card-title
          class="text-h5 font-weight-bold mb-2"
          style="color: #1e3a8a; justify-content: center;"
        >
          Order Placed!
        </v-card-title>
        <v-card-text class="mb-4" style="color: #334155;">
          Your order was placed successfully.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="goToPharmacy" style="border-radius: 8px; min-width: 100px;">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import NavBarDoctor from '@/components/navbardoctor.vue'
import NavBar from '@/components/navbarAuthPatient.vue'
import Footer from '@/components/footer.vue'

const router = useRouter()

// State
const cart = ref([])
const patientId = ref(null)
const processing = ref(false)
const showSuccessDialog = ref(false)

// Form state
const deliveryFormValid = ref(false)
const paymentFormValid = ref(false)
const deliveryAddress = ref('')
const phoneNumber = ref('')
const deliveryNotes = ref('')
const paymentMethod = ref('online')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardName = ref('')

// Check if user is doctor
const isDoctor = computed(() => {
  return localStorage.getItem('doctor') !== null
})

// Form validation
const isFormValid = computed(() => {
  if (paymentMethod.value === 'online') {
    return deliveryFormValid.value && paymentFormValid.value
  }
  return deliveryFormValid.value
})

// Calculations
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value + 5.00 // Adding delivery fee
})

// Load cart data
onMounted(async () => {
  const patientData = localStorage.getItem('patient')
  if (patientData) {
    try {
      const parsedData = JSON.parse(patientData)
      patientId.value = parsedData._id || parsedData.id
      if (patientId.value) {
        await loadCart()
      }
    } catch (error) {
      console.error('Error parsing patient data:', error)
    }
  }
})

const loadCart = async () => {
  if (!patientId.value) return
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const response = await axios.get(`${apiUrl}/api/patients/${patientId.value}/cart`)
    cart.value = response.data.map(item => ({
      ...item.medicationId,
      quantity: item.quantity
    }))
  } catch (error) {
    console.error('Error loading cart:', error)
  }
}

// Process order
const processOrder = async () => {
  if (!isFormValid.value) return
  
  processing.value = true
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    // Create order
    const orderData = {
      patientId: patientId.value,
      items: cart.value.map(item => ({
        medicationId: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress: deliveryAddress.value,
      phoneNumber: phoneNumber.value,
      deliveryNotes: deliveryNotes.value,
      paymentMethod: paymentMethod.value,
      total: total.value
    }

    // If paying online, add payment details
    if (paymentMethod.value === 'online') {
      orderData.paymentDetails = {
        cardNumber: cardNumber.value,
        expiryDate: expiryDate.value,
        cardName: cardName.value
      }
    }

    // Send order to backend
    await axios.post(`${apiUrl}/api/orders`, orderData)
    
    // Clear cart
    await axios.delete(`${apiUrl}/api/patients/${patientId.value}/cart`)
    
    // Show success dialog
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Error processing order:', error)
    alert('Error processing order. Please try again.')
  } finally {
    processing.value = false
  }
}

const goToPharmacy = () => {
  showSuccessDialog.value = false
  router.push('/pharmacy')
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style> 