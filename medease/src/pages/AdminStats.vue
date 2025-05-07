<template>
  <v-app style="background-color: #f8fafc;">
    <AdminNavbar />
    <v-main>
      <v-container>
        <h1 class="text-h3 font-weight-bold mb-8 text-center" style="color: #1e3a8a;">Admin Statistics Dashboard</h1>
        <v-row class="mb-8" justify="center">
          <v-col cols="12" md="4">
            <v-card class="pa-6 stat-card" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Total Doctors</div>
              <div class="text-h2 font-weight-black stat-number">{{ stats.doctors }}</div>
              <div class="text-caption mt-2" style="color:#64748b;">Active this month: <span class="font-weight-bold">{{ stats.activeDoctors }}</span></div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 stat-card" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Total Patients</div>
              <div class="text-h2 font-weight-black stat-number">{{ stats.patients }}</div>
              <div class="text-caption mt-2" style="color:#64748b;">New this month: <span class="font-weight-bold">{{ stats.newPatients }}</span></div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 stat-card" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Total Hospitals</div>
              <div class="text-h2 font-weight-black stat-number">{{ stats.hospitals }}</div>
              <div class="text-caption mt-2" style="color:#64748b;">Types: <span class="font-weight-bold">{{ Object.keys(stats.hospitalsByType).length }}</span></div>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mb-8" justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Doctors by Specialty</div>
              <v-list dense class="stat-list-bg">
                <v-list-item v-for="(count, specialty) in stats.doctorsBySpecialty" :key="specialty">
                  <v-list-item-title class="stat-list">{{ specialty }}: <span class="font-weight-bold">{{ count }}</span></v-list-item-title>
                </v-list-item>
              </v-list>
              <canvas id="doctors-specialty-chart" height="180"></canvas>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Patients by Gender</div>
              <v-list dense class="stat-list-bg">
                <v-list-item v-for="(count, gender) in stats.patientsByGender" :key="gender">
                  <v-list-item-title class="stat-list">{{ gender }}: <span class="font-weight-bold">{{ count }}</span></v-list-item-title>
                </v-list-item>
              </v-list>
              <canvas id="patients-gender-chart" height="180"></canvas>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Hospitals by Type</div>
              <v-list dense class="stat-list-bg">
                <v-list-item v-for="(count, type) in stats.hospitalsByType" :key="type">
                  <v-list-item-title class="stat-list">{{ type }}: <span class="font-weight-bold">{{ count }}</span></v-list-item-title>
                </v-list-item>
              </v-list>
              <canvas id="hospitals-type-chart" height="180"></canvas>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Appointments per Month (Last 6 Months)</div>
              <canvas id="appointments-monthly-chart" height="180"></canvas>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Average Doctor Rating by Specialty</div>
              <canvas id="doctor-rating-specialty-chart" height="180"></canvas>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Patient Registrations by City</div>
              <canvas id="patients-city-chart" height="180"></canvas>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6 stat-card stat-card-white" elevation="4">
              <div class="text-h5 font-weight-bold mb-2 stat-title">Hospital Distribution by Region</div>
              <canvas id="hospitals-region-chart" height="180"></canvas>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import AdminNavbar from '@/components/AdminNavbar.vue';
import Chart from 'chart.js/auto';

const stats = ref({
  doctors: 0,
  patients: 0,
  hospitals: 0,
  doctorsBySpecialty: {},
  patientsByGender: {},
  hospitalsByType: {},
  activeDoctors: 0,
  newPatients: 0,
  patientsMonthly: [],
  appointmentsMonthly: [],
  doctorRatingBySpecialty: {},
  patientsByCity: {},
  hospitalsByRegion: {}
});

