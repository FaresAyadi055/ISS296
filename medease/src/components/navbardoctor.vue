<template>
    <v-app-bar app color="#0a1930" dark>
      <v-toolbar-title class="font-weight-bold mr-4" style="color: #D5DE58;">MedEase.</v-toolbar-title>
      
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/">Home</v-btn>
      <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/doctorSchedule">Scheduele</v-btn>
      
      <v-spacer></v-spacer>
      
    <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/profile">
      <v-icon>
        <img src="@/assets/profile.png" alt="Profile" style="width: 24px; height: 24px;">
      </v-icon>
    </v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: "NavBar",
  };
  </script>
  
  <style scoped>
  
  </style>
  