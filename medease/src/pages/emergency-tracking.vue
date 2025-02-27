<template>
  <v-app style="background-color: #F4F8FB;"></v-app>
  <Navbar />
  
  <Footer />
</template>

<script setup>
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'
</script>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
</style>
