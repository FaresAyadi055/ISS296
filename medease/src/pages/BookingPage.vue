<template>
  <v-container>
    <v-btn to="/" class="mb-3">Back</v-btn>
    <h1>Schedule for {{ doctorName }}</h1>
    
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn @click="prevWeek">Previous Week</v-btn>
        <h2>Week of {{ formattedWeek }}</h2>
        <v-btn @click="nextWeek">Next Week</v-btn>
      </v-col>
    </v-row>

    <v-table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Available Time Slots</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(times, day) in schedule" :key="day">
          <td>{{ day }}</td>
          <td>
            <v-chip v-for="(time, index) in times" :key="index" class="ma-1">{{ time }}</v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
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
  