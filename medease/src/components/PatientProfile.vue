<template>
  <v-app style="background-color: white;">
    <navbardoctor />
    
    <v-container class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <!-- Patient Header -->
          <v-card class="pa-4 mb-6" style="background-color: white;" elevation="0">
            <div class="d-flex align-center">
              <v-avatar size="100" class="mr-4">
                <v-img :src="patient.photo || '/default-avatar.png'" alt="Patient Photo"></v-img>
              </v-avatar>
              <div>
                <h2 class="text-h4 mb-2" style="color: black;">{{ patient.name }}</h2>
                <p class="text-subtitle-1 mb-1" style="color: black;">ID: {{ patient.id }}</p>
                <p class="text-subtitle-1" style="color: black;">Age: {{ patient.age }}</p>
              </div>
            </div>
          </v-card>

          <!-- Medical History -->
          <v-card class="pa-4 mb-6" style="background-color: white;" elevation="0">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h5" style="color: black;">Medical History</h3>
              <v-btn
                color="primary"
                @click="showAddConditionDialog = true"
                style="background-color: #579AFE; color: white;"
              >
                Add Condition
              </v-btn>
            </div>

            <v-list>
              <v-list-item
                v-for="(condition, index) in patient.medicalHistory"
                :key="index"
                class="mb-2"
                style="background-color: #f8fafc; border-radius: 8px;"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
                </template>
                <v-list-item-title style="color: black;">{{ condition.name }}</v-list-item-title>
                <v-list-item-subtitle style="color: black;">Diagnosed: {{ condition.date }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    color="primary"
                    variant="text"
                    class="mr-2"
                    @click="addReminder(condition)"
                  >
                    Add Reminder
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="text"
                    @click="deleteCondition(index)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Current Medications -->
          <v-card class="pa-4 mb-6" style="background-color: white;" elevation="0">
            <h3 class="text-h5 mb-4" style="color: black;">Current Medications</h3>
            <v-list>
              <v-list-item
                v-for="(medication, index) in patient.medications"
                :key="index"
                class="mb-2"
                style="background-color: #f8fafc; border-radius: 8px;"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-2">mdi-pill</v-icon>
                </template>
                <v-list-item-title style="color: black;">{{ medication.name }}</v-list-item-title>
                <v-list-item-subtitle style="color: black;">
                  Dosage: {{ medication.dosage }} | Frequency: {{ medication.frequency }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    color="primary"
                    variant="text"
                    class="mr-2"
                    @click="addMedicationReminder(medication)"
                  >
                    Add Reminder
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="text"
                    @click="deleteMedication(index)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Reminders -->
          <v-card class="pa-4" style="background-color: white;" elevation="0">
            <h3 class="text-h5 mb-4" style="color: black;">Active Reminders</h3>
            <v-list>
              <v-list-item
                v-for="(reminder, index) in patient.reminders"
                :key="index"
                class="mb-2"
                style="background-color: #f8fafc; border-radius: 8px;"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-2">mdi-bell</v-icon>
                </template>
                <v-list-item-title style="color: black;">{{ reminder.title }}</v-list-item-title>
                <v-list-item-subtitle style="color: black;">
                  Time: {{ reminder.time }} | Frequency: {{ reminder.frequency }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn
                    color="error"
                    variant="text"
                    @click="deleteReminder(index)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add Condition Dialog -->
    <v-dialog v-model="showAddConditionDialog" max-width="500px">
      <v-card class="pa-4">
        <h3 class="text-h5 mb-4" style="color: black;">Add Medical Condition</h3>
        <v-form @submit.prevent="addCondition">
          <v-text-field
            v-model="newCondition.name"
            label="Condition Name"
            required
            class="mb-4"
            variant="outlined"
            color="primary"
          ></v-text-field>
          <v-text-field
            v-model="newCondition.date"
            label="Diagnosis Date"
            type="date"
            required
            class="mb-4"
            variant="outlined"
            color="primary"
          ></v-text-field>
          <div class="d-flex justify-end gap-2">
            <v-btn
              color="grey"
              variant="text"
              @click="showAddConditionDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              style="background-color: #579AFE; color: white;"
            >
              Add
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Add Reminder Dialog -->
    <v-dialog v-model="showAddReminderDialog" max-width="500px">
      <v-card class="pa-4">
        <h3 class="text-h5 mb-4" style="color: black;">Add Reminder</h3>
        <v-form @submit.prevent="saveReminder">
          <v-text-field
            v-model="newReminder.title"
            label="Reminder Title"
            required
            class="mb-4"
            variant="outlined"
            color="primary"
          ></v-text-field>
          <v-text-field
            v-model="newReminder.time"
            label="Reminder Time"
            type="time"
            required
            class="mb-4"
            variant="outlined"
            color="primary"
          ></v-text-field>
          <v-select
            v-model="newReminder.frequency"
            :items="frequencyOptions"
            label="Frequency"
            required
            class="mb-4"
            variant="outlined"
            color="primary"
          ></v-select>
          <div class="d-flex justify-end gap-2">
            <v-btn
              color="grey"
              variant="text"
              @click="showAddReminderDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              style="background-color: #579AFE; color: white;"
            >
              Add
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <AppFooter />
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue'
import { notificationService } from '@/services/NotificationService'
import navbardoctor from '@/components/navbardoctor.vue'
import footer from '@/components/footer.vue'
import { useRoute } from 'vue-router'
import { patientService } from '@/services/PatientService'

export default {
  name: 'PatientProfile',
  components: {
    navbardoctor,
    AppFooter: footer
  },
  setup() {
    const route = useRoute()
    const patient = ref({
      id: '',
      name: '',
      age: '',
      photo: '',
      medicalHistory: [],
      medications: [],
      reminders: []
    })

    const showAddConditionDialog = ref(false)
    const showAddReminderDialog = ref(false)
    const newCondition = ref({
      name: '',
      date: ''
    })
    const newReminder = ref({
      title: '',
      time: '',
      frequency: ''
    })

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

    const loadPatientData = async () => {
      const patientId = route.params.id
      try {
        const patientData = await patientService.getPatientById(patientId)
        patient.value = patientData
      } catch (error) {
        console.error('Error loading patient data:', error)
        // You might want to show an error message to the user
      }
    }

    const addCondition = async () => {
      try {
        const newConditionData = await patientService.addCondition(patient.value.id, newCondition.value)
        patient.value.medicalHistory.push(newConditionData)
        showAddConditionDialog.value = false
        newCondition.value = { name: '', date: '' }
      } catch (error) {
        console.error('Error adding condition:', error)
        // Show error message to user
      }
    }

    const deleteCondition = async (index) => {
      try {
        const conditionId = patient.value.medicalHistory[index]._id
        await patientService.deleteCondition(patient.value.id, conditionId)
        patient.value.medicalHistory.splice(index, 1)
      } catch (error) {
        console.error('Error deleting condition:', error)
        // Show error message to user
      }
    }

    const addReminder = (condition) => {
      newReminder.value.title = `Check ${condition.name}`
      showAddReminderDialog.value = true
    }

    const addMedicationReminder = (medication) => {
      newReminder.value.title = `Take ${medication.name}`
      showAddReminderDialog.value = true
    }

    const saveReminder = async () => {
      try {
        const newReminderData = await patientService.addReminder(patient.value.id, newReminder.value)
        patient.value.reminders.push(newReminderData)
        
        // Schedule the notification
        try {
          await notificationService.scheduleNotification({
            title: newReminder.value.title,
            body: `Time to ${newReminder.value.title.toLowerCase()}`,
            scheduledTime: new Date(`2000-01-01T${newReminder.value.time}`),
            frequency: newReminder.value.frequency
          })
        } catch (error) {
          console.error('Error scheduling notification:', error)
        }

        showAddReminderDialog.value = false
        newReminder.value = { title: '', time: '', frequency: '' }
      } catch (error) {
        console.error('Error adding reminder:', error)
        // Show error message to user
      }
    }

    const deleteReminder = async (index) => {
      try {
        const reminderId = patient.value.reminders[index]._id
        await patientService.deleteReminder(patient.value.id, reminderId)
        patient.value.reminders.splice(index, 1)
      } catch (error) {
        console.error('Error deleting reminder:', error)
        // Show error message to user
      }
    }

    const deleteMedication = async (index) => {
      try {
        const medicationId = patient.value.medications[index]._id
        await patientService.deleteMedication(patient.value.id, medicationId)
        patient.value.medications.splice(index, 1)
      } catch (error) {
        console.error('Error deleting medication:', error)
        // Show error message to user
      }
    }

    onMounted(() => {
      loadPatientData()
    })

    return {
      patient,
      showAddConditionDialog,
      showAddReminderDialog,
      newCondition,
      newReminder,
      frequencyOptions,
      addCondition,
      deleteCondition,
      addReminder,
      addMedicationReminder,
      saveReminder,
      deleteReminder,
      deleteMedication
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

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}
</style> 