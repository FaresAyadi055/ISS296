<template>
  <v-app-bar
    app
    color="#6CAEED"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" style="margin-right: 40px;">
      <v-icon>
      <img src="@/assets/menu.png" alt="Menu Icon" style="width: 24px; height: 24px;">
      </v-icon>
    </v-app-bar-nav-icon>
    <v-icon>
      <img src="@/assets/logo.png" alt="MedEase Logo" style="width: 50px; height: 50px;">
    </v-icon>
    <v-btn text href="/" style="margin-left: 50px;">
      Home
    </v-btn>
    <v-btn text href="/EmergencyTracking">
      Emergency Tracking
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn text href="/booking">
      Booking
      <v-icon>
      <img src="@/assets/booking.png" alt="Booking Icon" style="width: 20px; height: 20px; margin-left: 10px;">
      </v-icon>
    </v-btn>
    <v-btn icon href="/profile">
      <v-avatar
      image="@/assets/profile.png"
      size="30"
      />
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';

const drawer = ref(false);
</script>

<style scoped>
.v-application {
    background-color: white;
  }
.v-img {
    max-height: 40px;
}
</style>