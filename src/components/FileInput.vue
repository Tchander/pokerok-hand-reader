<template>
  <form>
    <input class="file-input" type="file" name="filefield" accept=".txt" multiple @change="onInputChange" />
  </form>
</template>

<script setup lang="ts">
import { useCountersStore } from '@/stores/counters';
import { handHandler } from '@/parser/hand';
import { startsWith } from '@/utils/index.ts';
import { KEY_WORDS } from '@/enums/parser';

const countersStore = useCountersStore();

async function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;

  const files = target.files;

  if (!files) return;

  try {
    await countersStore.openCountersDatabase();

    for (const file of files) {
      readFile(file);
    }
  } catch (error) {
    console.error(`Ошибка ${error} при открытии базы`);
  }
}

function readFile(file: File) {
  const reader = new FileReader();

  // Обработка завершения чтения файла
  reader.onload = async function (event: ProgressEvent<FileReader>) {
    const content = event.target?.result as string | null; // Получаем содержимое файла

    if (!content) return;

    const lines = content.split('\n').filter(line => line.trim() !== ''); // Разделяем содержимое на строки и удаляем пустые

    let currentHand: string[] = [];
    let handCounter = 0;

    for (const line of lines) {
      if (startsWith(line, KEY_WORDS.POKER_HAND)) {
        if (!currentHand.length) {
          currentHand.push(line);
          handCounter++;
        } else {
          // Обработка руки
          await handHandler(currentHand);

          currentHand = [];
          currentHand.push(line);
          handCounter++;
        }
      } else {
        currentHand.push(line);
      }
    }

    if (currentHand.length) {
      await handHandler(currentHand);
    }

    await countersStore.updateNumberOfHands(handCounter);
  }

  // Чтение файла как текста
  reader.readAsText(file);
}
</script>

<style scoped>
/* pass */
</style>
