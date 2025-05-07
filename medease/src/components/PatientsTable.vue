<template>
  <v-card flat>
    <v-card-title>
      Patients Database
      <v-spacer></v-spacer>
      <v-btn color="primary" small dark @click="openDialog">
        <v-icon left>mdi-plus</v-icon>Add
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="patients"
      :search="search"
    >
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Add Patient' : 'Edit Patient' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.firstName" label="First Name" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.lastName" label="Last Name" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.gender" label="Gender" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.dob" label="Date of Birth" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.address" label="Address" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.phone" label="Phone" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.email" label="Email" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.chronic" label="Chronic Condition" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.medications" label="Medications" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.allergies" label="Allergies" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this patient?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDelete">Cancel</v-btn>
          <v-btn text color="red" @click="deleteItemConfirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import patientsData from '@/repos/patient.js';
import { patientService } from '@/services/PatientService.js';

const defaultItem = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  address: '',
  phone: '',
  email: '',
  chronic: '',
  medications: '',
  allergies: '',
};

export default {
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: Object.assign({}, defaultItem),
      deleteItem: null,
      headers: [
        { key: 'firstName', title: 'First Name', align: 'start', sortable: true },
        { key: 'lastName', title: 'Last Name' },
        { key: 'gender', title: 'Gender' },
        { key: 'dob', title: 'Date of Birth' },
        { key: 'address', title: 'Address' },
        { key: 'phone', title: 'Phone' },
        { key: 'email', title: 'Email' },
        { key: 'chronic', title: 'Chronic Condition' },
        { key: 'medications', title: 'Medications' },
        { key: 'allergies', title: 'Allergies' },
        { key: 'actions', title: 'Actions', sortable: false },
      ],
      patients: [],
    };
  },
  async created() {
    this.patients = (await patientService.getAllPatients()).map((patient) => ({
      ...patient,
      chronic: patient.healthConditions?.chronic || '',
      medications: patient.healthConditions?.medications || '',
      allergies: patient.healthConditions?.allergies || '',
    }));
  },
  methods: {
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, defaultItem);
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.patients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.patients[this.editedIndex], this.editedItem);
      } else {
        this.patients.push(Object.assign({}, this.editedItem));
      }
      this.closeDialog();
    },
    confirmDelete(item) {
      this.deleteItem = item;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    deleteItemConfirm() {
      const index = this.patients.indexOf(this.deleteItem);
      if (index > -1) this.patients.splice(index, 1);
      this.closeDelete();
    },
  },
};
</script>