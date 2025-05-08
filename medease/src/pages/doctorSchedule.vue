<template>
  <v-app style="background-color: #f8fafc;">
    <navbardoctor />

    <v-main>
      <v-container>
        <div class="text-center mb-6">
          <h1 class="text-primary font-weight-bold mb-2">
            Dr. {{ doctorData.firstName }} {{ doctorData.lastName }}
          </h1>
        </div>

        <v-row class="my-4">
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <v-btn @click="prevWeek" color="primary">Previous Week</v-btn>
            <h2 class="text-blue-darken-2 font-weight-medium">Week of {{ formattedWeek }}</h2>
            <div>
              <v-btn color="success" @click="showAddDialog = true" class="mr-2">Add Appointment</v-btn>
              <v-btn @click="nextWeek" color="primary">Next Week</v-btn>
            </div>
          </v-col>
        </v-row>

        <v-dialog v-model="showAddDialog" max-width="420px">
          <v-card style="border-radius: 20px; background: #f8fafc; box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.10);">
            <v-card-title class="headline text-center mb-1" style="color: #1976D2; font-weight: 700; letter-spacing: 0.02em;">Add Appointment</v-card-title>
            <v-card-subtitle class="text-center mb-3" style="color: #607D8B; font-size: 1.05rem;">Fill in the details below</v-card-subtitle>
            <v-divider class="mb-3"></v-divider>
            <v-card-text>
              <v-form ref="addForm" v-model="addFormValid" lazy-validation>
                <v-select
                  v-model="newAppointment.patientId"
                  :items="patientOptions"
                  item-title="label"
                  item-value="id"
                  label="Patient"
                  required
                  class="mb-3 modern-input"
                  prepend-inner-icon="mdi-account"
                />
                <v-select
                  v-model="newAppointment.day"
                  :items="days"
                  label="Day"
                  required
                  class="mb-3 modern-input"
                  prepend-inner-icon="mdi-calendar"
                />
                <v-text-field
                  v-model="newAppointment.time"
                  label="Time (e.g. 10:00)"
                  required
                  class="mb-3 modern-input"
                  prepend-inner-icon="mdi-clock-outline"
                  placeholder="HH:MM"
                />
                <v-checkbox
                  v-model="newAppointment.paid"
                  class="mb-2 modern-checkbox"
                  color="primary"
                  hide-details
                >
                  <template #label>
                    <span style="color:#000; font-weight:500;">Mark as Paid</span>
                  </template>
                </v-checkbox>
              </v-form>
            </v-card-text>
            <v-divider class="my-2"></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn text @click="showAddDialog = false" class="cancel-btn px-5 py-2">Cancel</v-btn>
              <v-btn color="success" :disabled="!addFormValid" @click="addAppointment" class="add-btn px-6 py-2 ml-2">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div v-if="loading" class="text-center my-5">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">Loading schedule...</p>
        </div>

        <v-table v-else class="custom-table">
          <thead>
            <tr>
              <th class="text-blue-darken-1">Day</th>
              <th class="text-blue-darken-1">Appointments</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(appointments, day, index) in schedule" 
              :key="day"
              :class="{ 'table-row-alt': index % 2 !== 0 }"
            >
              <td class="text-blue-grey-darken-3 font-weight-medium">{{ day }}</td>
              <td>
                <div v-if="appointments.length === 0" class="text-caption text-grey">No appointments</div>
                <div v-for="(appointment, i) in appointments" :key="i" class="appointment-details">
                  <v-chip 
                    class="ma-1 clickable-chip" 
                    color="primary" 
                    text-color="white"
                    @click="togglePatientDetails(appointment)"
                  >
                    {{ appointment.time }} - {{ appointment.patientName }}
                  </v-chip>
                  <v-expand-transition>
                    <div v-if="expandedAppointmentKey === (appointment._id || `${appointment.patientId}-${appointment.time}`)" class="patient-details">
                      <p><strong>Name:</strong> {{ patientDetails.firstName }} {{ patientDetails.lastName }}</p>
                      <p><strong>Email:</strong> {{ patientDetails.email }}</p>
                      <p><strong>Phone:</strong> {{ patientDetails.phone }}</p>
                      <p><strong>Address:</strong> {{ patientDetails.address }}</p>
                      <p><strong>DOB:</strong> {{ new Date(patientDetails.dob).toLocaleDateString() }}</p>
                      <p><strong>Gender:</strong> {{ patientDetails.gender }}</p>
                      <p>
                        <strong>Payment Status:</strong>
                        <span :style="{ color: appointment.paid ? '#43a047' : '#e53935', fontWeight: 'bold' }">
                          {{ appointment.paid ? 'Paid' : 'Not Paid' }}
                        </span>
                      </p>
                      <p><strong>Health Conditions:</strong></p>
                      <ul>
                        <li v-if="patientDetails.healthConditions.chronic">
                          <strong>Chronic:</strong> {{ patientDetails.healthConditions.chronic }}
                        </li>
                        <li v-if="patientDetails.healthConditions.medications">
                          <strong>Medications:</strong> {{ patientDetails.healthConditions.medications }}
                        </li>
                        <li v-if="patientDetails.healthConditions.allergies">
                          <strong>Allergies:</strong> {{ patientDetails.healthConditions.allergies }}
                        </li>
                      </ul>
                    </div>
                  </v-expand-transition>
                  <v-btn icon color="error" @click.stop="confirmDeleteAppointment(appointment)" class="ml-1 small-delete-btn delete-btn-right">
                    <v-icon size="18">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-dialog v-model="showDeleteDialog" max-width="350px">
          <v-card>
            <v-card-title class="headline">Delete Appointment</v-card-title>
            <v-card-text>Are you sure you want to delete this appointment?</v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
              <v-btn color="error" @click="deleteAppointment">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import NavbarDoctor from '@/components/navbardoctor.vue';

