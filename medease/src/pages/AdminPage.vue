<template>
  <v-app style="background-color: #f5f6fa;">
    <AdminNavbar />
    <v-main>
      <v-container fluid class="pa-0" style="max-width: 100vw;">
        <v-row no-gutters>
          <v-col cols="12" md="2" class="pa-0">
            <v-navigation-drawer permanent app class="modern-sidebar" width="200">
              <v-list nav dense>
                <v-list-item :active="selectedTab === 'hospitals'" @click="selectedTab = 'hospitals'">
                  <v-list-item-icon>
                    <v-icon>mdi-hospital-building</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Hospitals</v-list-item-title>
                </v-list-item>
                <v-list-item :active="selectedTab === 'doctors'" @click="selectedTab = 'doctors'">
                  <v-list-item-icon>
                    <v-icon>mdi-stethoscope</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Doctors</v-list-item-title>
                </v-list-item>
                <v-list-item :active="selectedTab === 'patients'" @click="selectedTab = 'patients'">
                  <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Patients</v-list-item-title>
                </v-list-item>
                <v-list-item :active="selectedTab === 'medications'" @click="selectedTab = 'medications'">
                  <v-list-item-icon>
                    <v-icon>mdi-pill</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Medications</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>
          </v-col>
          <v-col cols="12" md="10" class="pa-0 pr-6">
            <v-row class="mb-6 mt-4" style="margin-top: 32px !important;">
              <v-col cols="12">
                <v-card class="pa-6 modern-header" elevation="0">
                  <v-row align="center">
                    <v-col cols="auto">
                      <v-avatar size="56" color="primary">
                        <v-icon size="36" color="white">mdi-view-dashboard</v-icon>
                      </v-avatar>
                    </v-col>
                    <v-col>
                      <h1 class="mb-1 font-weight-bold" style="font-size:2.2rem;">Admin Dashboard</h1>
                      <div class="text-grey-darken-1" style="font-size:1.1rem;">Welcome back, Admin! Manage doctors, hospitals, and patients efficiently.</div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-card elevation="4" class="pa-6 modern-card modern-card-shadow mb-10">
              <v-window v-model="selectedTab" class="fade-window">
                <v-window-item value="hospitals">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h2 class="table-title">Hospitals List</h2>
                    <v-btn color="primary" dark @click="showAddHospital = true">
                      <v-icon left>mdi-plus</v-icon>Add Hospital
                    </v-btn>
                  </div>
                  <div class="table-header-row sticky-header">
                    <div class="header-cell">Name</div>
                    <div class="header-cell">Type</div>
                    <div class="header-cell">Address</div>
                    <div class="header-cell">Phone</div>
                  </div>
                  <v-data-table :headers="hospitalHeaders" :items="hospitals" class="modern-table" dense>
                    <template #item.name="{ item }">
                      <span class="font-weight-bold">{{ item.name }}</span>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn icon color="red" @click="removeHospital(item)" style="width:28px;height:28px;min-width:28px;min-height:28px;">
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="showAddHospital" max-width="500">
                    <v-card>
                      <v-card-title>Add Hospital</v-card-title>
                      <v-card-text>
                        <v-form ref="hospitalForm" @submit.prevent="addHospital">
                          <v-text-field v-model="newHospital.name" label="Name" required></v-text-field>
                          <v-text-field v-model="newHospital.type" label="Type" required></v-text-field>
                          <v-text-field v-model="newHospital.address" label="Address" required></v-text-field>
                          <v-text-field v-model="newHospital.phone" label="Phone" required></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showAddHospital = false">Cancel</v-btn>
                        <v-btn color="primary" @click="addHospital">Add</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
                <v-window-item value="doctors">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h2 class="table-title">Doctors List</h2>
                    <v-btn color="primary" dark @click="showAddDoctor = true">
                      <v-icon left>mdi-plus</v-icon>Add Doctor
                    </v-btn>
                  </div>
                  <div class="table-header-row sticky-header">
                    <div class="header-cell">Name</div>
                    <div class="header-cell">Specialty</div>
                    <div class="header-cell">Email</div>
                    <div class="header-cell">Phone</div>
                    <div class="header-cell">Rating</div>
                  </div>
                  <v-data-table :headers="doctorHeaders" :items="doctors" class="modern-table" dense>
                    <template #item.firstName="{ item }">
                      <span class="font-weight-bold">{{ item.firstName }} {{ item.lastName }}</span>
                    </template>
                    <template #item.specialty="{ item }">
                      <v-chip color="primary" text-color="white" small>{{ item.specialty }}</v-chip>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn icon color="red" @click="removeDoctor(item)" style="width:28px;height:28px;min-width:28px;min-height:28px;">
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="showAddDoctor" max-width="600">
                    <v-card>
                      <v-card-title>Add Doctor</v-card-title>
                      <v-card-text>
                        <v-form ref="doctorForm" @submit.prevent="addDoctor">
                          <v-text-field v-model="newDoctor.firstName" label="First Name" required></v-text-field>
                          <v-text-field v-model="newDoctor.lastName" label="Last Name" required></v-text-field>
                          <v-text-field v-model="newDoctor.email" label="Email" required></v-text-field>
                          <v-text-field v-model="newDoctor.password" label="Password" type="password" required></v-text-field>
                          <v-text-field v-model="newDoctor.address" label="Address" required></v-text-field>
                          <v-text-field v-model="newDoctor.specialty" label="Specialty" required></v-text-field>
                          <v-text-field v-model="newDoctor.phoneNumber" label="Phone Number" required></v-text-field>
                          <v-text-field v-model="newDoctor.description" label="Description" required></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showAddDoctor = false">Cancel</v-btn>
                        <v-btn color="primary" @click="addDoctor">Add</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
                <v-window-item value="patients">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h2 class="table-title">Patients List</h2>
                    <v-btn color="primary" dark @click="showAddPatient = true">
                      <v-icon left>mdi-plus</v-icon>Add Patient
                    </v-btn>
                  </div>
                  <div class="table-header-row sticky-header">
                    <div class="header-cell">Name</div>
                    <div class="header-cell">Gender</div>
                    <div class="header-cell">DOB</div>
                    <div class="header-cell">Address</div>
                    <div class="header-cell">Phone</div>
                    <div class="header-cell">Email</div>
                    <div class="header-cell">Chronic</div>
                    <div class="header-cell">Medications</div>
                    <div class="header-cell">Allergies</div>
                  </div>
                  <v-data-table :headers="patientHeaders" :items="patients" class="modern-table" dense>
                    <template #item.firstName="{ item }">
                      <span class="font-weight-bold">{{ item.firstName }} {{ item.lastName }}</span>
                    </template>
                    <template #item.gender="{ item }">
                      <span>{{ item.gender }}</span>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn icon color="red" @click="removePatient(item)" style="width:28px;height:28px;min-width:28px;min-height:28px;">
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="showAddPatient" max-width="600">
                    <v-card>
                      <v-card-title>Add Patient</v-card-title>
                      <v-card-text>
                        <v-form ref="patientForm" @submit.prevent="addPatient">
                          <v-text-field v-model="newPatient.firstName" label="First Name" required></v-text-field>
                          <v-text-field v-model="newPatient.lastName" label="Last Name" required></v-text-field>
                          <v-text-field v-model="newPatient.email" label="Email" required></v-text-field>
                          <v-text-field v-model="newPatient.password" label="Password" type="password" required></v-text-field>
                          <v-text-field v-model="newPatient.address" label="Address" required></v-text-field>
                          <v-text-field v-model="newPatient.phone" label="Phone" required></v-text-field>
                          <v-text-field v-model="newPatient.dob" label="Date of Birth" required></v-text-field>
                          <v-text-field v-model="newPatient.gender" label="Gender" required></v-text-field>
                          <v-text-field v-model="newPatient.chronic" label="Chronic" ></v-text-field>
                          <v-text-field v-model="newPatient.medications" label="Medications" ></v-text-field>
                          <v-text-field v-model="newPatient.allergies" label="Allergies" ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showAddPatient = false">Cancel</v-btn>
                        <v-btn color="primary" @click="addPatient">Add</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
                <v-window-item value="medications">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h2 class="table-title">Medications List</h2>
                    <v-btn color="primary" dark @click="showAddMedication = true">
                      <v-icon left>mdi-plus</v-icon>Add Medication
                    </v-btn>
                  </div>
                  <div class="table-header-row sticky-header">
                    <div class="header-cell">Name</div>
                    <div class="header-cell">Category</div>
                    <div class="header-cell">Description</div>
                    <div class="header-cell">Price</div>
                    <div class="header-cell">Dosage</div>
                    <div class="header-cell">Side Effects</div>
                    <div class="header-cell">Image</div>
                    <div class="header-cell"></div>
                  </div>
                  <v-data-table :headers="medicationHeaders" :items="medications" class="modern-table" dense>
                    <template #item.image="{ item }">
                      <v-img :src="item.image" max-width="60" max-height="40" contain></v-img>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn icon color="red" @click="removeMedication(item)" style="width:28px;height:28px;min-width:28px;min-height:28px;">
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="showAddMedication" max-width="600">
                    <v-card>
                      <v-card-title>Add Medication</v-card-title>
                      <v-card-text>
                        <v-form ref="medicationForm" @submit.prevent="addMedication">
                          <v-text-field v-model="newMedication.name" label="Name" required></v-text-field>
                          <v-text-field v-model="newMedication.category" label="Category" required></v-text-field>
                          <v-text-field v-model="newMedication.description" label="Description" required></v-text-field>
                          <v-text-field v-model="newMedication.price" label="Price" type="number" required></v-text-field>
                          <v-text-field v-model="newMedication.dosage" label="Dosage" required></v-text-field>
                          <v-text-field v-model="newMedication.sideEffects" label="Side Effects"></v-text-field>
                          <v-text-field v-model="newMedication.image" label="Image URL"></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showAddMedication = false">Cancel</v-btn>
                        <v-btn color="primary" @click="addMedication">Add</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import Footer from '@/components/footer.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';
