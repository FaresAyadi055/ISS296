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
              <v-select
                v-model="selectedPatient"
                :items="patients"
                item-title="name"
                item-value="id"
                label="Select Patient"
                required
                class="mb-4 black-text"
                variant="outlined"
                color="primary"
                bg-color="white"
                style="background-color: white;"
                :loading="loadingPatients"
              ></v-select>

              <div v-if="selectedPatient" class="d-flex align-center mb-4">
                <v-avatar size="40" class="mr-2">
                  <v-img :src="selectedPatient.photo || '/default-avatar.png'" alt="Patient Photo"></v-img>
                </v-avatar>
                <div>
                  <p class="text-subtitle-1 mb-0" style="color: black;">ID: {{ selectedPatient.id }}</p>
                  <p class="text-caption mb-0" style="color: black;">Age: {{ selectedPatient.age }}</p>
                </div>
              </div>

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
                    <div class="d-flex gap-2">
                      <v-btn
                        color="primary"
                        class="mb-4 mt-2"
                        @click="addReminderTime(index)"
                        style="background-color: #579AFE; color: white;"
                      >
                        Add Reminder Time
                      </v-btn>
                      <v-btn
                        color="success"
                        class="mb-4 mt-2"
                        @click="testNotification(index)"
                        style="background-color: #4CAF50; color: white;"
                      >
                        Test Notification
                      </v-btn>
                    </div>
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
import { ref, onMounted } from 'vue'
import { notificationService } from '@/services/NotificationService'
import navbardoctor from '@/components/navbardoctor.vue'
import footer from '@/components/footer.vue'
import { patientService } from '@/services/PatientService'

export default {
  name: 'EPrescription',
  components: {
    navbardoctor,
    AppFooter: footer
  },
  setup() {
    const loading = ref(false)
    const loadingPatients = ref(false)
    const selectedPatient = ref(null)
    const patients = ref([])
    
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

    const testNotification = async (medicationIndex) => {
      const medication = medications.value[medicationIndex]
      try {
        // Create a test notification for 5 seconds from now
        const testTime = new Date(Date.now() + 5000)
        await notificationService.scheduleNotification({
          title: `Test Reminder: ${medication.name}`,
          body: `Take ${medication.dosage} of ${medication.name}`,
          scheduledTime: testTime
        })
        alert('Test notification scheduled! You will receive it in 5 seconds.')
      } catch (error) {
        console.error('Error scheduling test notification:', error)
        alert('Error scheduling test notification. Please check notification permissions.')
      }
    }

    const loadPatients = async () => {
      loadingPatients.value = true
      try {
        const patientsData = await patientService.getAllPatients()
        patients.value = patientsData
      } catch (error) {
        console.error('Error loading patients:', error)
        // Show error message to user
      } finally {
        loadingPatients.value = false
      }
    }

    const generatePrescription = async () => {
      if (!selectedPatient.value) {
        alert('Please select a patient first')
        return
      }

      loading.value = true
      try {
        // Here you would typically make an API call to save the prescription
        console.log('Generating prescription:', {
          patientId: selectedPatient.value._id,
          patientName: selectedPatient.value.name,
          medications: medications.value
        })
        
        // Schedule notifications for medications with reminders enabled
        notificationService.scheduleMedicationReminders(medications.value)
        
        // Add medications to patient's profile
        for (const medication of medications.value) {
          await patientService.addMedication(selectedPatient.value._id, medication)
        }
        
        // Show success message
        alert('E-Prescription generated successfully!')
        
        // Reset form
        selectedPatient.value = null
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

    onMounted(() => {
      loadPatients()
    })

    return {
      loading,
      loadingPatients,
      selectedPatient,
      patients,
      medications,
      frequencyOptions,
      addMedication,
      removeMedication,
      addReminderTime,
      removeReminderTime,
      testNotification,
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