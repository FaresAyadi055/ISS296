<template>
  <v-app style="background-color: #f8fafc;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />

    <v-main>
      <v-container>
        <v-btn to="/bookingPagePatient" class="mb-3" color="primary">Back</v-btn>

        <div class="text-center mb-6">
          <h1 class="text-primary font-weight-bold mb-2">
            Dr. {{ doctorData.firstName }} {{ doctorData.lastName }}
          </h1>
          <h2 class="text-blue-darken-1 text-subtitle-1">
            {{ doctorData.specialty }} • {{ doctorData.address }}
          </h2>
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
                <div v-if="times.length === 0" class="text-caption text-grey">No available slots</div>
                <v-chip 
                  v-for="(time, i) in times" 
                  :key="i" 
                  class="ma-1" 
                  :color="isBooked(day, time) ? (isUserBooking(day, time) ? 'orange' : 'grey') : 'primary'" 
                  text-color="white"
                  @click="openDialog(day, time)"
                  :disabled="isBooked(day, time) && !isUserBooking(day, time)"
                >
                  <template v-if="isUserBooking(day, time)">
                    {{ time }} (Your booking)
                  </template>
                  <template v-else-if="isBooked(day, time)">
                    {{ time }} (Booked)
                  </template>
                  <template v-else>
                    {{ time }}
                  </template>
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
              <v-btn v-if="isBooked(selectedDay, selectedTime) && isUserBooking(selectedDay, selectedTime)" @click="cancelAppointment" color="orange" class="custom-btn">Yes, Cancel Booking</v-btn>
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
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import NavbarAuthPatient from '@/components/navbarAuthPatient.vue';
import Navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';

const route = useRoute();
const router = useRouter();
const doctorId = ref(route.params.doctorId); // Get the doctor ID from route params

// Doctor data and schedule
const doctorData = ref({
  firstName: '',
  lastName: '',
  specialty: '',
  address: '',
  workingHours: {}
});
const schedule = ref({});
const loading = ref(true);
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

// New variable to track user's bookings
const userBookings = ref([]);
const currentUserId = ref('');

// Add this variable to track all bookings, not just the user's
const allBookings = ref([]);

// Days of the week
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Helper to capitalize first letter
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Expand the isUserLoggedIn function to also set the currentUserId
const isUserLoggedIn = () => {
  // First check sessionStorage
  const currentUser = sessionStorage.getItem('currentPatient');
  if (currentUser) {
    currentUserId.value = currentUser.toString();
    return true;
  }

  // If not in sessionStorage, check localStorage
  const storedPatient = localStorage.getItem('patient');
  if (storedPatient) {
    const patient = JSON.parse(storedPatient);
    // Store in sessionStorage for future use
    sessionStorage.setItem('currentPatient', patient.id || patient._id);
    currentUserId.value = (patient.id || patient._id).toString();
    return true;
  }

  return false;
};

// Check if a booking was made by the current user
const isUserBooking = (day, time) => {
  const cleanTime = time.replace(' (Booked)', '').replace(' (Your booking)', '');
  
  const isUserBooked = userBookings.value.some(booking => 
    booking.day.toLowerCase() === day.toLowerCase() && 
    booking.time === cleanTime
  );
  
  // For debugging
  if (isUserBooked) {
    console.log(`User booking found for ${day} at ${cleanTime}`);
  }
  
  return isUserBooked;
};

// Generate time slots from start time to end time with 30-minute intervals
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  
  while (current < end) {
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    
    // Add 30 minutes
    current.setMinutes(current.getMinutes() + 30);
  }
  
  return slots;
};

