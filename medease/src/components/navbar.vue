<template>
  <v-app-bar app color="#0a1930" dark>
    <v-toolbar-title class="font-weight-bold mr-4" style="color: #D5DE58;">MedEase.</v-toolbar-title>
    
    <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/">Home</v-btn>
    <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/emergency-tracking">Emergency Tracking</v-btn>
    <v-btn class="mx-2" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/booking">Booking</v-btn>
    
    <v-spacer></v-spacer>
    
    <v-btn class="mx-2" color="#579AFE" rounded style="background-color: #579AFE; color: #FFFFFF;" to="/signin">Sign In</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>

</style>
