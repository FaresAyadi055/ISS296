<template>
    <v-app-bar app color="#0a1930" dark>
      <v-toolbar-title class="font-weight-bold mr-4" style="color: #D5DE58;">MedEase.</v-toolbar-title>
      
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/">Home</v-btn>
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/AdminPage">Dashboard</v-btn>
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/AdminStats">Statistics</v-btn>
      <v-spacer></v-spacer>
      
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: "AdminNavbar",
  };
  </script>
  
  <style scoped>
  </style>