// Fetch doctor data and generate schedule
async function fetchDoctorData() {
  loading.value = true;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/doctors/${doctorId.value}`);
    
    if (response.data) {
      doctorData.value = response.data;
      
      // Generate schedule from working hours
      const generatedSchedule = {};
      
      days.forEach(day => {
        generatedSchedule[capitalize(day)] = [];
        
        // Check if doctor has working hours for this day
        if (doctorData.value.workingHours && doctorData.value.workingHours[day] && doctorData.value.workingHours[day].length > 0) {
          // For each time slot in the working hours
          doctorData.value.workingHours[day].forEach(slot => {
            if (slot.startTime && slot.endTime) {
              // Generate 30 min intervals
              const timeSlots = generateTimeSlots(slot.startTime, slot.endTime);
              generatedSchedule[capitalize(day)] = [...generatedSchedule[capitalize(day)], ...timeSlots];
            }
          });
        }
      });
      
      schedule.value = generatedSchedule;
      
      // Fetch booked appointments
      await fetchAppointments();
    }
  } catch (error) {
    console.error('Error fetching doctor data:', error);
  } finally {
    loading.value = false;
  }
}

// Fetch appointments for the doctor
async function fetchAppointments() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await axios.get(`${apiUrl}/api/appointments/${doctorId.value}`);
    const appointments = response.data || [];
    
    // Reset bookings
    userBookings.value = [];
    allBookings.value = [];
    
    // Process all appointments
    appointments.forEach(appointment => {
      // Add to all bookings list
      allBookings.value.push({
        day: capitalize(appointment.day),
        time: appointment.time,
        patientId: appointment.patientId,
        id: appointment._id
      });
      
      // Check if this appointment belongs to the current user
      if (String(appointment.patientId) === String(currentUserId.value)) {
        userBookings.value.push({
          day: capitalize(appointment.day),
          time: appointment.time,
          id: appointment._id
        });
        console.log('Found a user booking:', appointment);
      }
    });
    
    console.log('Current user ID:', currentUserId.value);
    console.log('User bookings:', userBookings.value);
    console.log('All bookings:', allBookings.value);
  } catch (error) {
    console.error('Error fetching appointments:', error);
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
  selectedTime.value = time.replace(' (Booked)', '').replace(' (Your booking)', '');

  // Check if the time is already booked
  if (isBooked(day, time)) {
    if (isUserBooking(day, time)) {
      // This is the user's own booking
      dialogTitle.value = 'Cancel Booking';
      dialogMessage.value = `Do you want to cancel your booking for ${selectedTime.value}?`;
    } else {
      // This is someone else's booking
      dialogTitle.value = 'Time Slot Already Booked';
      dialogMessage.value = `The time slot ${selectedTime.value} is already booked. Please select another time.`;
    }
  } else {
    // This is an available slot
    dialogTitle.value = 'Confirm Booking';
    dialogMessage.value = `You are about to book the time slot: ${selectedTime.value}`;
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
  try {
    if (!isUserLoggedIn()) {
      router.push('/signIn');
      return;
    }
    
    console.log('Booking appointment for doctor:', doctorId.value);
    console.log('Selected day:', selectedDay.value);
    console.log('Selected time:', selectedTime.value);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Save the appointment to the backend
    const appointmentData = {
      doctorId: doctorId.value,
      day: selectedDay.value.toLowerCase(),
      time: selectedTime.value,
      patientId: currentUserId.value
    };
    
    console.log('Sending appointment data:', appointmentData);
    
    const response = await axios.post(`${apiUrl}/api/appointments`, appointmentData);
    console.log('Backend response:', response.data);
    
    const newBooking = {
      day: selectedDay.value,
      time: selectedTime.value,
      id: response.data._id,
      patientId: currentUserId.value
    };
    
    // Add to user bookings
    userBookings.value.push({
      day: selectedDay.value,
      time: selectedTime.value,
      id: response.data._id
    });
    
    // Add to all bookings as well
    allBookings.value.push(newBooking);
    
    // Close the confirmation dialog and show success dialog
    dialog.value = false;
    successDialog.value = true;
    
    // Clear the selected time after booking
    selectedTime.value = '';
  } catch (error) {
    console.error('Error booking appointment:', error);
    
    // Check if this is an "already booked" error
    if (error.response?.data?.message === 'This time slot is already booked') {
      dialogTitle.value = 'Time Slot Already Booked';
      dialogMessage.value = 'This time slot is already booked. Please select another time.';
    } else {
      dialogTitle.value = 'Booking Failed';
      dialogMessage.value = 'Failed to book appointment. Please try again.';
    }
    
    dialog.value = true;
    
    // Refresh appointments to make sure we have latest data
    await fetchAppointments();
  }
}

// Close the success dialog
function closeSuccessDialog() {
  successDialog.value = false;
}

// Check if the time is already booked
function isBooked(day, time) {
  // Clean the time first to handle comparison properly
  const cleanTime = time.replace(' (Booked)', '').replace(' (Your booking)', '');
  
  // Check if the appointment exists in allBookings
  return allBookings.value.some(booking => 
    booking.day.toLowerCase() === day.toLowerCase() && 
    booking.time === cleanTime
  );
}

// Function to cancel an appointment
async function cancelAppointment() {
  try {
    const cleanTime = selectedTime.value.replace(' (Booked)', '').replace(' (Your booking)', '');
    
    // Find the booking to cancel from userBookings
    const bookingToCancel = userBookings.value.find(booking =>
      booking.day.toLowerCase() === selectedDay.value.toLowerCase() &&
      booking.time === cleanTime
    );
    
    if (!bookingToCancel) {
      console.error('Could not find booking to cancel');
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Could not find your appointment in the system.';
      dialog.value = true;
      return;
    }
    
    console.log('Cancelling appointment:', bookingToCancel);
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // Delete the appointment using its ID
    await axios.delete(`${apiUrl}/api/appointments/${bookingToCancel.id}`);
    
    // Remove from userBookings
    userBookings.value = userBookings.value.filter(booking => booking.id !== bookingToCancel.id);
    
    // Remove from allBookings as well
    allBookings.value = allBookings.value.filter(booking => booking.id !== bookingToCancel.id);
    
    // Close the confirmation dialog
    dialog.value = false;
    
    // Show success message
    dialogTitle.value = 'Booking Cancelled';
    dialogMessage.value = `Your booking for ${cleanTime} has been cancelled.`;
    dialog.value = true;
    
    // Auto close the success dialog after a delay
    setTimeout(() => {
      dialog.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    dialogTitle.value = 'Error';
    dialogMessage.value = 'Could not cancel your appointment. Please try again.';
    dialog.value = true;
  }
}

// Initialize on component mount
onMounted(async () => {
  isUserLoggedIn(); // Set the current user ID
  await fetchDoctorData();
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

