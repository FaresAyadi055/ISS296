<template>
  <v-app style="background-color: white;">
    <!-- Admin Navbar at the top -->
    <AdminNavbar />
    
    <!-- Sync Dialog Component -->
    <sync-dialog></sync-dialog>
    
    <!-- Main Application Layout -->
    <v-main app>
      <v-container fluid>
        <router-view  >
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      color="#0a1930"
      dark
      width="250"
    >
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 font-weight-bold" style="color: #D5DE58;">
              Dashboard
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.route"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="item.count !== undefined">
            <v-chip small>{{ item.count }}</v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <HospitalTable :hospitals="hospitals" />
    <PatientsTable :patients="patients" />
    </router-view>
      </v-container>
      
      <!-- Footer at the bottom -->
        <Footer />  
    </v-main>

    
  </v-app>
</template>

<script>
import Footer from '@/components/footer.vue'
import HospitalTable from '@/components/HospitalTable.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import PatientsTable from '@/components/PatientsTable.vue'
import axios from '@/plugins/axios'

export default {
  name: 'App',
  components: {
    Footer,
    AdminNavbar,
    HospitalTable,
    PatientsTable,
    //SyncDialog,
  },
  data() {
    return {
      drawer: true,
      hospitals: [],
      doctors: [],
      patients: [],
      items: [
        {
          title: 'Hospitals',
          icon: 'mdi-hospital-building',
          route: '/AdminPage',
          count: 0,
        },
        {
          title: 'Doctors',
          icon: 'mdi-doctor',
          route: '/doctors',
          count: 0,
        },
        {
          title: 'Patients',
          icon: 'mdi-account-group',
          route: '/patients',
          count: 0,
        },
      ],
    };
  },
  mounted() {
    this.fetchHospitals();
    this.fetchDoctors();
    this.fetchPatients();
  },
  methods: {
    async fetchHospitals() {
      try {
        const res = await axios.get('/hospitals');
        this.hospitals = Array.isArray(res.data) ? res.data : (res.data.hospitals || []);
        this.items[0].count = this.hospitals.length;
      } catch (e) {
        console.error('Failed to fetch hospitals', e);
      }
    },
    async fetchDoctors() {
      try {
        const res = await axios.get('/doctors');
        this.doctors = res.data;
        this.items[1].count = this.doctors.length;
      } catch (e) {
        console.error('Failed to fetch doctors', e);
      }
    },
    async fetchPatients() {
      try {
        const res = await axios.get('/patients');
        this.patients = res.data.map(patient => ({
          ...patient,
          chronic: patient.healthConditions?.chronic || '',
          medications: patient.healthConditions?.medications || '',
          allergies: patient.healthConditions?.allergies || '',
        }));
        this.items[2].count = this.patients.length;
      } catch (e) {
        console.error('Failed to fetch patients', e);
      }
    },
  },
};
</script>

<style scoped>
/* Ensure the entire app background is white */
.v-application {
  background-color: white !important;
}

/* Optional: Add some padding to prevent footer from overlapping content */
.v-main {
  padding-bottom: 64px; /* Adjust based on your footer height */
}
</style>