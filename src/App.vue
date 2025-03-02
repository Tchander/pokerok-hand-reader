<template>
  <v-app class="app">
    <TheHeader @go-to-github="goToGithubPage" />
    <main class="content">
      <HomePage />
    </main>
    <TheFooter @go-to-github="goToGithubPage" />
  </v-app>
</template>

<script setup lang="ts">
import TheHeader from './layouts/TheHeader.vue';
import HomePage from './views/HomePage.vue';
import TheFooter from './layouts/TheFooter.vue';

function goToGithubPage() {
  window.open('https://github.com/Tchander/pokerok-hand-reader', '_blank');
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  background-color: #0a100e;
  padding: 160px 32px 40px;
  min-height: 100dvh;
}
</style>
