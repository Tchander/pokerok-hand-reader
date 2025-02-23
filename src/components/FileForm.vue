<template>
  <v-sheet class="mx-auto pa-8 file-form" max-width="600" width="100%" rounded="lg">
    <v-form @submit.prevent>
      <v-file-input v-model="files" label="Upload hands" variant="outlined" accept=".txt" show-size multiple chips
        clearable />
      <v-btn class="mt-4 w-100" type="submit" variant="outlined" size="large" :disabled="!files.length"
        :loading="isLoading" @click="handleFiles">
        Submit
      </v-btn>
    </v-form>
  </v-sheet>
  <PhrAlert v-model="showSuccessAlert" type="success" title="Data saved successfully" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCountersStore } from '@/stores/counters';
import { useStatsStore } from '@/stores/stats';
import { useHandHandler } from '@/parser/hand';
import { startsWith } from '@/utils/index.ts';
import { KEY_WORDS } from '@/enums/parser';
import PhrAlert from './Ui/PhrAlert.vue';

type Emits = {
  updateStats: [],
};

const emit = defineEmits<Emits>();

const { handHandler } = useHandHandler();

const countersStore = useCountersStore();
const statsStore = useStatsStore();

const files = ref<File[]>([]);
const isLoading = ref(false);
const showSuccessAlert = ref(false);

async function openDatabases() {
  try {
    await countersStore.openCountersDatabase();
    await statsStore.openStatsDatabase();
  } catch (error) {
    console.error(`Ошибка ${error} при открытии базы`);
  }
}

async function handleFiles() {
  isLoading.value = true;
  for (const file of files.value) {
    readFile(file);
  }

  await setData();
  isLoading.value = false;
  files.value = [];
  emit('updateStats');
}

async function setData() {
  await setStatsAndCounters();
}

async function setStatsAndCounters() {
  try {
    const updatedCounters = await countersStore.setCounters();

    await statsStore.setStats(updatedCounters);

    showSuccessAlert.value = true;
  } catch (error) {
    console.error(`Ошибка ${error} при сохранении статистики`);
  } finally {
    countersStore.resetCounters();
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

<style scoped>
.file-form {
  background-color: transparent;
  color: white;
  border: 3px solid #0c2908;
}
</style>
