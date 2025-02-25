<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      :elevation="isHovering ? 8 : 2"
      :class="{ 'on-hover': isHovering }"
      v-bind="props"
      color="#BDE0FE"
      class="white--text"
    >
      <slot></slot>
    </v-card>
  </v-hover>
</template>

<script setup>
</script>

<style scoped>
.on-hover {
  transition: all 0.3s ease-in-out;
}

.white--text {
  color: #FCFBF5 !important;
}
</style> 