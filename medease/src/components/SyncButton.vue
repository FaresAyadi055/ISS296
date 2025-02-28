
<template>
    <div>

      <v-btn color="primary" @click="openSyncDialog">
        Sync to Smart Watch
      </v-btn>
      <v-dialog v-model="isDialogOpen" max-width="400">
        <v-card>
          <v-card-title class="headline">Sync Code</v-card-title>
          <v-card-text>
            <p>Your sync code :</p>
            <h2 class="text-center">{{ syncCode }}</h2>
            <p class="text-caption text-center">Enter this one time code on your smart watch app to sync.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeSyncDialog">Done</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SyncDialog',
    data() {
      return {
        isDialogOpen: false,
        syncCode: '',
      };
    },
    methods: {
      openSyncDialog() {
        this.generateSyncCode();
        this.isDialogOpen = true;
      },
      closeSyncDialog() {
        this.isDialogOpen = false;
      },
      generateSyncCode() {
        const code = Math.floor(100000 + Math.random() * 900000);
        this.syncCode = code.toString();
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
