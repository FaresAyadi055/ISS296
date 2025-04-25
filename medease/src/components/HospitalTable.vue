<template>
  <v-card flat>
    <v-card-title>
      Hospitals Database
      <v-spacer></v-spacer>
      <v-btn color="primary" dark small @click="openDialog">
        <v-icon left>mdi-plus</v-icon>
        Add
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
      :items="hospitals"
      :search="search"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Edit/Create Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Add Hospital' : 'Edit Hospital' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="Hospital Name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.type" label="Type"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.latitude" label="Latitude"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.longitude" label="Longitude"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this hospital?</v-card-text>
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
import hospitalsData from '@/repos/hospitals.json';

const defaultItem = { name: '', type: '', address: '', phone: '', latitude: '', longitude: '' };

export default {
  data() {
    return {
      drawer: true,
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: Object.assign({}, defaultItem),
      deleteItem: null,
      headers: [
        { key: 'name', title: 'Hospital Name', align: 'start', sortable: true },
        { key: 'type', title: 'Type', sortable: true },
        { key: 'address', title: 'Address', sortable: true },
        { key: 'phone', title: 'Phone', sortable: true },
        { key: 'latitude', title: 'Latitude', sortable: true },
        { key: 'longitude', title: 'Longitude', sortable: true },
        { key: 'actions', title: 'Actions', sortable: false },
      ],
      hospitals: hospitalsData.hospitals.map(hospital => ({
        name: hospital.name,
        type: hospital.type,
        address: hospital.address,
        phone: hospital.phone,
        latitude: hospital.latitude.toString(),
        longitude: hospital.longitude.toString()
      })),
      items: [],
    };
  },
  methods: {
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, defaultItem);
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.hospitals.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.hospitals[this.editedIndex], this.editedItem);
      } else {
        this.hospitals.push(Object.assign({}, this.editedItem));
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
      const index = this.hospitals.indexOf(this.deleteItem);
      if (index > -1) this.hospitals.splice(index, 1);
      this.closeDelete();
    },
  },
};
</script>

<style scoped>
/* Ensure the entire app background is white */
</style>
