<template>
  <v-app style="background-color: #F4F8FB;"></v-app>
  <Navbar />
  <!--<LocationPicker :apiKey="process.env.VUE_APP_MAPBOX_KEY" :height="'100vh'" :color="'#000000'" :initialLocation="[103.8198, 1.3521]"></LocationPicker>-->
  <sync-dialog></sync-dialog>
  <Footer />
</template>

<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
import SyncDialog from '@/components/SyncButton.vue'
/*import LocationPicker from '@/components/LocationPicker.vue'*/
</script>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
</style>
