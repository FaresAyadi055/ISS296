<template>
    <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Hospitals map</h1>
      </v-col>
    </v-row>


    <leaflet-map :center="mapCenter" :zoom="mapZoom" :markers="mapMarkers" />
  </v-container>
  <v-app style="background-color: #F4F8FB;"></v-app>

  <Navbar />
  <sync-dialog></sync-dialog>
  <Footer />
</template>

<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
import SyncDialog from '@/components/SyncButton.vue'

</script>

<script>
export default {

  name: 'App',
  components: {
    LeafletMap,
  },
  data() {
    return {
      mapCenter: [36.80272, 10.16074], // Initial map center (Tunis)
      mapZoom: 15, // Initial zoom level
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
</style>
