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
            <button v-else @click.stop="addAppointment(slot, day)">+</button>
          </div>
        </template>
      </template>
    </div>

    <div v-if="selectedAppointment" class="modal">
      <div class="modal-content">
        <h3>Appointment Details</h3>
        <p><strong>Patient:</strong> {{ selectedAppointment.patientName }}</p>
        <p v-if="selectedAppointment.details"><strong>Details:</strong> {{ selectedAppointment.details }}</p>
        <p><strong>Time:</strong> {{ selectedAppointment.time }}</p>
        <p><strong>Day:</strong> {{ selectedAppointment.day }}</p>
        <button @click="selectedAppointment = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import patientsData from "@/repos/patient.json";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = Array.from({ length: 16 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`);
const appointments = ref({});
const selectedAppointment = ref(null);
const patients = patientsData.patients;

const openAppointment = (time, day) => {
  if (appointments.value[day] && appointments.value[day][time]) {
    selectedAppointment.value = { ...appointments.value[day][time], time, day };
  }
};

const addAppointment = (time, day) => {
  const patientName = prompt("Enter Patient Name (First and Last):");
  if (patientName) {
    if (!appointments.value[day]) appointments.value[day] = {};
    const patientDetails = patients.find(p => `${p.firstName} ${p.lastName}`.toLowerCase() === patientName.toLowerCase());
    appointments.value[day][time] = {
      patientName,
      details: patientDetails 
        ? `Chronic: ${patientDetails.healthConditions.chronic || "None"}, Medications: ${patientDetails.healthConditions.medications || "None"}, Allergies: ${patientDetails.healthConditions.allergies || "None"}`
        : "No additional details available"
    };
  }
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
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  color: black;
}
.modal-content {
  text-align: center;
}
</style>
