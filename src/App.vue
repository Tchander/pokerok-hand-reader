<template>
  <v-app class="app">
    <v-app-bar color="#0c2908" height="80" absolute>
      <v-app-bar-title>Poker Hand Reader</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-github" @click="goToGithubPage" />
      </template>
    </v-app-bar>
    <main class="content">
      <FileForm @update-stats="updateStats" />
      <ShowStats ref="showStats" class="show-stats" />
    </main>
    <v-footer class="footer" color="#0c2908" height="80">
      <v-btn variant="text" append-icon="mdi-github" @click="goToGithubPage">
        Github Page
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileForm from '@/components/FileForm.vue';
import ShowStats from './components/ShowStats.vue';

const showStats = ref<InstanceType<typeof ShowStats> | null>(null);

function goToGithubPage() {
  window.open('https://github.com/Tchander/pokerok-hand-reader', '_blank');
}

async function updateStats() {
  if (showStats.value) {
    await showStats.value.getStats();
  }
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

.show-stats {
  margin-top: 64px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
