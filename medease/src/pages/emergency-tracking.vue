<template> 
  <v-app style="background-color: white;">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Hospitals Map</h1>
        </v-col>
      </v-row>

      <leaflet-map :center="mapCenter" :zoom="mapZoom" :markers="mapMarkers" />
    </v-container>

    <Navbar />
    <Footer />
  </v-app>
</template>

<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
import LeafletMap from '@/components/LeafletMap.vue'
</script>

<script>
export default {
  name: 'App',
  components: {
    LeafletMap,
  },
  data() {
    return {
      mapCenter: [36.8065, 10.1815], // Initial map center (Tunis)
      mapZoom: 7, // Initial zoom level
      mapMarkers: [
        {
          lat: 36.80272,
          lng: 10.16074,
          popupText: 'Hello, this is Tunis!',
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Ensure the entire app background is white */
.v-application {
  background-color: white !important;
}
</style>
