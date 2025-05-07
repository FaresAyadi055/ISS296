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
  
            <!-- Replace the divider, heading, and file input with this simplified version -->
            <div class="mb-4">
              <v-text-field
                readonly
                label="Upload Photo"
                variant="underlined"
                class="photo-upload-field"
                :value="photo && photo.length > 0 ? photo[0].name : ''"
                @click="$refs.photoInput.click()"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-paperclip" class="mr-2"></v-icon>
                </template>
              </v-text-field>
              
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleFileUpload"
              />
            </div>
  
            <!-- Keep the preview section as is, but make it conditional on imagePreview -->
            <div v-if="imagePreview" class="text-center mb-4">
              <v-avatar size="120" class="mb-3 preview-image">
                <v-img :src="imagePreview" cover alt="Profile preview"></v-img>
              </v-avatar>
            </div>
  
            <v-btn type="submit" color="primary" block class="register-button">Register</v-btn>
  
            <p class="text-center mt-4">
              Already have an account? 
              <v-btn @click="showRegister = false" text class="login-button">Sign in</v-btn>
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
      const photoInput = ref(null);
      const defaultPhoto = ref('https://via.placeholder.com/150');
      const imagePreview = ref(null);
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
  
      const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            resolve(null);
            return;
          }
          
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      };
  
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/patients/login', {
            email: email.value,
            password: password.value
          });
  
          console.log('Login Response:', response.data);
  
          const { token, patient } = response.data;
  
          // Store token and patient info with photo if available
          localStorage.setItem('token', token);
          localStorage.setItem('patient', JSON.stringify({
            id: patient._id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            photo: patient.photo || defaultPhoto.value,
            // Add any other patient data you need
          }));
  
          // Debugging log to verify stored patient data
          console.log('Patient found:', patient);
  
          // Check for pending booking
          const pendingBooking = sessionStorage.getItem('pendingBooking');
          if (pendingBooking) {
            const bookingData = JSON.parse(pendingBooking);
            // Clear the pending booking
            sessionStorage.removeItem('pendingBooking');
            // Redirect to the booking page with the doctor ID
            router.push(`/booking/${bookingData.doctorId}`);
          } else {
            // No pending booking, redirect to home page
            router.push('/HomePatient');
          }
        } catch (error) {
          console.error('Login error:', error);
          showError(error.response?.data?.message || 'Login failed. Please try again.');
        }
      };
  
      const handleRegister = async () => {
        try {
          // Validate name format
          const nameParts = fullName.value.trim().split(' ');
          if (nameParts.length < 2) {
            showError('Please enter both first name and last name separated by a space.');
            return;
          }
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');
          
          // Convert the selected photo to base64 string
          let photoBase64 = null;
          if (photo.value && photo.value.length > 0) {
            photoBase64 = await convertFileToBase64(photo.value[0]);
          }
          
          const response = await axios.post('http://localhost:3001/api/patients/register', {
            firstName,
            lastName,
            email: regEmail.value,
            password: regPassword.value,
            photo: photoBase64 || defaultPhoto.value,
            healthConditions: {
              chronic: hasHealthConditions.value ? healthConditions.value.chronic : '',
              medications: isOnMedications.value ? healthConditions.value.medications : '',
              allergies: hasAllergies.value ? healthConditions.value.allergies : ''
            }
          });
  
          if (response.status === 201) {
            showSuccess('Registration successful! Please login.');
            
            // Reset form fields
            fullName.value = '';
            regEmail.value = '';
            regPassword.value = '';
            hasHealthConditions.value = false;
            isOnMedications.value = false;
            hasAllergies.value = false;
            healthConditions.value = { chronic: '', medications: '', allergies: '' };
            photo.value = null;
            imagePreview.value = null;
            
            // Switch to login screen
            showRegister.value = false;
          }
        } catch (error) {
          console.error('Registration error:', error);
          showError(error.response?.data?.message || 'Registration failed. Please try again.');
        }
      };
  
      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          // Set the photo ref to an array containing the file (to match previous v-file-input behavior)
          photo.value = [file];
          
          // Create preview image
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.value = e.target.result;
          };
          reader.readAsDataURL(file);
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
        photoInput,
        handleLogin,
        handleRegister,
        errorDialog,
        successDialog,
        errorMessage,
        successMessage,
        showError,
        showSuccess,
        imagePreview,
        handleFileUpload
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

  /* Custom styling for file input to make it look more like a text field */
  .v-file-input :deep(.v-field__input) {
    padding: 8px 12px;
    min-height: 40px;
  }

  .v-file-input :deep(.v-field__field) {
    border-radius: 4px;
  }

  .v-file-input :deep(.v-field__append-inner) {
    padding-top: 12px;
  }

  .v-file-input :deep(.v-field__prepend-inner) {
    padding-top: 12px;
    margin-right: 8px;
  }

  /* Style the selected file chip to look more integrated */
  .v-file-input :deep(.v-chip) {
    margin: 4px;
    height: 28px;
    font-size: 14px;
  }

  /* Make the preview image display nicer */
  .preview-image {
    border: 2px solid #0ea5e9;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Add these styles to the style section */
  .photo-upload-field {
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }

  .photo-upload-field :deep(.v-field__overlay) {
    display: none;
  }

  .photo-upload-field :deep(.v-field__field) {
    box-shadow: none !important;
  }

  .photo-upload-field :deep(.v-field__input) {
    padding: 8px 0;
    min-height: 36px;
    color: rgba(0, 0, 0, 0.6);
  }

  .photo-upload-field:hover {
    border-bottom-color: #666;
  }
  </style>
