<template>
  <FileForm @update-stats="updateStats" />
  <ShowStats ref="showStats" class="show-stats" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileForm from '@/components/FileForm.vue';
import ShowStats from '@/components/ShowStats.vue';

const showStats = ref<InstanceType<typeof ShowStats> | null>(null);

async function updateStats() {
  if (showStats.value) {
    await showStats.value.getStats();
  }
}
</script>

<style scoped>
.show-stats {
  margin-top: 64px;
}
</style>
