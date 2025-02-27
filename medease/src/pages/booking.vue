
<template>
  <div class="booking-page">
    <h1>Booking Page</h1>
    <!-- Add booking form or other content here -->
  </div>
  <navbar />
  <v-container>
    <v-row>
      <!-- Sidebar Filters -->
      <v-col cols="12" md="3">
        <v-card class="pa-4">
          <v-card-title>Filters</v-card-title>
          <v-divider></v-divider>

          <div v-for="(subcategories, category) in categories" :key="category">
            <v-checkbox
              v-if="category !== 'rating'"
              v-model="selectedCategories"
              :label="category"
              :value="category"
              hide-details
              dense
            ></v-checkbox>

            <v-expand-transition>
              <div v-if="selectedCategories.includes(category)" class="ml-4">
                <v-checkbox
                  v-for="subcategory in subcategories"
                  :key="subcategory"
                  v-model="selectedSubcategories"
                  :label="subcategory"
                  :value="subcategory"
                  hide-details
                  dense
                ></v-checkbox>
              </div>
            </v-expand-transition>
          </div>

          <!-- Rating Sorting Checkbox -->
          <v-checkbox
            v-model="sortByRating"
            label="Sort by Rating"
            hide-details
            dense
          ></v-checkbox>
        </v-card>
      </v-col>

      <!-- Doctors List -->
      <v-col cols="12" md="9">
        <v-row>
          <v-col v-for="(doctor, index) in filteredDoctors" :key="index" cols="12" sm="6" md="4">
            <v-card class="pa-3">
              <v-img :src="doctor.image" height="150px" contain></v-img>
              <v-card-title>{{ doctor.name }}</v-card-title>
              <v-card-subtitle>{{ doctor.specialty }} - {{ doctor.location }}</v-card-subtitle>
              <v-card-text>⭐ {{ doctor.rating.toFixed(1) }}/5.0</v-card-text>

              <v-card-actions>
                <v-btn color="info" @click="toggleExpand(index)">See more</v-btn>
                <v-btn color="primary" :to="'/booking/' + (index + 1)">Book</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <v-card-text v-if="expandedIndex === index">
                  {{ doctor.description }}
                </v-card-text>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import doctorsData from "@/repos/doctorsBooking.json";

export default {
  data() {
    return {
      expandedIndex: null,
      selectedCategories: [],
      selectedSubcategories: [],
      sortByRating: false,
      categories: doctorsData.categories,
      doctors: doctorsData.doctors
    };
  },
  computed: {
    filteredDoctors() {
      let filtered = this.doctors.filter(doctor => {
        return (
          (this.selectedCategories.includes("Speciality") ? this.selectedSubcategories.includes(doctor.specialty) : true) &&
          (this.selectedCategories.includes("Location") ? this.selectedSubcategories.includes(doctor.location) : true)
        );
      });

      if (this.sortByRating) {
        return filtered.sort((a, b) => b.rating - a.rating);
      }
      return filtered;
    }
  },
  methods: {
    toggleExpand(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;
    }
  }
};
</script>
