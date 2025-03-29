<template>
  <v-app style="background-color: #f8fafc;">
    <navbar-auth-patient v-if="isUserLoggedIn()" app />
    <navbar v-else app />

    <v-main>
      <v-container>
        <v-btn to="/bookingPagePatient" class="mb-3" color="primary">Back</v-btn>

        <div class="text-center mb-6">
          <h1 class="text-primary font-weight-bold mb-2">
            {{ doctorName }}
          </h1>
          <h2 class="text-blue-darken-1 text-subtitle-1">
            {{ doctorSpecialty }} • {{ doctorLocation }}
          </h2>
        </div>

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
                  :color="isBooked(day, time) ? (isUserBooking(day, time) ? 'orange' : 'grey') : 'primary'" 
                  text-color="white"
                  @click="openDialog(day, time)"
                  :disabled="false"
                >
                  {{ isUserBooking(day, time) ? `${time} (Your booking)` : time }}
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
import { useRoute } from 'vue-router';
import { doctorlist } from '@/repos/doctors.js'; // Ensure the correct path is used
import api from '@/plugins/axios';
import patientData from '@/repos/patient.js';
import NavbarAuthPatient from '@/components/navbarAuthPatient.vue';
import Navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';
const route = useRoute();
const doctorId = parseInt(route.params.doctorId, 10); // Get the doctor ID from route params

// Default doctor info
const doctorName = ref('');
const doctorSpecialty = ref('');
const doctorLocation = ref('');
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

// New variable to track user's bookings
const userBookings = ref([]);
const currentUserId = ref('');

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
    sessionStorage.setItem('currentPatient', patient.id.toString());
    currentUserId.value = patient.id.toString();
    return true;
  }

  return false;
};

// Check if a booking was made by the current user
const isUserBooking = (day, time) => {
  const cleanTime = time.replace(' (Booked)', '').replace(' (Your booking)', '');
  
  const isUserBooked = userBookings.value.some(booking => 
    booking.day === day && 
    booking.time === cleanTime
  );
  
  // For debugging
  if (isUserBooked) {
    console.log(`User booking found for ${day} at ${cleanTime}`);
  }
  
  return isUserBooked;
};

// Fetch the schedule based on the doctor ID
async function fetchSchedule() {
  // Find the doctor by their ID (not array index)
  const doctor = doctorlist.doctors.find(d => d.id === doctorId);
  
  if (doctor) {
    doctorName.value = doctor.name;
    doctorSpecialty.value = doctor.specialty;
    doctorLocation.value = doctor.location;
    
    // Use the schedule directly from doctorlist
    schedule.value = JSON.parse(JSON.stringify(doctor.schedule));
    
    try {
      // Fetch booked appointments from the backend
      const response = await api.get(`/appointments/${doctorId}`);
      const appointments = response.data || [];
      
      // Make sure appointments is an array
      if (Array.isArray(appointments)) {
        // Update both the local schedule and the doctorlist schedule
        appointments.forEach(appointment => {
          const daySchedule = schedule.value[appointment.day];
          if (daySchedule) {
            const timeIndex = daySchedule.findIndex(time => time === appointment.time);
            if (timeIndex !== -1) {
              const bookedSlot = `${appointment.time} (Booked)`;
              daySchedule[timeIndex] = bookedSlot;
              // Update doctorlist schedule as well
              doctor.schedule[appointment.day][timeIndex] = bookedSlot;
              
              // Check if this appointment belongs to the current user
              // Convert to strings for safer comparison
              if (String(appointment.patientId) === String(currentUserId.value)) {
                userBookings.value.push({
                  day: appointment.day,
                  time: appointment.time,
                  id: appointment.id
                });
                console.log('Found a user booking:', appointment);
              }
            }
          }
        });
      }

      console.log('Current user ID for comparison:', currentUserId.value);
      console.log('All appointments with patient IDs:', appointments.map(a => 
        `${a.day} at ${a.time}, patient: ${a.patientId}, matches current user: ${a.patientId === currentUserId.value}`
      ));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  } else {
    console.error("Doctor not found for ID:", doctorId);
  }
}

// Watch for changes in the schedule and update doctorlist
watch(schedule, (newSchedule) => {
  const doctor = doctorlist.doctors.find(d => d.id === doctorId);
  if (doctor) {
    // Update the doctor's schedule in doctorlist when local schedule changes
    Object.keys(newSchedule).forEach(day => {
      doctor.schedule[day] = [...newSchedule[day]];
    });
  }
}, { deep: true });

function nextWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() + 7);
}

function prevWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() - 7);
}

