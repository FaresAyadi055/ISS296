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
    </v-app>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; // Import useRouter
  import { doctorlist } from '../repos/doctors.js'; // Import doctor data
  
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
      const router = useRouter(); // Initialize router
  
      const handleLogin = () => {
        const foundDoctor = doctorlist.doctors.find(doctor => 
          doctor.email === email.value && doctor.password === password.value
        );
        if (foundDoctor) {
          console.log('Doctor logged in:', foundDoctor);
          router.push('/HomeDoctor'); // Redirect to HomeDoctor page
        } else {
          alert('Login failed: Invalid email or password.');
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
  </style>
  