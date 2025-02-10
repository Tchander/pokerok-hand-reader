<template>
  <form>
    <input class="file-input" type="file" name="filefield" accept=".txt" multiple @change="onInputChange" />
  </form>
</template>

<script setup lang="ts">
import { useCountersStore } from '@/stores/counters';
import { useStatsStore } from '@/stores/stats';
import { handHandler, setStatsAndCounters } from '@/parser/hand';
import { startsWith } from '@/utils/index.ts';
import { KEY_WORDS } from '@/enums/parser';

const countersStore = useCountersStore();
const statsStore = useStatsStore();

async function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;

  const files = target.files;

  if (!files) return;

  try {
    await countersStore.openCountersDatabase();
    await statsStore.openStatsDatabase();

    for (const file of files) {
      readFile(file);
    }

    await setStatsAndCounters();
  } catch (error) {
    console.error(`Ошибка ${error} при открытии базы`);
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
</script>

<style scoped>
/* pass */
</style>
