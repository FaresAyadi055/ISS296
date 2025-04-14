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
            <v-btn @click="nextWeek" color="primary">Next Week</v-btn>
          </v-col>
        </v-row>

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
                    @click="togglePatientDetails(appointment.patientId)"
                  >
                    {{ appointment.time }} - {{ appointment.patientName }}
                  </v-chip>
                  <v-expand-transition>
                    <div v-if="expandedPatientId === appointment.patientId" class="patient-details">
                      <p><strong>Name:</strong> {{ patientDetails.firstName }} {{ patientDetails.lastName }}</p>
                      <p><strong>Email:</strong> {{ patientDetails.email }}</p>
                      <p><strong>Phone:</strong> {{ patientDetails.phone }}</p>
                      <p><strong>Address:</strong> {{ patientDetails.address }}</p>
                      <p><strong>DOB:</strong> {{ new Date(patientDetails.dob).toLocaleDateString() }}</p>
                      <p><strong>Gender:</strong> {{ patientDetails.gender }}</p>
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
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
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
const expandedPatientId = ref(null); // Track which patient's details are expanded
const patientDetails = ref({}); // Store the details of the selected patient

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
          patientId: appointment.patientId
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

function togglePatientDetails(patientId) {
  if (expandedPatientId.value === patientId) {
    expandedPatientId.value = null;
    return;
  }

  // Check if the details for this patient are already loaded
  if (patientDetails.value.id === patientId) {
    expandedPatientId.value = patientId;
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  axios.get(`${apiUrl}/api/patients/${patientId}`)
    .then(response => {
      patientDetails.value = { ...response.data, id: patientId }; // Store patient ID to avoid duplicate fetches
      expandedPatientId.value = patientId;
    })
    .catch(error => {
      console.error('Error fetching patient details:', error);
      alert('Failed to fetch patient details.');
    });
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
  display: flex;
  flex-direction: row;
  gap: 10px;
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
</style>
