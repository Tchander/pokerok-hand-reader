<template>
  <v-sheet class="mx-auto pa-8" width="600" rounded color="#0c2908">
    <v-form @submit.prevent>
      <v-file-input v-model="files" label="Upload hands" variant="outlined" accept=".txt" show-size multiple chips
        clearable />
      <v-btn class="mt-4 w-100" type="submit" variant="outlined" size="large" :disabled="!files.length"
        :loading="isLoading" @click="handleFiles">
        Submit
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCountersStore } from '@/stores/counters';
import { useStatsStore } from '@/stores/stats';
import { handHandler, setStatsAndCounters } from '@/parser/hand';
import { startsWith } from '@/utils/index.ts';
import { KEY_WORDS } from '@/enums/parser';

const countersStore = useCountersStore();
const statsStore = useStatsStore();

const files = ref<File[]>([]);
const isLoading = ref(false);

async function openDatabases() {
  try {
    await countersStore.openCountersDatabase();
    await statsStore.openStatsDatabase();
  } catch (error) {
    console.error(`Ошибка ${error} при открытии базы`);
  }
}

function handleFiles() {
  isLoading.value = true;
  for (const file of files.value) {
    readFile(file);
  }

  setData();
  isLoading.value = false;
  files.value = [];
}

async function setData() {
  try {
    await setStatsAndCounters();
  } catch (error) {
    console.error(`Ошибка ${error} при сохранении статистики`);
  }
}


function readFile(file: File) {
  const reader = new FileReader();

  reader.onload = async function (event: ProgressEvent<FileReader>) {
    const content = event.target?.result as string | null;

    if (!content) return;

    const lines = content.split('\n').filter(line => line.trim() !== '');

    let currentHand: string[] = [];

    for (const line of lines) {
      if (startsWith(line, KEY_WORDS.POKER_HAND)) {
        if (!currentHand.length) {
          currentHand.push(line);
        } else {
          await handHandler(currentHand);

          currentHand = [];
          currentHand.push(line);
        }
      } else {
        currentHand.push(line);
      }
    }

    if (currentHand.length) {
      await handHandler(currentHand);
    }
  }

  reader.readAsText(file);
}

openDatabases();
</script>

<style scoped></style>
