/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Import components for manual routes

import BookingPage from "@/pages/BookingPage.vue";
import Booking from '@/pages/booking.vue';
import EPrescription from '@/components/EPrescription.vue'
import PatientProfile from '@/components/PatientProfile.vue'
import Pharmacy from '@/pages/Pharmacy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts([
    ...routes, // Keep auto-generated routes
    { path: "/", component: Booking },
    {
      path: "/BookingPage/:doctorId",  // Updated path to match the navigation
      component: BookingPage,  // Component you want to display
    },
    {
      path: '/pharmacy',
      name: 'Pharmacy',
      component: Pharmacy,
      meta: { requiresAuth: true }
    },
    {
      path: '/doctor/prescription',
      name: 'EPrescription',
      component: EPrescription,
      meta: { requiresAuth: true, role: 'doctor' }
    },
    {
      path: '/profile/:id',
      name: 'PatientProfile',
      component: () => import('@/pages/patientProfile.vue'),
      meta: {
        requiresAuth: true,
        role: 'patient'
      }
    },
    {
      path: '/patientProfile',
      name: 'PatientProfileDirect',
      component: () => import('@/pages/patientProfile.vue'),
      meta: {
        requiresAuth: true,
        role: 'patient'
      },
      beforeEnter: (to, from, next) => {
        const patient = localStorage.getItem('patient');
        if (patient) {
          const patientData = JSON.parse(patient);
          to.params.id = patientData.id;
          next();
        } else {
          next('/signInPatient');
        }
      }
    },
    {
      path: '/doctor/profile/:id',
      name: 'DoctorProfile',
      component: () => import('@/pages/doctorProfile.vue')
    },
    {
      path: '/bookingPage/:doctorId',
      component: () => import('@/pages/BookingPage.vue')
    },
    {
      path: '/bookingPagePatient/:doctorId',
      component: () => import('@/pages/BookingPage.vue')
    }
  ]),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
