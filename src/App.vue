<template>
  <div class="app">
    <FileForm />
  </div>
</template>

<script setup lang="ts">
import FileForm from '@/components/FileForm.vue';
</script>

<style scoped>
.app {
  background-color: #0a100e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-height: 100dvh;
}
</style>
