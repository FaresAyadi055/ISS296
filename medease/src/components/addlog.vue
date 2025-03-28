<template>
    <v-app style="background-color: #f8fafc;">
      <v-container class="d-flex justify-center align-center">
       
        <v-card v-if="!showRegister" class="pa-6" max-width="400px" style="background-color: white;">
          <div class="d-flex justify-center">
            
          </div>
          
          <v-card-title class="text-center text-blue-800">Doctor Sign in</v-card-title>
  
          <v-form @submit.prevent="handleLogin">
            <v-text-field 
              v-model="email" 
              label="Email" 
              type="email" 
              required>
            </v-text-field>
            
            <v-text-field 
              v-model="password" 
              label="Password" 
              type="password" 
              required>
            </v-text-field>
  
            <v-btn type="submit" color="primary" block class="login-button">Sign in</v-btn>
            
            <p class="text-center mt-4">
              Don't have an account? 
              <v-btn 
              class="mb-4" 
              style="background-color: black; color: white; border-radius: 5px;" 
              to="/signIndoctor">
              Register
            </v-btn>
            </p>
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
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const showRegister = ref(false);
      const fullName = ref('');
      const regEmail = ref('');
      const regPassword = ref('');
      const healthConditions = ref({ chronic: '', medications: '', allergies: '' });
      const hasHealthConditions = ref(false);
      const isOnMedications = ref(false);
      const hasAllergies = ref(false);
      const photo = ref(null);
      const router = useRouter();
      const errorDialog = ref(false);
      const successDialog = ref(false);
      const errorMessage = ref('');
      const successMessage = ref('');
  
      const showError = (message) => {
        errorMessage.value = message;
        errorDialog.value = true;
      };
  
      const showSuccess = (message) => {
        successMessage.value = message;
        successDialog.value = true;
      };
  
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/doctors/login', {
            email: email.value,
            password: password.value
          });
  
          const { token, doctor } = response.data;
          
          // Store token and doctor info
          localStorage.setItem('token', token);
          localStorage.setItem('doctor', JSON.stringify(doctor));
          
          // Redirect to home page
          router.push('/HomeDoctor');
        } catch (error) {
          console.error('Login error:', error);
          showError(error.response?.data?.message || 'Login failed. Please try again.');
        }
      };
  
      const handleRegister = () => {
        console.log('Registering:', fullName.value, regEmail.value, regPassword.value, healthConditions.value, photo.value);
        showRegister.value = false;
      };
  
      return {
        email,
        password,
        showRegister,
        fullName,
        regEmail,
        regPassword,
        healthConditions,
        hasHealthConditions,
        isOnMedications,
        hasAllergies,
        photo,
        handleLogin,
        handleRegister,
        errorDialog,
        successDialog,
        errorMessage,
        successMessage,
        showError,
        showSuccess
      };
    }
  };
  </script>
  
  <style scoped>
  /* Set all text to black */
  .v-card-title, .v-text-field, .v-checkbox, .v-textarea, p {
      color: black;
  }

  /* Keep button text color as is */
  .login-button, .register-button {
      color: white; /* Assuming primary color is white */
  }

  /* Custom Dialog Styling */
  .custom-dialog-card {
    background-color: white !important;
    border-radius: 15px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .custom-btn {
    border-radius: 25px !important;
    font-weight: bold;
    padding: 10px 20px;
    text-transform: capitalize;
  }

  .text-blue {
    color: #1976D2 !important;
  }
  </style>
  