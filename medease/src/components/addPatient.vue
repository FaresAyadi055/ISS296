<template>
    <v-app style="background-color: #f8fafc;">
      <v-container class="d-flex justify-center align-center">
       
        <v-card v-if="!showRegister" class="pa-6" max-width="400px" style="background-color: white;">
          <div class="d-flex justify-center">
            <v-btn 
              class="mb-4" 
              style="background-color: #D5DE58; color: black; border-radius: 5px;" 
              to="/doctorSignin">
              Are you a doctor?
            </v-btn>
          </div>
          <hr style="border: 1px solid black;"/>
          <v-card-title class="text-center text-blue-800">Patient Sign in</v-card-title>
  
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
              <v-btn @click="showRegister = true" text class="register-button">Register</v-btn>
            </p>
          </v-form>
        </v-card>
  

        <v-card v-if="showRegister" class="pa-6" max-width="400px" style="background-color: white;">
          <div class="d-flex justify-center">
            <v-btn 
              class="mb-4" 
              style="background-color: #D5DE58; color: black; border-radius: 5px;" 
              to="/signIndoctor">
              Are you a doctor?
            </v-btn>
          </div>
          <hr style="border: 1px solid black;"/>
          <v-card-title class="text-center text-blue-800">Patient Registration</v-card-title>
  
          <v-form @submit.prevent="handleRegister">
            <v-text-field 
              v-model="fullName" 
              label="Full Name" 
              required>
            </v-text-field>
  
            <v-text-field 
              v-model="regEmail" 
              label="Email" 
              type="email" 
              required >
            </v-text-field>
  
            <v-text-field 
              v-model="regPassword" 
              label="Password" 
              type="password" 
              required>
            </v-text-field>
  
            <v-checkbox 
              v-model="hasHealthConditions" 
              label="Do you have any chronic conditions?" >
            </v-checkbox>
  
            <v-checkbox 
              v-model="isOnMedications" 
              label="Are you currently on any medications?" >
            </v-checkbox>
  
            <v-checkbox 
              v-model="hasAllergies" 
              label="Do you have any allergies?" >
            </v-checkbox>
  
            <v-textarea 
              v-if="hasHealthConditions" 
              v-model="healthConditions.chronic" 
              label="Chronic Conditions" 
              hint="e.g., Diabetes">
            </v-textarea>
  
            <v-textarea 
              v-if="isOnMedications" 
              v-model="healthConditions.medications" 
              label="Medications" 
              hint="List medications"
            ></v-textarea>
  
            <v-textarea 
              v-if="hasAllergies" 
              v-model="healthConditions.allergies" 
              label="Allergies" 
              hint="List allergies"
            ></v-textarea>
  
            <v-file-input 
              v-model="photo" 
              label="Upload your photo (optional)" 
              accept="image/*"
              outlined
            ></v-file-input>
  
            <v-btn type="submit" color="primary" block class="register-button">Register</v-btn>
  
            <p class="text-center mt-4">
              Already have an account? 
              <v-btn @click="showRegister = false" text class="login-button">Sign in</v-btn>
            </p>
          </v-form>
        </v-card>
      </v-container>
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
      const error = ref('');
  
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/patients/login', {
            email: email.value,
            password: password.value
          });
  
          const { token, patient } = response.data;
          
          // Store token and patient info
          localStorage.setItem('token', token);
          localStorage.setItem('patient', JSON.stringify(patient));
          
          // Redirect to home page
          router.push('/HomePatient');
        } catch (error) {
          console.error('Login error:', error);
          alert(error.response?.data?.message || 'Login failed. Please try again.');
        }
      };
  
      const handleRegister = async () => {
        try {
          const [firstName, lastName] = fullName.value.split(' ');
          
          const response = await axios.post('http://localhost:3001/api/patients/register', {
            firstName,
            lastName,
            email: regEmail.value,
            password: regPassword.value,
            healthConditions: {
              chronic: hasHealthConditions.value ? healthConditions.value.chronic : '',
              medications: isOnMedications.value ? healthConditions.value.medications : '',
              allergies: hasAllergies.value ? healthConditions.value.allergies : ''
            }
          });
  
          if (response.status === 201) {
            alert('Registration successful! Please login.');
            showRegister.value = false;
          }
        } catch (error) {
          console.error('Registration error:', error);
          alert(error.response?.data?.message || 'Registration failed. Please try again.');
        }
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
        error
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
  