<template>
  <v-app style="background-color: white;">
    <navbar />

    <v-container>
      <v-btn to="/" class="mb-3" color="primary">Back</v-btn>

      <h1 class="text-primary text-center font-weight-bold">
        Schedule for {{ doctorName }}
      </h1>

      <v-row class="my-4">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <v-btn @click="prevWeek" color="primary">Previous Week</v-btn>
          <h2 class="text-blue-darken-2 font-weight-medium">Week of {{ formattedWeek }}</h2>
          <v-btn @click="nextWeek" color="primary">Next Week</v-btn>
        </v-col>
      </v-row>

      <v-table class="custom-table">
        <thead>
          <tr>
            <th class="text-blue-darken-1">Day</th>
            <th class="text-blue-darken-1">Available Time Slots</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(times, day, index) in schedule" 
            :key="day"
            :class="{ 'table-row-alt': index % 2 !== 0 }"
          >
            <td class="text-blue-grey-darken-3 font-weight-medium">{{ day }}</td>
            <td>
              <v-chip 
                v-for="(time, i) in times" 
                :key="i" 
                class="ma-1" 
                color="primary" 
                text-color="white"
                @click="openDialog(day, time)"
                :disabled="isBooked(day, time)"
              >
                {{ time }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Confirmation Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card class="custom-dialog-card">
          <v-card-title class="headline text-center">
            {{ dialogTitle }}
          </v-card-title>
          <v-card-text class="text-center">
            <p class="font-weight-medium text-blue">{{ dialogMessage }}</p>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="cancelBooking" color="red" class="custom-btn">Cancel</v-btn>
            <v-btn v-if="!isBooked(selectedDay, selectedTime)" @click="bookTime" color="blue" class="custom-btn">Book</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Success Booking Confirmation Dialog -->
      <v-dialog v-model="successDialog" max-width="400px">
        <v-card class="custom-dialog-card">
          <v-card-title class="headline text-center">Booking Successful!</v-card-title>
          <v-card-text class="text-center">
            <p class="font-weight-medium text-blue">Your booking for <strong>{{ selectedTime }}</strong> has been confirmed!</p>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="closeSuccessDialog" color="blue" class="custom-btn">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { doctorlist } from '@/repos/doctors.js'; // Ensure the correct path is used
import api from '@/plugins/axios';

const route = useRoute();
const doctorId = parseInt(route.params.doctorId, 10); // Get the doctor ID from route params

// Default doctor to empty if index is invalid
const doctorName = ref('');
const schedule = ref({});
const formattedWeek = computed(() => {
  return currentWeek.value.toISOString().split("T")[0];
});

const currentWeek = ref(new Date());

// Dialogs and selected time slot
const dialog = ref(false);
const successDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const selectedTime = ref('');
const selectedDay = ref('');

// Fetch the schedule based on the doctor ID
async function fetchSchedule() {
  if (doctorId >= 0 && doctorId < doctorlist.doctors.length) {
    const doctor = doctorlist.doctors[doctorId];
    doctorName.value = doctor.name;
    
    // Create a deep copy of the default schedule
    schedule.value = JSON.parse(JSON.stringify(doctor.schedule));
    
    try {
      // Fetch booked appointments from the backend
      const response = await api.get(`/appointments/${doctorId}`);
      const appointments = response.data || [];
      
      // Make sure appointments is an array
      if (Array.isArray(appointments)) {
        // Update the schedule with booked appointments
        appointments.forEach(appointment => {
          const daySchedule = schedule.value[appointment.day];
          if (daySchedule) {
            const timeIndex = daySchedule.findIndex(time => time === appointment.time);
            if (timeIndex !== -1) {
              daySchedule[timeIndex] = `${appointment.time} (Booked)`;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  } else {
    console.error("Doctor not found for ID:", doctorId);
  }
}

function nextWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() + 7);
}

function prevWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() - 7);
}

// Open dialog when a time slot is clicked
function openDialog(day, time) {
  selectedDay.value = day;
  selectedTime.value = time;

  // Check if the time is already booked
  if (isBooked(day, time)) {
    dialogTitle.value = 'Time Slot Already Booked';
    dialogMessage.value = `The time slot ${time} is already booked. Please select another time.`;
  } else {
    dialogTitle.value = 'Confirm Booking';
    dialogMessage.value = `You are about to book the time slot: ${time}`;
  }
  dialog.value = true;
}

// Cancel the booking process
function cancelBooking() {
  dialog.value = false;
  selectedTime.value = ''; // Clear the selected time
}

// Confirm booking
async function bookTime() {
  const doctorIndex = doctorId;
  console.log('Booking appointment for doctor:', doctorIndex);
  
  if (doctorIndex >= 0 && doctorIndex < doctorlist.doctors.length) {
    const daySchedule = schedule.value[selectedDay.value];
    console.log('Selected day schedule:', daySchedule);
    console.log('Selected time:', selectedTime.value);
    console.log('Selected day:', selectedDay.value);

    if (daySchedule) {
      const timeIndex = daySchedule.indexOf(selectedTime.value);

      if (timeIndex !== -1 && !isBooked(selectedDay.value, selectedTime.value)) {
        try {
          console.log('Sending appointment data:', {
            doctorId: doctorIndex,
            day: selectedDay.value,
            time: selectedTime.value,
            patientId: 'current-user-id'
          });
          
          // Save the appointment to the backend
          const response = await api.post('/appointments', {
            doctorId: doctorIndex,
            day: selectedDay.value,
            time: selectedTime.value,
            patientId: 'current-user-id' // Replace with actual user ID from authentication
          });
          
          console.log('Backend response:', response.data);

          // Update local state
          schedule.value[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;

          // Close the confirmation dialog and show success dialog
          dialog.value = false;
          successDialog.value = true;

          // Clear the selected time after booking
          selectedTime.value = '';
        } catch (error) {
          console.error('Error booking appointment:', error.response?.data || error.message);
          alert('Failed to book appointment. Please try again. Error: ' + (error.response?.data?.message || error.message));
        }
      } else {
        console.log(`The time slot ${selectedTime.value} is already booked.`);
      }
    }
  }
}

// Close the success dialog
function closeSuccessDialog() {
  successDialog.value = false;
  selectedTime.value = ''; // Reset after success
}

// Check if the time is already booked
function isBooked(day, time) {
  const daySchedule = schedule.value[day];
  const booked = daySchedule ? daySchedule.some(slot => slot.startsWith(time) && slot.includes("(Booked)")) : false;

  console.log(`Checking if booked: Day = ${day}, Time = ${time}, Result = ${booked}`);
  return booked;
}

onMounted(fetchSchedule);
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

/* Remove any other default black color */
v-table, v-chip, v-btn {
  color: inherit !important; /* Ensures no black color inheritance */
}

v-chip {
  background-color: #1976D2 !important; /* Blue background for chips */
  color: white !important; /* Text in white */
}

v-btn {
  color: #1976D2 !important; /* Button text in blue */
  border-color: #1976D2 !important; /* Button border in blue */
}

/* Ensure no black text anywhere */
h1, h2 {
  color: #1976D2 !important; /* Blue text */
}

/* Custom Dialog Styling */
.custom-dialog-card {
  background-color: white !important; /* White background */
  border-radius: 15px !important; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-btn {
  border-radius: 25px !important; /* Rounded button corners */
  font-weight: bold;
  padding: 10px 20px;
  text-transform: capitalize;
}

/* Custom styling for the buttons */
.custom-btn:hover {
  background-color: #1976D2 !important;
  color: white !important;
}

/* Blue text for dialog content */
.text-blue {
  color: #1976D2 !important; /* Vuetify blue */
}
</style>
