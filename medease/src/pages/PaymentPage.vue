<template>
  <v-app style="background: linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%); min-height: 100vh;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />
    <v-main>
      <v-container class="d-flex flex-column align-center justify-center" style="min-height: 80vh;">
        <v-card class="pa-8 payment-card" max-width="440" elevation="12">
          <v-card-title class="headline text-center mb-2" style="color: #1976D2; font-weight: 700; letter-spacing: 0.02em;">Pay for Your Appointment</v-card-title>
          <v-card-subtitle class="text-center mb-4" style="color: #607D8B; font-size: 1.1rem;">Secure payment powered by Medease</v-card-subtitle>
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
          <transition name="fade">
            <div v-if="error" class="error-message text-center">{{ error }}</div>
          </transition>
          <v-divider class="my-4"></v-divider>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="primary" :loading="loading" @click="submitPayment" class="pay-btn px-8 py-2">Pay Now</v-btn>
            <v-btn color="grey" @click="cancelPayment" class="cancel-btn px-6 py-2 ml-2">Cancel</v-btn>
          </v-card-actions>
          <div class="text-center mt-4 secure-info">
            <v-icon color="success" size="18">mdi-lock</v-icon>
            Your payment is encrypted and secure
          </div>
        </v-card>
        <v-dialog v-model="successDialog" max-width="400px">
          <v-card style="border-radius: 18px; background: #fff;">
            <v-card-title class="headline text-center" style="color: #43a047;">Payment Successful!</v-card-title>
            <v-card-text class="text-center" style="color: #222;">
              <v-icon color="success" size="60">mdi-check-circle</v-icon>
              <p class="mt-2" style="color: #222;">
                Your payment has been processed.<br>Thank you for using Medease!
              </p>
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
import axios from 'axios';
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
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Update appointment as paid in backend
    if (appointmentId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await axios.patch(`${apiUrl}/api/appointments/${appointmentId}/pay`);
    }
    successDialog.value = true;
  } catch (e) {
    error.value = 'Payment succeeded but failed to update appointment status.';
  } finally {
    loading.value = false;
  }
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
.payment-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.10) !important;
  background: #fff;
  border: 1.5px solid #e3f0ff;
  transition: box-shadow 0.2s;
}
.payment-card:hover {
  box-shadow: 0 12px 36px 0 rgba(25, 118, 210, 0.16) !important;
}
.pay-btn {
  background: linear-gradient(90deg, #1976D2 0%, #64b5f6 100%) !important;
  color: #fff !important;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.10);
  transition: background 0.2s, box-shadow 0.2s;
}
.pay-btn:hover {
  background: linear-gradient(90deg, #1565c0 0%, #42a5f5 100%) !important;
  box-shadow: 0 4px 16px 0 rgba(25, 118, 210, 0.16);
}
.cancel-btn {
  background: #f5f5f5 !important;
  color: #607D8B !important;
  border-radius: 25px;
  font-weight: bold;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #e0e0e0 !important;
}
.v-text-field input {
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  background: #f1f3f6;
  border-radius: 10px;
  border: 1.5px solid #d0d7e2;
  color: #000;
  transition: border 0.2s, box-shadow 0.2s;
}
.v-text-field input:focus {
  border: 1.5px solid #1976D2;
  box-shadow: 0 0 0 2px #e3f0ff;
}
/* Force black text and icons in v-text-field for Vuetify 3, even in dark mode */
:deep(.v-text-field input),
:deep(.v-text-field .v-label),
:deep(.v-text-field .v-field__input),
:deep(.v-text-field .v-field__outline),
:deep(.v-text-field .v-icon),
:deep(.v-text-field .v-input__icon),
:deep(.v-text-field .v-icon__svg) {
  color: #000 !important;
  fill: #000 !important;
}
:deep(.v-text-field input) {
  caret-color: #000 !important;
}
:deep(.v-text-field .v-label),
:deep(.v-text-field .v-field__input),
:deep(.v-text-field .v-field__outline) {
  color: #000 !important;
}
.error-message {
  color: #e53935;
  background: #fff0f0;
  border-radius: 8px;
  padding: 8px 0;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 1.05rem;
  box-shadow: 0 2px 8px 0 rgba(229, 57, 53, 0.04);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.secure-info {
  color: #1976D2;
  font-size: 0.98rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
