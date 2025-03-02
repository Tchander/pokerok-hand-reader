<template>
  <v-app-bar color="#0c2908" height="80" absolute>
    <v-app-bar-title>Poker Hand Reader</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-github" @click="emit('goToGithub')" />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
type Emits = {
  goToGithub: [];
};

const emit = defineEmits<Emits>();
</script>
