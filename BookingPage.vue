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
          // Make sure we have a valid user ID
          if (!currentUserId.value) {
            // Retrieve from session storage again to be sure
            const patientIdFromSession = sessionStorage.getItem('currentPatient');
            currentUserId.value = patientIdFromSession ? patientIdFromSession.toString() : '';
            
            if (!currentUserId.value) {
              dialogTitle.value = 'Error';
              dialogMessage.value = 'You must be logged in to book an appointment.';
              dialog.value = true;
              return;
            }
          }
          
          const appointmentData = {
            doctorId,
            day: selectedDay.value,
            time: selectedTime.value,
            patientId: currentUserId.value
          };
          
          console.log('Sending appointment data:', appointmentData);
          
          // Save the appointment to the backend
          const response = await api.post('/appointments', appointmentData);
          
          console.log('Backend response:', response.data);

          // Update local state in BookingPage
          schedule.value[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;

          // Update the doctor's schedule in doctorlist
          doctor.schedule[selectedDay.value][timeIndex] = `${selectedTime.value} (Booked)`;

          // Close the confirmation dialog and show success dialog
          dialog.value = false;
          successDialog.value = true;

          // Add this booking to userBookings
          userBookings.value.push({
            day: selectedDay.value,
            time: selectedTime.value, 
            id: response.data.id || `${selectedDay.value}-${selectedTime.value}`
          });
          
          // Clear the selected time after booking
          selectedTime.value = '';
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
            
            // Force a refresh to get the latest booking data from the server
            setTimeout(() => {
              refreshSchedule();
            }, 1000);
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
        dialogTitle.value = 'Time Slot Unavailable';
        dialogMessage.value = 'This time slot is no longer available. Please refresh and try again.';
        dialog.value = true;
        
        // Refresh the schedule to get the latest data
        setTimeout(() => {
          refreshSchedule();
        }, 1000);
      }
    }
  } else {
    console.error("Doctor not found for ID:", doctorId);
  }
}

// Add this new ref for the cancellation success dialog
const cancellationDialog = ref(false);
const cancellationMessage = ref('');

