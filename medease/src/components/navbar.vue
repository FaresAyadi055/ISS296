<template>
  <v-app-bar
    app
    color="#6CAEED"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>
      MedEase
    </v-toolbar-title>
    <v-btn text>
      Home
    </v-btn>
    <v-btn text>
      Booking
    </v-btn>
    <v-btn text>
      Emergency Tracking
    </v-btn>
    <v-btn icon>
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
.v-img {
    max-height: 40px;
}
</style>