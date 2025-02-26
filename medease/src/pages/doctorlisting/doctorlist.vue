<template>
  hello {{ name }};
  <v-text-field label="Name" v-model="name" />

  <div v-for="doctor in doctorList" :key="doctor.id">
    Name:{{ doctor.name }},
    Desc:{{ doctor.speciality }}
  </div>
</template>

<v-list : items="doctorList" item-title="name" lines="three"item-props>
  
  <template v-slot:subtitle="{ item }">
        <div v-html="subtitle"></div>
      </template>
    </v-list>
  </v-card>

</template>


<script setup>
    import { ref } from 'vue';
    const name ="toto";
    const doctorList = ref([
        {id:0,name: "Dr. A", speciality: "Dentist"},
        {id:1,name: "Dr. B", speciality: "Dentist"},
        {id:2,name: "Dr. C", speciality: "Dentist"},
        {id:3,name: "Dr. D", speciality: "Dentist"},
    ]);
</script>