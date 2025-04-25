<template>
    <v-app style="background-color: white;">
      <!-- Top Navbar -->
      <AdminNavbar />
  
      <!-- Main layout with drawer and doctors table -->
      <v-main app>
        <v-container fluid>
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
  
          <!-- Doctors Table Display -->
          <DoctorsTable />
        </v-container>
  
        <!-- Footer -->
        <Footer />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import Footer from '@/components/footer.vue';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import DoctorsTable from '@/components/DoctorsTable.vue';
  import doctorsData from '@/repos/doctors.json';
  import patientsData from '@/repos/patient.json';
  import hospitalsData from '@/repos/hospitals.json';
  
  export default {
    name: 'DoctorsPage',
    components: {
      Footer,
      AdminNavbar,
      DoctorsTable,
    },
    data() {
      return {
        drawer: true,
        items: [
          {
            title: 'Hospitals',
            icon: 'mdi-hospital-building',
            route: '/AdminPage',
            count: hospitalsData.hospitals?.length || 0,
          },
          {
            title: 'Doctors',
            icon: 'mdi-doctor',
            route: '/doctors',
            count: doctorsData.doctors?.length || 0,
          },
          {
            title: 'Patients',
            icon: 'mdi-account-group',
            route: '/patients',
            count: patientsData.patients?.length || 0,
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
  