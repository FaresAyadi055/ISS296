<template>
  <v-app-bar color="#579AFE" class="px-4">
    <v-app-bar-title class="text-white">
      <router-link to="/" class="text-decoration-none text-white">
        <v-icon icon="mdi-hospital-building" class="mr-2"></v-icon>
        MedEase
      </router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn
      v-if="!isLoggedIn"
      to="/login"
      class="text-white"
      variant="text"
    >
      Sign In
    </v-btn>

    <v-btn
      v-if="isLoggedIn"
      :to="`/doctor/patient/${currentPatientId}`"
      class="text-white"
      variant="text"
    >
      <v-icon icon="mdi-account" class="mr-2"></v-icon>
      Patient Profile
    </v-btn>

    <v-btn
      v-if="isLoggedIn"
      to="/doctor/prescription"
      class="text-white"
      variant="text"
    >
      <v-icon icon="mdi-pill" class="mr-2"></v-icon>
      E-Prescription
    </v-btn>

    <v-btn
      v-if="isLoggedIn"
      to="/doctor/schedule"
      class="text-white"
      variant="text"
    >
      <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
      Schedule
    </v-btn>

    <v-btn
      v-if="isLoggedIn"
      @click="logout"
      class="text-white"
      variant="text"
    >
      <v-icon icon="mdi-logout" class="mr-2"></v-icon>
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavbarDoctor',
  setup() {
    const router = useRouter()
    const isLoggedIn = ref(false)
    const currentPatientId = ref(null)

    const checkAuthStatus = () => {
      // Check if user is logged in (you can modify this based on your auth implementation)
      const user = JSON.parse(localStorage.getItem('user'))
      isLoggedIn.value = !!user
      if (user) {
        currentPatientId.value = user.id // Assuming user object has an id field
      }
    }

    const logout = () => {
      localStorage.removeItem('user')
      isLoggedIn.value = false
      currentPatientId.value = null
      router.push('/login')
    }

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isLoggedIn,
      currentPatientId,
      logout
    }
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
  