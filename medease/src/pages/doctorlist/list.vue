<template>
  hello {{ name }};
  <v-text-field label="Name" v-model="name" />

  <div v-for="doctor in doctorList" :key="doctor.id">
    Name:{{ doctor.name }},
    Desc:{{ doctor.speciality }}
  </div>

  <v-list :items="doctorList" item-title="name" item-props>
    <template v-slot:subtitle="{ item }">
        <div v-html="item.speciality"></div>
      </template>
  </v-list>
</template>


<script setup>
  import { doctorList } from '@/repos/expDoctorList';

    const name ="toto";
    
</script>