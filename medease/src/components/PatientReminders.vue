<template>
    <div>
      <h2>Patient Reminders</h2>
  
      <ul>
        <li v-for="reminder in patientReminders" :key="reminder._id">
          <p>Medication: {{ reminder.medication }}</p>
          <p>Frequency: {{ reminder.frequency }}</p>
          <p>Time: {{ reminder.time }}</p>
          <p>Duration: {{ reminder.duration }}</p>
          <button @click="deleteReminder(reminder._id)">Delete Reminder</button>
        </li>
      </ul>
  
      <div>
        <h3>Add Reminder</h3>
        <input v-model="medication" placeholder="Medication" />
        <input v-model="frequency" placeholder="Frequency" />
        <input v-model="time" placeholder="Time" />
        <input v-model="duration" placeholder="Duration" />
        <button @click="addReminder">Add</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import api from '@/services/api'; // Assuming you have a service for API calls
  
  export default {
    setup() {
      const patientId = 'your-patient-id'; // Make sure to get the patient ID dynamically
      const patientReminders = ref([]);
      const medication = ref('');
      const frequency = ref('');
      const time = ref('');
      const duration = ref('');
  
      // Fetch reminders when the component is mounted
      onMounted(() => {
        fetchReminders();
      });
  
      // Fetch reminders from the backend
      const fetchReminders = async () => {
        try {
          const response = await api.get(`/patients/${patientId}/reminders`);
          patientReminders.value = response.data;
        } catch (error) {
          console.error("Error fetching reminders:", error);
        }
      };
  
      // Add a new reminder to the patient
      const addReminder = async () => {
        try {
          const reminderData = {
            medication: medication.value,
            frequency: frequency.value,
            time: time.value,
            duration: duration.value
          };
  
          const response = await api.post(`/patients/${patientId}/reminders`, reminderData);
          console.log("Reminder Added:", response.data);
          fetchReminders(); // Refresh reminders list
        } catch (error) {
          console.error("Error adding reminder:", error);
        }
      };
  
      // Delete a reminder for the patient
      const deleteReminder = async (reminderId) => {
        try {
          const response = await api.delete(`/patients/${patientId}/reminders/${reminderId}`);
          console.log("Reminder Deleted:", response.data);
          fetchReminders(); // Refresh reminders list
        } catch (error) {
          console.error("Error deleting reminder:", error);
        }
      };
  
      return {
        patientReminders,
        medication,
        frequency,
        time,
        duration,
        addReminder,
        deleteReminder
      };
    }
  };
  </script>
  