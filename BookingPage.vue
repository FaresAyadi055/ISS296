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
    const cleanSelectedTime = selectedTime.value.replace(' (Booked)', '').replace(' (Your booking)', '');
    console.log('CANCELLATION DEBUG - Selected day:', selectedDay.value);
    console.log('CANCELLATION DEBUG - Selected time (cleaned):', cleanSelectedTime);
    console.log('CANCELLATION DEBUG - Doctor ID:', doctorId);
    console.log('CANCELLATION DEBUG - Current user ID:', currentUserId.value);
    
    // Step 1: Fetch ALL appointments for this doctor
    console.log('CANCELLATION DEBUG - Fetching all appointments...');
    const allAppointmentsResponse = await api.get(`/appointments/${doctorId}`);
    console.log('CANCELLATION DEBUG - All appointments response:', allAppointmentsResponse.data);
    
    if (!Array.isArray(allAppointmentsResponse.data)) {
      console.error('CANCELLATION DEBUG - Invalid response format, expected array');
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Invalid response from server. Please try again.';
      dialog.value = true;
      return;
    }
    
    // Step 2: Find the EXACT appointment we want to cancel
    const appointmentToCancel = allAppointmentsResponse.data.find(app => {
      const timeMatches = app.time === cleanSelectedTime;
      const dayMatches = app.day === selectedDay.value;
      const patientMatches = String(app.patientId) === String(currentUserId.value);
      
      console.log(`CANCELLATION DEBUG - Comparing appointment: day=${app.day}, time=${app.time}, patient=${app.patientId}`);
      console.log(`CANCELLATION DEBUG - Matches: day=${dayMatches}, time=${timeMatches}, patient=${patientMatches}`);
      
      return timeMatches && dayMatches && patientMatches;
    });
    
    console.log('CANCELLATION DEBUG - Found appointment to cancel:', appointmentToCancel);
    
    if (!appointmentToCancel) {
      console.error('CANCELLATION DEBUG - No matching appointment found!');
      
      // Show all appointments that somewhat match for debugging
      console.log('CANCELLATION DEBUG - Partial matches:');
      allAppointmentsResponse.data.forEach(app => {
        if (app.day === selectedDay.value || app.time === cleanSelectedTime) {
          console.log(`Partial match: day=${app.day}, time=${app.time}, patient=${app.patientId}`);
        }
      });
      
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Could not find your appointment in the system.';
      dialog.value = true;
      return;
    }
    
    if (!appointmentToCancel.id) {
      console.error('CANCELLATION DEBUG - Appointment has no ID!');
      dialogTitle.value = 'Error';
      dialogMessage.value = 'Appointment has no ID. Cannot proceed with cancellation.';
      dialog.value = true;
      return;
    }
    
    // Step 3: Delete the appointment with the exact ID
    console.log(`CANCELLATION DEBUG - Deleting appointment with ID: ${appointmentToCancel.id}`);
    try {
      const deleteResponse = await api.delete(`/appointments/${appointmentToCancel.id}`);
      console.log('CANCELLATION DEBUG - Delete response:', deleteResponse);
      
      if (deleteResponse.status >= 200 && deleteResponse.status < 300) {
        console.log('CANCELLATION DEBUG - Delete successful!');
        
        // Update UI
        dialog.value = false;
        updateUIAfterCancellation(appointmentToCancel);
        
        // Show cancellation dialog
        cancellationMessage.value = `Your booking for ${cleanSelectedTime} has been cancelled.`;
        cancellationDialog.value = true;
        
        // Close cancellation dialog and refresh after delay
        setTimeout(() => {
          cancellationDialog.value = false;
          refreshSchedule();
        }, 2000);
      } else {
        console.error('CANCELLATION DEBUG - Delete request failed with status:', deleteResponse.status);
        dialogTitle.value = 'Error';
        dialogMessage.value = `Server returned status ${deleteResponse.status}. Please try again.`;
        dialog.value = true;
      }
    } catch (deleteError) {
      console.error('CANCELLATION DEBUG - Delete request failed with error:', deleteError);
      console.error('CANCELLATION DEBUG - Error response:', deleteError.response?.data);
      
      dialogTitle.value = 'Error';
      dialogMessage.value = `Delete request failed: ${deleteError.response?.data?.message || deleteError.message}`;
      dialog.value = true;
    }
  } catch (error) {
    console.error('CANCELLATION DEBUG - Overall error:', error);
    dialogTitle.value = 'Error';
    dialogMessage.value = `An error occurred: ${error.message}`;
    dialog.value = true;
  }
  
  // Helper function to update UI after cancellation
  function updateUIAfterCancellation(appointment) {
    console.log('CANCELLATION DEBUG - Updating UI for cancelled appointment:', appointment);
    
    const doctor = doctorlist.doctors.find(d => d.id === doctorId);
    if (doctor) {
      const daySchedule = schedule.value[appointment.day];
      if (daySchedule) {
        // Find the slot with this time that's marked as booked
        const timeIndex = daySchedule.findIndex(time => {
          const slotClean = time.replace(' (Booked)', '').replace(' (Your booking)', '');
          return slotClean === appointment.time;
        });
        
        console.log(`CANCELLATION DEBUG - Found time index: ${timeIndex}`);
        
        if (timeIndex !== -1) {
          // Reset to original time format
          schedule.value[appointment.day][timeIndex] = appointment.time;
          doctor.schedule[appointment.day][timeIndex] = appointment.time;
          
          // Remove from userBookings
          userBookings.value = userBookings.value.filter(b => 
            !(b.day === appointment.day && b.time === appointment.time)
          );
          
          // Force reactive update
          schedule.value = {...schedule.value};
        }
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
    const doctor = doctorlist.doctors.find(d => d.id === doctorId);
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