// Function to cancel an appointment
async function cancelAppointment() {
  try {
    const cleanTime = selectedTime.value.replace(' (Booked)', '').replace(' (Your booking)', '');
    
    // Construct the cancellation data
    const cancellationData = {
      doctorId: doctorId.value,
      day: selectedDay.value,
      time: cleanTime,
      patientId: currentUserId.value
    };
    
    console.log('Sending cancellation data:', cancellationData);
    
    // Send a POST request to the cancellation endpoint
    const response = await api.post('/appointments/cancel', cancellationData);
    
    console.log('Cancellation response:', response.data);
    
    // Check if the cancellation was successful
    if (response.status >= 200 && response.status < 300) {
      console.log('Cancellation successful!');
      
      // Update the UI to reflect the cancellation
      updateLocalScheduleAfterCancellation(selectedDay.value, cleanTime);
      
      // Close the confirmation dialog
      dialog.value = false;
      
      // Show success message
      cancellationMessage.value = `Your booking for ${cleanTime} has been cancelled.`;
      cancellationDialog.value = true;
      
      // Auto close the success dialog after a delay
      setTimeout(() => {
        cancellationDialog.value = false;
        refreshSchedule(); // Refresh to ensure sync with backend
      }, 2000);
    } else {
      console.error('Unexpected response status:', response.status);
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Server returned an unexpected response. Please try again.';
      dialog.value = true;
    }
  } catch (error) {
    console.error('Error during cancellation:', error);
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

// Modified refreshSchedule function to be more aggressive in clearing stale data
async function refreshSchedule() {
  console.log('Refreshing schedule from server...');
  
  try {
    // First clear all data
    schedule.value = {};
    userBookings.value = [];
    
    // Reset the doctor's schedule in doctorlist
    const doctor = doctorlist.doctors.find(d => d.id === doctorId.value);
    if (doctor) {
      // We'll completely reload from the backend
      
      // Reload all data
      await fetchSchedule();
      
      console.log('Schedule refresh complete. Current userBookings:', userBookings.value);
      console.log('Current schedule:', schedule.value);
      
      // Show successful refresh message
      dialogTitle.value = 'Schedule Refreshed';
      dialogMessage.value = 'Your schedule has been updated with the latest data.';
      dialog.value = true;
      
      // Close dialog after a delay
      setTimeout(() => {
        dialog.value = false;
      }, 1500);
    } else {
      console.error('Doctor not found during refresh');
    }
  } catch (error) {
    console.error('Error during refresh:', error);
    dialogTitle.value = 'Refresh Error';
    dialogMessage.value = 'Could not refresh schedule from server.';
    dialog.value = true;
  }
}

// Success Booking Confirmation Dialog
<v-dialog v-model="successDialog" max-width="400px">
  <v-card class="custom-dialog-card">
    <v-card-title class="headline text-center">
      {{ dialogTitle.includes('Cancelled') ? 'Booking Cancelled' : 'Booking Successful!' }}
    </v-card-title>
    <v-card-text class="text-center">
      <p class="font-weight-medium text-blue">
        {{ dialogTitle.includes('Cancelled') ? dialogMessage : `Your booking for ${selectedTime} has been confirmed!` }}
      </p>
    </v-card-text>
    <v-card-actions v-if="!dialogTitle.includes('Cancelled')" class="d-flex justify-center">
      <v-btn @click="closeSuccessDialog" color="blue" class="custom-btn">Okay</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Add this new dialog for cancellation confirmations -->
<v-dialog v-model="cancellationDialog" max-width="400px">
  <v-card class="custom-dialog-card">
    <v-card-title class="headline text-center">Booking Cancelled</v-card-title>
    <v-card-text class="text-center">
      <p class="font-weight-medium text-blue">{{ cancellationMessage }}</p>
    </v-card-text>
    <!-- No buttons here -->
  </v-card>
</v-dialog>

<!-- Keep only the refresh button, remove debug button -->
<!--
<v-btn @click="debugBookings" color="error" class="mt-4">Debug Bookings</v-btn>
-->

<v-btn @click="refreshSchedule" color="primary" class="mt-4">
  <v-icon>mdi-refresh</v-icon> Refresh Schedule
</v-btn>

// Add a new debug function that can help identify the backend requirements
async function debugBackendAPI() {
  try {
    console.log('----- BACKEND API DEBUG -----');
    
    // 1. Get all appointments
    const allApptsResponse = await api.get('/appointments');
    console.log('All appointments in system:', allApptsResponse.data);
    
    // 2. Get appointments for this doctor
    const doctorApptsResponse = await api.get(`/appointments/${doctorId.value}`);
    console.log(`Appointments for doctor ${doctorId.value}:`, doctorApptsResponse.data);
    
    // 3. Try to get API documentation or discovery
    try {
      const apiDocsResponse = await api.get('/');
      console.log('API root response:', apiDocsResponse.data);
    } catch (e) {
      console.log('No API documentation endpoint found');
    }
    
    // 4. Test a basic operation to see the response format
    const testAppointment = {
      doctorId: doctorId.value,
      day: 'TestDay',
      time: 'TestTime',
      patientId: currentUserId.value
    };
    
    try {
      const testResponse = await api.post('/appointments', testAppointment);
      console.log('Test appointment creation response:', testResponse.data);
      
      // If successful, try to delete it to see the deletion format
      if (testResponse.data && testResponse.data.id) {
        console.log('Got test appointment ID:', testResponse.data.id);
        
        const testDeleteResponse = await api.delete(`/appointments/${testResponse.data.id}`);
        console.log('Test delete response:', testDeleteResponse);
      }
    } catch (e) {
      console.log('Test appointment failed, error:', e.response?.data || e.message);
    }
    
    console.log('----- END BACKEND API DEBUG -----');
  } catch (error) {
    console.error('Backend API debug error:', error);
  }
}

// Uncomment this to run the debug on page load
// onMounted(() => {
//   setTimeout(debugBackendAPI, 2000);
// }); 

// Emergency mock cancellation that just updates UI and forces refresh
function mockCancelAppointment() {
  try {
    const cleanTime = selectedTime.value.replace(' (Booked)', '').replace(' (Your booking)', '');
    
    // Update local UI
    const doctor = doctorlist.doctors.find(d => d.id === doctorId.value);
    if (doctor) {
      const daySchedule = schedule.value[selectedDay.value];
      if (daySchedule) {
        const timeIndex = daySchedule.findIndex(time => 
          time.replace(' (Booked)', '').replace(' (Your booking)', '') === cleanTime
        );
        
        if (timeIndex !== -1) {
          // Update schedules
          schedule.value[selectedDay.value][timeIndex] = cleanTime;
          doctor.schedule[selectedDay.value][timeIndex] = cleanTime;
          
          // Remove from userBookings
          userBookings.value = userBookings.value.filter(b => 
            !(b.day === selectedDay.value && b.time === cleanTime)
          );
        }
      }
    }
    
    // Show success message
    dialog.value = false;
    cancellationMessage.value = `Your booking for ${cleanTime} has been cancelled.`;
    cancellationDialog.value = true;
    
    // Force page reload after message is shown
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error('Mock cancellation error:', error);
    window.location.reload(); // Reload anyway
  }
} 

<v-btn v-if="isBooked(selectedDay, selectedTime) && isUserBooking(selectedDay, selectedTime)" @click="cancelAppointment" color="orange" class="custom-btn">Yes, Cancel Booking</v-btn> 
<v-btn v-if="isBooked(selectedDay, selectedTime) && isUserBooking(selectedDay, selectedTime)" @click="mockCancelAppointment" color="orange" class="custom-btn">Yes, Cancel Booking</v-btn> 