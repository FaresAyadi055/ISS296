<template>
  <navbar />
  <v-app style="background-color: #f8fafc;">
    <v-container>
      <v-row>
        <!-- Sidebar Filters -->
        <v-col cols="12" md="3">
          <v-card class="pa-4" style="background-color: white; color: black;">
            <v-card-title>Filters</v-card-title>
            <v-divider></v-divider>

            <div v-for="(subcategories, category) in doctorlist.categories" :key="category">
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
            <v-col v-for="doctor in filteredDoctors" :key="doctor.id" cols="12" sm="6" md="4">
              <v-card class="pa-3" style="background-color: white; border-radius: 20px; color: black;">
                <v-img :src="doctor.image" height="150px" contain></v-img>
                <v-card-title>{{ doctor.name }}</v-card-title>
                <v-card-subtitle>{{ doctor.specialty }} - {{ doctor.location }}</v-card-subtitle>
                <v-card-text>⭐ {{ doctor.rating.toFixed(1) }}/5.0</v-card-text>

                <v-card-actions>
                  <v-btn style="background-color: #6CACFC; color: white; border-radius: 20px;" @click="toggleExpand(doctor.id)">See more</v-btn>
                  <v-btn style="background-color: #6CACFC; color: white; border-radius: 20px;" :to="'/booking/' + doctor.id">Book</v-btn>
                </v-card-actions>

                <v-expand-transition>
                  <v-card-text v-if="expandedIndex === doctor.id">
                    {{ doctor.description }}
                  </v-card-text>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { doctorlist } from '@/repos/doctors.js';
import Footer from '@/components/footer.vue';

const expandedIndex = ref(null);
const selectedCategories = ref([]);
const selectedSubcategories = ref([]);
const sortByRating = ref(false);

const filteredDoctors = computed(() => {
  let filtered = doctorlist.doctors.filter(doctor => {
    return (
      (selectedCategories.value.includes("Speciality") ? selectedSubcategories.value.includes(doctor.specialty) : true) &&
      (selectedCategories.value.includes("Location") ? selectedSubcategories.value.includes(doctor.location) : true)
    );
  });

  if (sortByRating.value) {
    return filtered.sort((a, b) => b.rating - a.rating);
  }
  return filtered;
});

const toggleExpand = (id) => {
  expandedIndex.value = expandedIndex.value === id ? null : id;
};
</script>
