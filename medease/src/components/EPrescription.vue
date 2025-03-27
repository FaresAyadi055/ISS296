<template>
  <v-app style="background-color: white;">
    <navbardoctor />
    
    <v-container class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-6" style="background-color: white;" elevation="0">            
            <v-card-title class="text-center text-h5 mb-6" style="color: black;">Generate E-Prescription</v-card-title>
            
            <v-form @submit.prevent="generatePrescription">
              <!-- Patient Information -->
              <v-text-field
                v-model="patientName"
                label="Patient Name"
                required
                class="mb-4 black-text"
                variant="outlined"
                color="primary"
                bg-color="white"
                style="background-color: white;"
              ></v-text-field>

              <!-- Medications List -->
              <div v-for="(med, index) in medications" :key="index" class="mb-6">
                <v-card class="pa-4" style="background-color: white;" variant="outlined">
                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-card-title class="text-h6" style="color: black;">Medication {{ index + 1 }}</v-card-title>
                    <v-btn
                      v-if="medications.length > 1"
                      color="error"
                      icon
                      variant="text"
                      size="small"
                      @click="removeMedication(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  
                  <v-text-field
                    v-model="med.name"
                    label="Medication Name"
                    required
                    class="mb-4 black-text"
                    variant="outlined"
                    color="primary"
                    bg-color="white"
                    style="background-color: white;"
                  ></v-text-field>

                  <v-text-field
                    v-model="med.dosage"
                    label="Dosage"
                    required
                    class="mb-4 black-text"
                    variant="outlined"
                    color="primary"
                    bg-color="white"
                    style="background-color: white;"
                  ></v-text-field>

                  <v-select
                    v-model="med.frequency"
                    :items="frequencyOptions"
                    label="Frequency"
                    required
                    class="mb-4 black-text"
                    variant="outlined"
                    color="primary"
                    bg-color="white"
                    style="background-color: white;"
                  ></v-select>

                  <v-text-field
                    v-model="med.duration"
                    label="Duration (days)"
                    type="number"
                    required
                    class="mb-4 black-text"
                    variant="outlined"
                    color="primary"
                    bg-color="white"
                    style="background-color: white;"
                  ></v-text-field>

                  <v-textarea
                    v-model="med.instructions"
                    label="Special Instructions"
                    rows="2"
                    class="mb-4 black-text"
                    variant="outlined"
                    color="primary"
                    bg-color="white"
                    style="background-color: white;"
                  ></v-textarea>

                  <!-- Reminder Settings -->
                  <v-card-title class="text-h6 mb-4" style="color: black;">Reminder Settings</v-card-title>
                  
                  <v-switch
                    v-model="med.reminders.enabled"
                    label="Enable Medication Reminders"
                    class="mb-4 black-text"
                    color="primary"
                  ></v-switch>

                  <div v-if="med.reminders.enabled">
                    <div v-for="(time, timeIndex) in med.reminders.times" :key="timeIndex" class="d-flex align-center mb-2">
                      <v-text-field
                        v-model="med.reminders.times[timeIndex]"
                        type="time"
                        label="Reminder Time"
                        required
                        class="mr-2 black-text"
                        variant="outlined"
                        color="primary"
                        bg-color="white"
                        style="background-color: white;"
                      ></v-text-field>
                      <v-btn
                        color="error"
                        icon
                        variant="text"
                        size="small"
                        @click="removeReminderTime(index, timeIndex)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <v-btn
                      color="primary"
                      class="mb-4 mt-2"
                      @click="addReminderTime(index)"
                      style="background-color: #579AFE; color: white;"
                    >
                      Add Reminder Time
                    </v-btn>
                  </div>
                </v-card>
              </div>

              <div class="d-flex flex-column gap-4">
                <v-btn
                  block
                  @click="addMedication"
                  style="background-color: #579AFE; color: white;"
                >
                  Add Another Medication
                </v-btn>

                <v-btn
                  type="submit"
                  block
                  :loading="loading"
                  style="background-color: #579AFE; color: white;"
                >
                  Generate E-Prescription
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <AppFooter />
  </v-app>
</template>

<script>
import { ref } from 'vue'
import { notificationService } from '@/services/NotificationService'
import navbardoctor from '@/components/navbardoctor.vue'
import footer from '@/components/footer.vue'

export default {
  name: 'EPrescription',
  components: {
    navbardoctor,
    AppFooter: footer
  },
  setup() {
    const loading = ref(false)
    const patientName = ref('')
    
    const medications = ref([{
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      reminders: {
        enabled: false,
        times: []
      }
    }])

    const frequencyOptions = [
      'once daily',
      'twice daily',
      'three times daily',
      'four times daily',
      'every 12 hours',
      'every 8 hours',
      'every 6 hours',
      'every 4 hours'
    ]

    const addMedication = () => {
      medications.value.push({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        reminders: {
          enabled: false,
          times: []
        }
      })
    }

    const removeMedication = (index) => {
      medications.value.splice(index, 1)
    }

    const addReminderTime = (medicationIndex) => {
      medications.value[medicationIndex].reminders.times.push('')
    }

    const removeReminderTime = (medicationIndex, timeIndex) => {
      medications.value[medicationIndex].reminders.times.splice(timeIndex, 1)
    }

    const generatePrescription = async () => {
      loading.value = true
      try {
        // Here you would typically make an API call to save the prescription
        console.log('Generating prescription:', {
          patientName: patientName.value,
          medications: medications.value
        })
        
        // Schedule notifications for medications with reminders enabled
        notificationService.scheduleMedicationReminders(medications.value)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Show success message
        alert('E-Prescription generated successfully!')
        
        // Reset form
        patientName.value = ''
        medications.value = [{
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          reminders: {
            enabled: false,
            times: []
          }
        }]
      } catch (error) {
        console.error('Error generating prescription:', error)
        alert('Error generating prescription. Please try again.')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      patientName,
      medications,
      frequencyOptions,
      addMedication,
      removeMedication,
      addReminderTime,
      removeReminderTime,
      generatePrescription
    }
  }
}
</script>

<style scoped>
.v-card {
  border: 1px solid #e2e8f0;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 4px;
}

.v-text-field :deep(input), 
.v-select :deep(.v-field__input), 
.v-textarea :deep(textarea) {
  background-color: white !important;
  color: black !important;
}

.v-text-field :deep(.v-field), 
.v-select :deep(.v-field), 
.v-textarea :deep(.v-field) {
  background-color: white !important;
  border: 1px solid #e2e8f0;
}

.v-text-field :deep(.v-label),
.v-select :deep(.v-label),
.v-textarea :deep(.v-label) {
  color: black !important;
}

.black-text :deep(*) {
  color: black !important;
}

.gap-4 {
  gap: 16px;
}

.flex-column {
  flex-direction: column;
}
</style> 