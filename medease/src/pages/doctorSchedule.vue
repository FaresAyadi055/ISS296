<template>
  <navbardoctor />
  <div class="schedule-container">
    <h2 class="title">Doctor's Schedule</h2>
    <div class="schedule-grid">
      <div class="header"></div>
      <div class="header" v-for="slot in timeSlots" :key="slot">{{ slot }}</div>
      <template v-for="(day, dayIndex) in days" :key="dayIndex">
        <div class="header">{{ day }}</div>
        <template v-for="(slot, index) in timeSlots" :key="index">
          <div class="appointment" @click="openAppointment(slot, day)">
            <span v-if="appointments[day] && appointments[day][slot]">
              {{ appointments[day][slot].patientName }}
            </span>
            <button v-else @click.stop="selectPatient(slot, day)">+</button>
          </div>
        </template>
      </template>
    </div>

    <!-- Modal to select patient -->
    <v-dialog v-model="showModal" max-width="400">
      <v-card>
        <v-card-title>Select Patient</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedPatient"
            :items="patients"
            item-title="fullName"
            item-value="id"
            label="Select a patient"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmAppointment">Confirm</v-btn>
          <v-btn color="error" @click="cancelModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = Array.from({ length: 16 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`);
const appointments = ref({});
const patients = ref([]);
const showModal = ref(false);
const selectedPatient = ref(null);
const selectedSlot = ref(null);
const selectedDay = ref(null);

// Fetch patients and appointments on component mount
onMounted(async () => {
  try {
    const { data } = await axios.get('/api/patients');
    patients.value = data.map(patient => ({
      id: patient.id,
      fullName: `${patient.firstName} ${patient.lastName}`
    }));

    await fetchAppointments(); // Load appointments
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Fetch updated appointments from the backend
const fetchAppointments = async () => {
  try {
    const appointmentsRes = await axios.get('/api/appointments');
    appointments.value = appointmentsRes.data; // 🔄 Refresh the schedule
  } catch (error) {
    console.error('Error fetching updated appointments:', error);
  }
};

// Select patient for the appointment
const selectPatient = (time, day) => {
  console.log("Patient selection initiated for:", time, day); // Debugging
  selectedSlot.value = time;
  selectedDay.value = day;
  showModal.value = true; // Ensure the modal is shown
};

// Confirm the appointment and refresh the schedule
const confirmAppointment = async () => {
  if (!selectedPatient.value) return;

  try {
    await axios.post('/api/appointments', {
      patientId: selectedPatient.value,
      time: selectedSlot.value,
      day: selectedDay.value
    });

    await fetchAppointments(); // 🔄 Refresh schedule after booking

    showModal.value = false; // Close modal after confirming the appointment
  } catch (error) {
    console.error('Error booking appointment:', error);
  }
};

// Cancel modal action
const cancelModal = () => {
  console.log("Canceling modal..."); // Debugging cancel action
  showModal.value = false;
};
</script>

<style scoped>
.schedule-container {
  text-align: center;
  padding: 20px;
  background-color: white;
  color: black;
}
.title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #007bff;
}
.schedule-grid {
  display: grid;
  grid-template-columns: 100px repeat(16, 1fr);
  gap: 5px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
}
.header {
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
}
.appointment {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #007bff;
  padding: 5px;
  cursor: pointer;
  background-color: white;
  color: #007bff;
}
button {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 5px;
  cursor: pointer;
}
button:hover {
  background: #007bff;
  color: white;
}
</style>