import axios from '@/plugins/axios';

export default {
  name: 'AdminPage',
  components: {
    Footer,
    AdminNavbar,
  },
  data() {
    return {
      selectedTab: 'hospitals',
      hospitals: [],
      doctors: [],
      patients: [],
      medications: [],
      hospitalHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Address', value: 'address' },
        { text: 'Phone', value: 'phone' },
        { text: '', value: 'actions', sortable: false },
      ],
      doctorHeaders: [
        { text: 'Name', value: 'firstName' },
        { text: 'Specialty', value: 'specialty' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phoneNumber' },
        { text: 'Rating', value: 'rating' },
        { text: '', value: 'actions', sortable: false },
      ],
      patientHeaders: [
        { text: 'Name', value: 'firstName' },
        { text: 'Gender', value: 'gender' },
        { text: 'DOB', value: 'dob' },
        { text: 'Address', value: 'address' },
        { text: 'Phone', value: 'phone' },
        { text: 'Email', value: 'email' },
        { text: 'Chronic', value: 'chronic' },
        { text: 'Medications', value: 'medications' },
        { text: 'Allergies', value: 'allergies' },
        { text: '', value: 'actions', sortable: false },
      ],
      medicationHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Dosage', value: 'dosage' },
        { text: 'Side Effects', value: 'sideEffects' },
        { text: 'Image', value: 'image' },
        { text: '', value: 'actions', sortable: false },
      ],
      showAddHospital: false,
      showAddDoctor: false,
      showAddPatient: false,
      showAddMedication: false,
      newHospital: { name: '', type: '', address: '', phone: '' },
      newDoctor: { firstName: '', lastName: '', email: '', password: '', address: '', specialty: '', phoneNumber: '', description: '' },
      newPatient: { firstName: '', lastName: '', email: '', password: '', address: '', phone: '', dob: '', gender: '', chronic: '', medications: '', allergies: '' },
      newMedication: { name: '', category: '', description: '', price: '', dosage: '', sideEffects: '', image: '' },
    };
  },
  mounted() {
    this.fetchHospitals();
    this.fetchDoctors();
    this.fetchPatients();
    this.fetchMedications();
  },
  methods: {
    async fetchHospitals() {
      try {
        const res = await axios.get('/hospitals');
        this.hospitals = Array.isArray(res.data) ? res.data : (res.data.hospitals || []);
      } catch (e) {
        this.hospitals = [];
      }
    },
    async fetchDoctors() {
      try {
        const res = await axios.get('/doctors');
        this.doctors = res.data;
      } catch (e) {
        this.doctors = [];
      }
    },
    async fetchPatients() {
      try {
        const res = await axios.get('/patients');
        this.patients = res.data.map(patient => ({
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          gender: patient.gender || '',
          dob: patient.dob ? new Date(patient.dob).toLocaleDateString() : '',
          address: patient.address || '',
          phone: patient.phone || '',
          email: patient.email || '',
          chronic: patient.healthConditions?.chronic || '',
          medications: patient.healthConditions?.medications || '',
          allergies: patient.healthConditions?.allergies || '',
        }));
      } catch (e) {
        this.patients = [];
      }
    },
    async fetchMedications() {
      try {
        const res = await axios.get('/medications');
        this.medications = res.data;
      } catch (e) {
        this.medications = [];
      }
    },
    async addHospital() {
      try {
        await axios.post('/hospitals', this.newHospital);
        this.showAddHospital = false;
        this.newHospital = { name: '', type: '', address: '', phone: '' };
        this.fetchHospitals();
      } catch (e) {
        alert('Failed to add hospital');
      }
    },
    async addDoctor() {
      try {
        await axios.post('/doctors/register', {
          ...this.newDoctor,
          workingHours: JSON.stringify({
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          }),
          rating: (Math.random() * (4.9 - 3.5) + 3.5).toFixed(1)
        });
        this.showAddDoctor = false;
        this.newDoctor = { firstName: '', lastName: '', email: '', password: '', address: '', specialty: '', phoneNumber: '', description: '' };
        this.fetchDoctors();
      } catch (e) {
        alert('Failed to add doctor');
      }
    },
    async addPatient() {
      try {
        await axios.post('/patients/register', {
          ...this.newPatient,
          healthConditions: {
            chronic: this.newPatient.chronic,
            medications: this.newPatient.medications,
            allergies: this.newPatient.allergies
          }
        });
        this.showAddPatient = false;
        this.newPatient = { firstName: '', lastName: '', email: '', password: '', address: '', phone: '', dob: '', gender: '', chronic: '', medications: '', allergies: '' };
        this.fetchPatients();
      } catch (e) {
        alert('Failed to add patient');
      }
    },
    async addMedication() {
      try {
        await axios.post('/medications', this.newMedication);
        this.showAddMedication = false;
        this.newMedication = { name: '', category: '', description: '', price: '', dosage: '', sideEffects: '', image: '' };
        this.fetchMedications();
      } catch (e) {
        alert('Failed to add medication');
      }
    },
    async removeHospital(item) {
      try {
        await axios.delete(`/hospitals/${item._id || item.id}`);
        this.fetchHospitals();
      } catch (e) {
        alert('Failed to remove hospital');
      }
    },
    async removeDoctor(item) {
      try {
        await axios.delete(`/doctors/${item._id}`);
        this.fetchDoctors();
      } catch (e) {
        alert('Failed to remove doctor');
      }
    },
    async removePatient(item) {
      try {
        await axios.delete(`/patients/${item._id}`);
        this.fetchPatients();
      } catch (e) {
        alert('Failed to remove patient');
      }
    },
    async removeMedication(item) {
      try {
        await axios.delete(`/medications/${item._id}`);
        this.fetchMedications();
      } catch (e) {
        alert('Failed to remove medication');
      }
    },
  },
};
</script>

