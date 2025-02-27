<template>
<<<<<<< Updated upstream
  <navbar />
  <v-container>
    <v-row>
      <!-- Sidebar Filters (Left) -->
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <v-card-title>Filters</v-card-title>
          <v-divider></v-divider>
=======
    Booking Page123
</template>
<script setup>
>>>>>>> Stashed changes

          <!-- Specialty Filter -->
          <v-checkbox
            v-model="selectedSpecialties"
            :label="'Specialty'"
            :value="'Specialty'"
            hide-details
            dense
          ></v-checkbox>
          <v-expand-transition>
            <div v-if="selectedSpecialties.length > 0" class="ml-4">
              <v-checkbox
                v-for="specialty in categories.Speciality"
                :key="specialty"
                v-model="selectedSubcategories.specialty"
                :label="specialty"
                :value="specialty"
                hide-details
                dense
              ></v-checkbox>
            </div>
          </v-expand-transition>

          <!-- Location Filter -->
          <v-checkbox
            v-model="selectedLocations"
            :label="'Location'"
            :value="'Location'"
            hide-details
            dense
          ></v-checkbox>
          <v-expand-transition>
            <div v-if="selectedLocations.length > 0" class="ml-4">
              <v-checkbox
                v-for="location in categories.Location"
                :key="location"
                v-model="selectedSubcategories.location"
                :label="location"
                :value="location"
                hide-details
                dense
              ></v-checkbox>
            </div>
          </v-expand-transition>

          <!-- Rating Filter (Sort By Rating) -->
          <v-checkbox
            v-model="sortByRating"
            :label="'Sort by Rating'"
            hide-details
            dense
          ></v-checkbox>
        </v-card>
      </v-col>

      <!-- Items List (Right) -->
      <v-col cols="12" md="9">
        <v-row>
          <v-col v-for="(doctor, index) in filteredItems" :key="index" cols="12" sm="6" md="4">
            <v-card class="pa-3">
              <!-- Profile Picture -->
              <v-img :src="doctor.image" height="150px" contain></v-img>

              <!-- Details -->
              <v-card-title>{{ doctor.name }}</v-card-title>

              <!-- Expandable description -->
              <v-expand-transition>
                <v-card-text v-if="expandedIndex === index">
                  {{ doctor.description }}
                </v-card-text>
              </v-expand-transition>

              <v-card-actions>
                <v-btn color="info" @click="toggleExpand(index)">See more</v-btn>
                <v-btn color="primary">Book</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import doctorsData from '@/assets/doctors.json'; // Import the JSON file

export default {
  data() {
    return {
      expandedIndex: null, // Track expanded item
      selectedSpecialties: [], 
      selectedLocations: [],
      sortByRating: false, // To toggle sorting by rating
      selectedSubcategories: {
        specialty: [],
        location: [],
      },
      categories: doctorsData.categories, // Load categories from the JSON
      doctors: doctorsData.doctors, // Load doctors data from the JSON
    };
  },
  computed: {
    filteredItems() {
      let filtered = this.doctors.filter(doctor => {
        const specialtyMatch = this.selectedSubcategories.specialty.length > 0 ? this.selectedSubcategories.specialty.includes(doctor.specialty) : true;
        const locationMatch = this.selectedSubcategories.location.length > 0 ? this.selectedSubcategories.location.includes(doctor.location) : true;

        return specialtyMatch && locationMatch;
      });

      // If the sortByRating is checked, sort the list by rating
      if (this.sortByRating) {
        filtered = filtered.sort((a, b) => b.rating - a.rating); // Sort numerically based on rating
      }

      return filtered;
    },
  },
  methods: {
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
/* Smooth transition */
.v-enter-active, .v-leave-active {
  transition: all 0.3s ease;
}
.v-enter, .v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
