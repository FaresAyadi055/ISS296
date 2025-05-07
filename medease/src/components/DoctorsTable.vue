<template>
  <v-card elevation="2" class="pa-4">
    <v-card-title>
      Doctors Directory
      <v-spacer></v-spacer>
      <v-btn color="primary" small dark @click="openDialog">
        <v-icon left>mdi-plus</v-icon>Add
      </v-btn>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search by name or specialty"
        single-line
        hide-details
        dense
        style="max-width: 300px; margin-left: 16px"
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="filteredDoctors"
      :search="search"
      class="elevation-1"
      item-value="name"
      dense
    >
      <template #item.rating="{ item }">
        <v-rating
          :value="item.rating"
          dense
          color="amber"
          background-color="grey lighten-2"
          half-increments
          readonly
        />
      </template>
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="confirmDelete(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Edit/Create Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Add Doctor' : 'Edit Doctor' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.specialty" label="Specialty"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.phone" label="Phone"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.rating" label="Rating"></v-text-field>
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

    <!-- Delete Dialog -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this doctor?</v-card-text>
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
const defaultItem = { name: '', specialty: '', location: '', phone: '', email: '', rating: 0 };

export default {
  name: 'DoctorsTable',
  props: {
    doctors: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: Object.assign({}, defaultItem),
      deleteItem: null,
      headers: [
        { title: 'Name', key: 'name' },
        { title: 'Specialty', key: 'specialty' },
        { title: 'Location', key: 'location' },
        { title: 'Phone', key: 'phone' },
        { title: 'Email', key: 'email' },
        { title: 'Rating', key: 'rating' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    filteredDoctors() {
      return this.doctors;
    },
  },
  methods: {
    openDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, defaultItem);
      this.dialog = true;
    },
    editItem(item) {
      this.editedIndex = this.doctors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.doctors[this.editedIndex], this.editedItem);
      } else {
        this.doctors.push(Object.assign({}, this.editedItem));
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
      const index = this.doctors.indexOf(this.deleteItem);
      if (index > -1) this.doctors.splice(index, 1);
      this.closeDelete();
    },
  },
};
</script>

<style scoped>
.v-data-table {
  font-size: 14px;
}
</style>
