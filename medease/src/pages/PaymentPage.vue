<template>
  <v-app style="background-color: #f8fafc;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />
    <v-main>
      <v-container class="d-flex flex-column align-center justify-center" style="min-height: 80vh;">
        <v-card class="pa-8" max-width="420" elevation="10" style="border-radius: 20px;">
          <v-card-title class="headline text-center mb-2" style="color: #1976D2;">Pay for Your Appointment</v-card-title>
          <v-card-subtitle class="text-center mb-4" style="color: #607D8B; font-size: 1.1rem;">
            Secure payment powered by Medease
          </v-card-subtitle>
          <v-divider class="mb-4"></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="cardNumber"
              label="Card Number"
              required
              maxlength="19"
              prepend-inner-icon="mdi-credit-card-outline"
              placeholder="1234 5678 9012 3456"
              class="mb-3"
              :rules="[v => /^\d{13,19}$/.test(v.replace(/\s/g, '')) || 'Enter a valid card number']"
            />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="expiry"
                  label="Expiry (MM/YY)"
                  required
                  maxlength="5"
                  prepend-inner-icon="mdi-calendar"
                  placeholder="MM/YY"
                  class="mb-3"
                  :rules="[v => /^(0[1-9]|1[0-2])\/(\d{2})$/.test(v) || 'MM/YY']"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="cvc"
                  label="CVC"
                  required
                  maxlength="4"
                  prepend-inner-icon="mdi-lock-outline"
                  placeholder="123"
                  class="mb-3"
                  :rules="[v => /^\d{3,4}$/.test(v) || '3 or 4 digits']"
                />
              </v-col>
            </v-row>
            <v-text-field
              v-model="name"
              label="Name on Card"
              required
              prepend-inner-icon="mdi-account"
              placeholder="Full Name"
              class="mb-3"
              :rules="[v => v.length > 0 || 'Required']"
            />
          </v-form>
          <div v-if="error" class="text-red mt-2 text-center">{{ error }}</div>
          <v-divider class="my-4"></v-divider>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="primary" :loading="loading" @click="submitPayment" class="px-8 py-2" style="border-radius: 25px; font-weight: bold; font-size: 1.1rem;">Pay Now</v-btn>
            <v-btn color="grey" @click="cancelPayment" class="px-6 py-2 ml-2" style="border-radius: 25px; font-weight: bold;">Cancel</v-btn>
          </v-card-actions>
          <div class="text-center mt-4" style="color: #90caf9; font-size: 0.95rem;">
            <v-icon color="success" size="18">mdi-lock</v-icon>
            Your payment is encrypted and secure
          </div>
        </v-card>
        <v-dialog v-model="successDialog" max-width="400px">
          <v-card style="border-radius: 18px;">
            <v-card-title class="headline text-center" style="color: #43a047;">Payment Successful!</v-card-title>
            <v-card-text class="text-center">
              <v-icon color="success" size="60">mdi-check-circle</v-icon>
              <p class="mt-2">Your payment has been processed.<br>Thank you for using Medease!</p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary" @click="goToHome" style="border-radius: 25px; font-weight: bold;">Go to Home</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavbarAuthPatient from '@/components/navbarAuthPatient.vue';
import Navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';

const route = useRoute();
const router = useRouter();
const appointmentId = route.query.appointmentId;

const cardNumber = ref('');
const expiry = ref('');
const cvc = ref('');
const name = ref('');
const valid = ref(false);
const loading = ref(false);
const error = ref('');
const successDialog = ref(false);

function isUserLoggedIn() {
  return !!(sessionStorage.getItem('currentPatient') || localStorage.getItem('patient'));
}

function validateCard() {
  // Simple validation for demo
  return cardNumber.value.length >= 13 && expiry.value.length === 5 && cvc.value.length >= 3 && name.value.length > 0;
}

async function submitPayment() {
  error.value = '';
  if (!validateCard()) {
    error.value = 'Please fill in all fields correctly.';
    return;
  }
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    successDialog.value = true;
  }, 1500); // Simulate payment processing
}

function cancelPayment() {
  router.push('/bookingPagePatient');
}

function goToHome() {
  router.push('/HomePatient');
}

function formatCardNumber() {
  // Format as 1234 5678 9012 3456
  cardNumber.value = cardNumber.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry() {
  // Format as MM/YY
  let v = expiry.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2,4);
  expiry.value = v;
}

watch(cardNumber, formatCardNumber);
watch(expiry, formatExpiry);
</script>

<style scoped>
.text-red {
  color: #e53935;
}
.v-card {
  box-shadow: 0 6px 24px 0 rgba(25, 118, 210, 0.08) !important;
}
.v-btn.primary {
  background: linear-gradient(90deg, #1976D2 0%, #64b5f6 100%) !important;
  color: #fff !important;
}
.v-btn.grey {
  background: #ececec !important;
  color: #607D8B !important;
}
.v-text-field input {
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}
</style>