onMounted(async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const [doctorsRes, patientsRes, hospitalsRes] = await Promise.all([
    axios.get(`${apiUrl}/api/doctors`),
    axios.get(`${apiUrl}/api/patients`),
    axios.get(`${apiUrl}/api/hospitals`)
  ]);

  // Doctors
  stats.value.doctors = doctorsRes.data.length;
  stats.value.doctorsBySpecialty = doctorsRes.data.reduce((acc, doc) => {
    acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
    return acc;
  }, {});
  // Simulate active doctors (random for demo)
  stats.value.activeDoctors = Math.floor(stats.value.doctors * 0.7);

  // Average doctor rating by specialty
  const specialtyRatings = {};
  doctorsRes.data.forEach(doc => {
    if (!specialtyRatings[doc.specialty]) specialtyRatings[doc.specialty] = [];
    if (doc.rating) specialtyRatings[doc.specialty].push(Number(doc.rating));
  });
  stats.value.doctorRatingBySpecialty = Object.fromEntries(
    Object.entries(specialtyRatings).map(([spec, arr]) => [spec, arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0])
  );

  // Patients
  stats.value.patients = patientsRes.data.length;
  stats.value.patientsByGender = patientsRes.data.reduce((acc, pat) => {
    const gender = pat.gender || 'Other';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  // Simulate new patients this month (random for demo)
  stats.value.newPatients = Math.floor(stats.value.patients * 0.12);

  // Patient registrations by city
  stats.value.patientsByCity = patientsRes.data.reduce((acc, pat) => {
    const city = (pat.address && pat.address.split(',')[0]) || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Hospitals
  stats.value.hospitals = hospitalsRes.data.length;
  stats.value.hospitalsByType = hospitalsRes.data.reduce((acc, hosp) => {
    acc[hosp.type] = (acc[hosp.type] || 0) + 1;
    return acc;
  }, {});

  // Hospital distribution by region
  stats.value.hospitalsByRegion = hospitalsRes.data.reduce((acc, hosp) => {
    const region = (hosp.address && hosp.address.split(',')[0]) || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  // Monthly new patients (simulate for demo)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  stats.value.patientsMonthly = months.map((m, i) => ({
    month: m,
    count: Math.floor(stats.value.patients * (0.05 + 0.01 * i))
  }));

  // Appointments per month (simulate for demo)
  stats.value.appointmentsMonthly = months.map((m, i) => ({
    month: m,
    count: Math.floor(50 + Math.random() * 50)
  }));

  await nextTick();
  // Draw charts
  new Chart(document.getElementById('doctors-specialty-chart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(stats.value.doctorsBySpecialty),
      datasets: [{
        data: Object.values(stats.value.doctorsBySpecialty),
        backgroundColor: ['#579AFE', '#1e3a8a', '#D5DE58', '#0ea5e9', '#64748b', '#f8fafc']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
  new Chart(document.getElementById('patients-gender-chart'), {
    type: 'pie',
    data: {
      labels: Object.keys(stats.value.patientsByGender),
      datasets: [{
        data: Object.values(stats.value.patientsByGender),
        backgroundColor: ['#579AFE', '#D5DE58', '#1e3a8a', '#64748b']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
  new Chart(document.getElementById('hospitals-type-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(stats.value.hospitalsByType),
      datasets: [{
        label: 'Hospitals',
        data: Object.values(stats.value.hospitalsByType),
        backgroundColor: '#579AFE'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
  });
  new Chart(document.getElementById('appointments-monthly-chart'), {
    type: 'bar',
    data: {
      labels: stats.value.appointmentsMonthly.map(x => x.month),
      datasets: [{
        label: 'Appointments',
        data: stats.value.appointmentsMonthly.map(x => x.count),
        backgroundColor: '#0ea5e9'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }
  });
  new Chart(document.getElementById('doctor-rating-specialty-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(stats.value.doctorRatingBySpecialty),
      datasets: [{
        label: 'Avg. Rating',
        data: Object.values(stats.value.doctorRatingBySpecialty),
        backgroundColor: '#D5DE58'
      }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 5 } } }
  });
  new Chart(document.getElementById('patients-city-chart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(stats.value.patientsByCity),
      datasets: [{
        data: Object.values(stats.value.patientsByCity),
        backgroundColor: ['#579AFE', '#1e3a8a', '#D5DE58', '#0ea5e9', '#64748b', '#f8fafc']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
  new Chart(document.getElementById('hospitals-region-chart'), {
    type: 'pie',
    data: {
      labels: Object.keys(stats.value.hospitalsByRegion),
      datasets: [{
        data: Object.values(stats.value.hospitalsByRegion),
        backgroundColor: ['#579AFE', '#D5DE58', '#1e3a8a', '#64748b', '#0ea5e9', '#f8fafc']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
});
</script>

<style scoped>
.stat-card {
  border-radius: 18px;
  background: #fff;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 12px rgba(30,58,138,0.07);
}
.stat-card-white {
  background: #fff !important;
}
.stat-card:hover {
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.12);
}
.stat-title {
  color: #1e3a8a;
}
.stat-number {
  color: #579AFE;
}
.stat-list {
  color: #1e3a8a !important;
  font-size: 1.1rem;
  font-weight: 500;
}
.stat-list-bg {
  background: #fff !important;
  border-radius: 10px;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: 1rem;
}
.v-card {
  transition: box-shadow 0.2s, transform 0.2s;
}
.v-card:hover {
  transform: translateY(-2px) scale(1.01);
}
.v-list-item {
  border-bottom: 1px solid #f0f0f0;
}
.v-list-item:last-child {
  border-bottom: none;
}
</style>