// Open dialog when a time slot is clicked
function openDialog(day, time) {
  selectedDay.value = day;
  selectedTime.value = time.replace(' (Booked)', ''); // Remove '(Booked)' text for cleaner data

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
  const doctorIndex = doctorId;
  console.log('Booking appointment for doctor:', doctorIndex);
  
  // Find the doctor by ID in the doctorlist
  const doctor = doctorlist.doctors.find(d => d.id === doctorId);
  
  if (doctor) {
    const daySchedule = schedule.value[selectedDay.value];
    console.log('Selected day schedule:', daySchedule);
    console.log('Selected time:', selectedTime.value);
    console.log('Selected day:', selectedDay.value);

    if (daySchedule) {
      const timeIndex = daySchedule.indexOf(selectedTime.value);

      if (timeIndex !== -1 && !isBooked(selectedDay.value, selectedTime.value)) {
        try {
          console.log('Sending appointment data:', {
            doctorId,
            day: selectedDay.value,
            time: selectedTime.value,
            patientId: currentUserId.value
          });
          
          // Save the appointment to the backend
          const response = await api.post('/appointments', {
            doctorId,
            day: selectedDay.value,
            time: selectedTime.value,
            patientId: currentUserId.value
          });
          
          console.log('Backend response:', response.data);

          // Update local state in BookingPage
          schedule.value[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;

          // Update the doctor's schedule in doctorlist
          doctor.schedule[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;

          // Close the confirmation dialog and show success dialog
          dialog.value = false;
          successDialog.value = true;

          // Clear the selected time after booking
          selectedTime.value = '';

          // Add this after successful booking in the bookTime function
          userBookings.value.push({
            day: selectedDay.value,
            time: selectedTime.value, 
            id: response.data.id || Date.now() // Use the API response ID or generate a temporary one
          });

          refreshSchedule(); // Refresh after booking
          window.location.reload();
        } catch (error) {
          // Check if this is an "already booked" error
          if (error.response?.data?.message === 'This time slot is already booked') {
            // If the backend thinks it's booked but our UI doesn't, synchronize:
            if (!isBooked(selectedDay.value, selectedTime.value)) {
              // Update UI to match backend reality
              const timeIndex = daySchedule.indexOf(selectedTime.value);
              if (timeIndex !== -1) {
                schedule.value[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;
                doctor.schedule[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;
              }
            }
            
            // Show error dialog instead of alert
            dialogTitle.value = 'Time Slot Already Booked';
            dialogMessage.value = 'This time slot is already booked. Please select another time.';
            dialog.value = true;
          } else {
            console.error('Error booking appointment:', error.response?.data || error.message);
            
            // Show error dialog instead of alert
            dialogTitle.value = 'Booking Failed';
            dialogMessage.value = 'Failed to book appointment. Please try again.';
            dialog.value = true;
          }
        }
      } else {
        console.log(`The time slot ${selectedTime.value} is already booked.`);
      }
    }
  } else {
    console.error("Doctor not found for ID:", doctorId);
  }
}

// Close the success dialog
function closeSuccessDialog() {
  successDialog.value = false;
  selectedTime.value = ''; // Reset after success
}

// Check if the time is already booked
function isBooked(day, time) {
  // Clean the time first to handle comparison properly
  const cleanTime = time.replace(' (Booked)', '').replace(' (Your booking)', '');
  const daySchedule = schedule.value[day];
  
  // Check if this exact time slot (with potential "Booked" text) is in the schedule
  const booked = daySchedule ? daySchedule.some(slot => {
    const slotClean = slot.replace(' (Booked)', '').replace(' (Your booking)', '');
    return slotClean === cleanTime && slot.includes("(Booked)");
  }) : false;

  console.log(`Checking if booked: Day = ${day}, Time = ${cleanTime}, Result = ${booked}`);
  return booked;
}

// Function to cancel an appointment
async function cancelAppointment() {
  try {
    const cleanTime = selectedTime.value.replace(' (Booked)', '').replace(' (Your booking)', '');
    
    // Fetch all appointments for the doctor
    const response = await api.get(`/appointments/${doctorId}`);
    const appointments = response.data;
    
    console.log('Fetched appointments:', appointments);
    
    // Find the specific appointment to cancel
    const appointmentToCancel = appointments.find(appt => {
      const dayMatches = appt.day === selectedDay.value;
      const timeMatches = appt.time === cleanTime;
      const patientMatches = String(appt.patientId) === String(currentUserId.value);
      
      console.log(`Checking appointment: day=${dayMatches}, time=${timeMatches}, patient=${patientMatches}`);
      
      return dayMatches && timeMatches && patientMatches;
    });
    
    console.log('Appointment to cancel:', appointmentToCancel);
    
    if (!appointmentToCancel || !appointmentToCancel._id) {
      console.error('Could not find appointment to cancel');
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Could not find your appointment in the system.';
      dialog.value = true;
      return;
    }
    
    // Delete the appointment using its ID
    await api.delete(`/appointments/${appointmentToCancel._id}`);
    
    // Update the UI to reflect the cancellation
    updateLocalScheduleAfterCancellation(selectedDay.value, cleanTime);
    
    // Close the confirmation dialog
    dialog.value = false;
    
    // Show success message
    dialogTitle.value = 'Booking Cancelled';
    dialogMessage.value = `Your booking for ${cleanTime} has been cancelled.`;
    window.location.reload();
    
    // Auto close the success dialog after a delay
    setTimeout(() => {
      dialog.value = false;
      refreshSchedule(); // Refresh to ensure sync with backend
    }, 2000);

    refreshSchedule(); // Refresh after cancellation
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    dialogTitle.value = 'Error';
    dialogMessage.value = 'Could not cancel your appointment. Please try again.';
    dialog.value = true;
  }
}

// Helper function to update the local UI after cancellation
function updateLocalScheduleAfterCancellation(day, time) {
  const doctor = doctorlist.doctors.find(d => d.id === doctorId.value);
  if (doctor) {
    const daySchedule = schedule.value[day];
    if (daySchedule) {
      const timeIndex = daySchedule.findIndex(t => 
        t.replace(' (Booked)', '').replace(' (Your booking)', '') === time
      );
      
      if (timeIndex !== -1) {
        schedule.value[day][timeIndex] = time;
        doctor.schedule[day][timeIndex] = time;
        
        userBookings.value = userBookings.value.filter(b => 
          !(b.day === day && b.time === time)
        );
        
        schedule.value = {...schedule.value};
      }
    }
  }
}

function debugBookings() {
  console.log('Current user ID:', currentUserId.value);
  console.log('All user bookings:', userBookings.value);
  
  // Get all appointments for debugging
  api.get(`/appointments/${doctorId}`).then(response => {
    console.log('All appointments:', response.data);
    
    // Check if any of them should match our user
    if (Array.isArray(response.data)) {
      response.data.forEach(appointment => {
        console.log(`Appointment for ${appointment.day} at ${appointment.time}, patient: ${appointment.patientId}`);
        console.log(`Does this match our user? ${appointment.patientId === currentUserId.value}`);
      });
    }
  }).catch(error => {
    console.error('Error fetching appointments for debug:', error);
  });

  // Check the DOM for disabled chips
  const chips = document.querySelectorAll('.v-chip');
  chips.forEach(chip => {
    console.log(chip.textContent.trim(), 'disabled:', chip.hasAttribute('disabled'));
  });
}

// At the end of your script, add this for testing when API isn't working
function mockCancelAppointment() {
  // Find the doctor and update schedule visually
  const doctor = doctorlist.doctors.find(d => d.id === doctorId);
  if (doctor) {
    const daySchedule = schedule.value[selectedDay.value];
    if (daySchedule) {
      const timeIndex = daySchedule.findIndex(time => 
        time.startsWith(selectedTime.value) && time.includes('(Booked)')
      );
      
      if (timeIndex !== -1) {
        // Update UI only
        schedule.value[selectedDay.value][timeIndex] = selectedTime.value;
        doctor.schedule[selectedDay.value][timeIndex] = selectedTime.value;
        
        // Remove from tracked bookings
        userBookings.value = userBookings.value.filter(b => 
          !(b.day === selectedDay.value && b.time === selectedTime.value)
        );
        
        // Show success with dialog instead of alert
        dialogTitle.value = 'Booking Cancelled';
        dialogMessage.value = `Your booking for ${selectedTime.value} has been cancelled.`;
        
        // Close the current dialog after a delay (to show the success message)
        setTimeout(() => {
          dialog.value = false;
        }, 2000);
      }
    }
  }
}

// Function to refresh the schedule
async function refreshSchedule() {
  try {
    // Fetch the updated schedule from the backend
    const response = await api.get(`/appointments/${doctorId}`);
    const updatedAppointments = response.data;
    
    // Update the local schedule with the new data
    updatedAppointments.forEach(appointment => {
      const daySchedule = schedule.value[appointment.day];
      if (daySchedule) {
        const timeIndex = daySchedule.findIndex(time => 
          time.replace(' (Booked)', '').replace(' (Your booking)', '') === appointment.time
        );
        
        if (timeIndex !== -1) {
          schedule.value[appointment.day][timeIndex] = `${appointment.time} (Booked)`;
        }
      }
    });
    
    console.log('Schedule refreshed successfully');
  } catch (error) {
    console.error('Error refreshing schedule:', error);
  }
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

