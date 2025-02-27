<template>
    <v-app>
      <v-container class="d-flex justify-center align-center">
       
        <v-card v-if="!showRegister" class="pa-6" max-width="400px">
          <v-card-title class="text-center text-blue-800">Patient Login</v-card-title>
  
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
  
            <v-btn type="submit" color="primary" block>Login</v-btn>
            
            <p class="text-center mt-4">
              Don't have an account? 
              <v-btn @click="showRegister = true" text>Register</v-btn>
            </p>
          </v-form>
        </v-card>
  

        <v-card v-if="showRegister" class="pa-6" max-width="400px">
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
  
            <!-- If user is on medications -->
            <v-textarea 
              v-if="isOnMedications" 
              v-model="healthConditions.medications" 
              label="Medications" 
              hint="List medications"
            ></v-textarea>
  
            <!-- If user has allergies -->
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
  
            <v-btn type="submit" color="primary" block>Register</v-btn>
  
            <p class="text-center mt-4">
              Already have an account? 
              <v-btn @click="showRegister = false" text>Login</v-btn>
            </p>
          </v-form>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import { ref } from 'vue';
  
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
  
      const handleLogin = () => {
        console.log('Logging in with:', email.value, password.value);
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
        handleRegister
      };
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  