const schedule = ref({});
const loading = ref(true);
const currentWeek = ref(new Date());
const doctorId = ref(''); // Store the logged-in doctor's ID
const doctorData = ref({ firstName: '', lastName: '' }); // Store the logged-in doctor's data
const expandedAppointmentKey = ref(null); // Track which appointment's details are expanded
const patientDetails = ref({}); // Store the details of the selected patient

const showAddDialog = ref(false);
const addFormValid = ref(false);
const newAppointment = ref({
  patientId: '',
  day: '',
  time: '',
  paid: false
});
const patientOptions = ref([]);

const showDeleteDialog = ref(false);
const appointmentToDelete = ref(null);

const formattedWeek = computed(() => {
  const startOfWeek = new Date(currentWeek.value);
  const endOfWeek = new Date(currentWeek.value);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date) => date.toISOString().split("T")[0];
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
});

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function fetchSchedule() {
  loading.value = true;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/appointments/${doctorId.value}`);

    const generatedSchedule = {};
    days.forEach((day) => {
      generatedSchedule[day] = [];
    });

    for (const appointment of response.data) {
      const capitalizedDay = appointment.day.charAt(0).toUpperCase() + appointment.day.slice(1);
      let patientName = 'Unknown Patient';

      if (appointment.patientId) {
        try {
          const patientResponse = await axios.get(`${apiUrl}/api/patients/${appointment.patientId}`);
          const patient = patientResponse.data;
          patientName = `${patient.firstName} ${patient.lastName}`;
        } catch (error) {
          console.error(`Error fetching patient details for ID ${appointment.patientId}:`, error);
        }
      }

      if (generatedSchedule[capitalizedDay]) {
        generatedSchedule[capitalizedDay].push({
          time: appointment.time,
          patientName,
          patientId: appointment.patientId,
          paid: appointment.paid,
          _id: appointment._id
        });
      }
    }

    schedule.value = generatedSchedule;
    console.log('Generated Schedule:', schedule.value); // Debugging log
  } catch (error) {
    console.error('Error fetching schedule:', error);
  } finally {
    loading.value = false;
  }
}

function nextWeek() {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() + 7);
  currentWeek.value = newWeek;
  fetchSchedule();
}

function prevWeek() {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() - 7);
  currentWeek.value = newWeek;
  fetchSchedule();
}

function togglePatientDetails(appointment) {
  const key = appointment._id || `${appointment.patientId}-${appointment.time}`;
  if (expandedAppointmentKey.value === key) {
    expandedAppointmentKey.value = null;
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  axios.get(`${apiUrl}/api/patients/${appointment.patientId}`)
    .then(response => {
      patientDetails.value = { ...response.data, id: appointment.patientId };
      expandedAppointmentKey.value = key;
    })
    .catch(error => {
      console.error('Error fetching patient details:', error);
      alert('Failed to fetch patient details.');
    });
}

function addAppointment() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Log the data being sent
  console.log({
    ...newAppointment.value,
    doctorId: doctorId.value
  });
  // Validate required fields
  if (!newAppointment.value.patientId || !newAppointment.value.day || !newAppointment.value.time || !doctorId.value) {
    alert('Please fill in all required fields.');
    return;
  }
  axios.post(`${apiUrl}/api/appointments`, {
    doctorId: doctorId.value,
    patientId: newAppointment.value.patientId,
    day: newAppointment.value.day,
    time: newAppointment.value.time,
    paid: newAppointment.value.paid || false,
    date: new Date().toISOString().split('T')[0] // Add today's date as default
  })
    .then(() => {
      showAddDialog.value = false;
      fetchSchedule();
    })
    .catch(error => {
      console.error('Error adding appointment:', error);
      alert('Failed to add appointment.');
    });
}

function confirmDeleteAppointment(appointment) {
  appointmentToDelete.value = appointment;
  showDeleteDialog.value = true;
}

function deleteAppointment() {
  if (!appointmentToDelete.value) return;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  axios.delete(`${apiUrl}/api/appointments/${appointmentToDelete.value._id}`)
    .then(() => {
      showDeleteDialog.value = false;
      appointmentToDelete.value = null;
      fetchSchedule();
    })
    .catch(error => {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment.');
    });
}

async function fetchPatients() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  try {
    const response = await axios.get(`${apiUrl}/api/patients`);
    patientOptions.value = response.data.map(patient => ({
      id: patient._id,
      label: `${patient.firstName} ${patient.lastName}`
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
}

onMounted(() => {
  const storedDoctor = localStorage.getItem('doctor') || sessionStorage.getItem('doctor');
  if (storedDoctor) {
    const doctor = JSON.parse(storedDoctor);
    doctorId.value = doctor.id || doctor._id;
    doctorData.value.firstName = doctor.firstName || '';
    doctorData.value.lastName = doctor.lastName || '';
  } else {
    console.error('Doctor not logged in. Redirecting to login page.');
    // Redirect to login page if doctor is not logged in
    window.location.href = '/doctorSignin';
  }

  fetchSchedule();
  fetchPatients();
});
</script>

<style scoped>
/* Table header */
th {
  background-color: #E3F2FD !important; /* Soft blue */
  color: #1976D2 !important; /* Vuetify blue */
  font-weight: bold;
  border: none !important; /* No border */
}

/* Alternating row colors */
.table-row-alt {
  background-color: #FFFFFF !important; /* White background for alternating rows */
}

/* Table cell content */
td {
  color: #607D8B !important; /* Blue-gray */
  font-weight: 500;
  border: none !important; /* No border */
  background-color: white !important; /* No background color */
}

v-chip {
  background-color: #1976D2 !important; /* Blue background for chips */
  color: white !important; /* Text in white */
}

h1, h2 {
  color: #1976D2 !important; /* Blue text */
}

.appointment-details {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.patient-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clickable-chip {
  cursor: pointer;
}

.modern-input :deep(input), .modern-input :deep(.v-field__input),
.modern-input :deep(.v-label),
.modern-input :deep(.v-icon),
.modern-input :deep(.v-input__icon),
.modern-input :deep(.v-icon__svg) {
  color: #000 !important;
  fill: #000 !important;
}

.modern-input :deep(input), .modern-input :deep(.v-field__input) {
  background: #f1f3f6 !important;
  border-radius: 12px !important;
  border: 1.5px solid #d0d7e2 !important;
  font-size: 1.08rem;
  color: #000 !important;
  box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.04);
  transition: border 0.2s, box-shadow 0.2s;
}
.modern-input :deep(input:focus), .modern-input :deep(.v-field__input:focus) {
  border: 1.5px solid #1976D2 !important;
  box-shadow: 0 0 0 2px #e3f0ff;
}
.modern-checkbox .v-label {
  color: #1976D2 !important;
  font-weight: 500;
}
.modern-checkbox :deep(.v-label),
.modern-checkbox :deep(.v-selection-control__input),
.modern-checkbox :deep(.v-icon),
.modern-checkbox :deep(.v-icon__svg) {
  color: #000 !important;
  fill: #000 !important;
}
.modern-checkbox :deep(.v-label) {
  font-weight: 500;
  font-size: 1.05rem;
}
.add-btn {
  background: linear-gradient(90deg, #43a047 0%, #81c784 100%) !important;
  color: #fff !important;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px 0 rgba(67, 160, 71, 0.10);
  transition: background 0.2s, box-shadow 0.2s;
}
.add-btn:hover {
  background: linear-gradient(90deg, #388e3c 0%, #66bb6a 100%) !important;
  box-shadow: 0 4px 16px 0 rgba(67, 160, 71, 0.16);
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

.small-delete-btn {
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  margin-left: 4px !important;
  background: transparent !important;
  box-shadow: none !important;
  opacity: 0.85;
  color: #e53935 !important;
  transition: opacity 0.2s, background 0.2s, color 0.2s;
}
.small-delete-btn:hover {
  opacity: 1;
  background: #ffeaea !important;
  color: #b71c1c !important;
}

.delete-btn-right {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
</style>
