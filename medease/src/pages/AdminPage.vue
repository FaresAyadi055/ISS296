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
    <HospitalTable />  </router-view>
      </v-container>
      
      <!-- Footer at the bottom -->
        <Footer />  
    </v-main>

    
  </v-app>
</template>

<script>
import Footer from '@/components/footer.vue' // Note: Changed to PascalCase
import hospitalsData from '@/repos/hospitals.json';
import HospitalTable from '@/components/HospitalTable.vue'
import doctorsData from '@/repos/doctors.json';
import patientsData from '@/repos/patient.json';
import AdminNavbar from '@/components/AdminNavbar.vue'

  
export default {
  name: 'App',
  components: {
    Footer,
    AdminNavbar,
    HospitalTable,
    //SyncDialog,
  },

  data() {
    this.hospitals = hospitalsData.hospitals;
    this.items = [
      {
        title: 'Hospitals',
        icon: 'mdi-hospital-building',
        route: '/AdminPage',
        count: this.hospitals.length,
      },
      {
        title: 'Doctors',
        icon: 'mdi-doctor',
        route: '/doctors',
        count: doctorsData.length,
      },
      {
        title: 'Patients',
        icon: 'mdi-account-group',
        route: '/patients',
        count: patientsData.length,
      },
    ];
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