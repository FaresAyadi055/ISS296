<template>
  <v-app style="background-color: white;">
    <!-- Admin Navbar -->
    <AdminNavbar />

    <!-- Sync Dialog -->
    <sync-dialog></sync-dialog>

    <!-- Layout -->
    <v-main app>
      <v-container fluid>
        <router-view>
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

          <!-- Patients Table -->
          <PatientsTable />
        </router-view>
      </v-container>

      <!-- Footer -->
      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import Footer from '@/components/footer.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import PatientsTable from '@/components/PatientsTable.vue'
import hospitalsData from '@/repos/hospitals.json'
import doctorsData from '@/repos/doctors.json'
import patientsData from '@/repos/patient.json'

export default {
  name: 'App',
  components: {
    Footer,
    AdminNavbar,
    PatientsTable,
  },
  data() {
    const hospitals = hospitalsData.hospitals;
    const doctors = doctorsData;
    const patients = patientsData.patients;

    return {
      drawer: true,
      hospitals,
      doctors,
      patients,
      items: [
        {
          title: 'Hospitals',
          icon: 'mdi-hospital-building',
          route: '/AdminPage',
          count: hospitals.length,
        },
        {
          title: 'Doctors',
          icon: 'mdi-doctor',
          route: '/doctors',
          count: doctors.length,
        },
        {
          title: 'Patients',
          icon: 'mdi-account-group',
          route: '/patients',
          count: patients.length,
        },
      ],
    };
  },
};
</script>

<style scoped>
.v-application {
  background-color: white !important;
}
.v-main {
  padding-bottom: 64px;
}
</style>