<style scoped>
.v-application {
  background-color: #f5f6fa !important;
}
.modern-header {
  background: linear-gradient(90deg, #0a1930 0%, #185adb 100%);
  color: white;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(24,90,219,0.08);
}
.modern-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(24,90,219,0.08);
  background: #fff;
}
.modern-card-shadow {
  box-shadow: 0 4px 32px 0 rgba(24,90,219,0.10) !important;
}
.modern-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 8px 0 rgba(10,25,48,0.04);
  transition: box-shadow 0.2s;
  color: #000 !important;
}
.modern-table tbody tr:hover {
  background: #f0f4ff !important;
  box-shadow: 0 2px 12px 0 rgba(24,90,219,0.10);
}
.modern-table tbody tr {
  color: #000 !important;
}
.modern-table tbody td {
  color: #000 !important;
}
.v-data-table-header th {
  font-size: 1.05rem;
  font-weight: 600;
  color: #0a1930;
  background: #f5f6fa;
}
.v-data-table__wrapper {
  border-radius: 12px;
}
.modern-sidebar {
  background: #0a1930;
  color: #fff;
  border-radius: 0;
  min-height: 100vh;
  box-shadow: 2px 0 16px 0 rgba(24,90,219,0.08);
  margin-right: 0;
  padding-top: 32px;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.v-list-item {
  border-radius: 6px;
  margin: 6px 12px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  font-size: 1.08rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  box-shadow: none;
}
.v-list-item:hover {
  background: #185adb !important;
  color: #fff !important;
  box-shadow: 0 2px 8px 0 rgba(24,90,219,0.10);
}
.v-list-item--active {
  background: linear-gradient(90deg, #185adb 60%, #0a1930 100%) !important;
  color: #fff !important;
  font-weight: bold;
  box-shadow: 0 2px 12px 0 rgba(24,90,219,0.13);
}
.v-list-item-icon {
  margin-right: 12px;
}
.v-list-item-title {
  font-size: 1.08rem;
}
.table-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: #0a1930;
  letter-spacing: 0.5px;
}
.table-header-row {
  display: flex;
  align-items: center;
  background: #f5f8fc;
  color: #185adb;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px 8px 0 0;
  padding: 10px 0 10px 0;
  margin-bottom: -8px;
  margin-top: 8px;
  z-index: 2;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}
.table-header-row .header-cell {
  flex: 1;
  min-width: 100px;
  text-align: left;
  padding-left: 0;
}
.table-header-row .header-cell:first-child {
  min-width: 140px;
}
.fade-window {
  transition: opacity 0.3s;
}
</style>