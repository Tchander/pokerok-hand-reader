<template>
  <form>
    <input class="file-input" type="file" name="filefield" accept=".txt" multiple @change="onInputChange" />
  </form>
</template>

<script setup lang="ts">
import { startsWith } from '@/utils/index.ts';

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement;

  const files = target.files;

  if (!files) return;

  for (const file of files) {
    readFile(file);
  }
}

function readFile(file: File) {
  const reader = new FileReader();

  // Обработка завершения чтения файла
  reader.onload = function (event: ProgressEvent<FileReader>) {
    const content = event.target?.result as string | null; // Получаем содержимое файла

    if (!content) return;

    const lines = content.split('\n').filter(line => line.trim() !== ''); // Разделяем содержимое на строки и удаляем пустые

    const hands = [];
    let currentHand = [];
    let handCounter = 0;

    for (const line of lines) {
      if (startsWith(line, 'Poker Hand')) {
        if (!currentHand.length) {
          currentHand.push(line);
          continue;
        }

        handCounter++;
        hands.push(currentHand);
        currentHand = [];
        currentHand.push(line);
      } else {
        currentHand.push(line);
      }
    }

    console.log(handCounter);
    console.log(hands);
  }

  // Чтение файла как текста
  reader.readAsText(file);
}
</script>

<style scoped>
/* pass */
</style>
