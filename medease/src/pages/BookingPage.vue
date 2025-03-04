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
              >
                {{ time }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const doctorName = route.params.doctorName;
const currentWeek = ref(new Date());
const schedule = ref(generateWeeklySchedule());

const formattedWeek = computed(() => {
  return currentWeek.value.toISOString().split("T")[0];
});

function generateWeeklySchedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];
  let schedule = {};

  days.forEach(day => {
    schedule[day] = hours.slice(0, Math.floor(Math.random() * hours.length) + 1);
  });

  return schedule;
}

function nextWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() + 7);
  schedule.value = generateWeeklySchedule();
}

function prevWeek() {
  currentWeek.value.setDate(currentWeek.value.getDate() - 7);
  schedule.value = generateWeeklySchedule();
}
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
</style>
