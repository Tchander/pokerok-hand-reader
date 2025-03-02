<template>
  <v-footer class="footer" color="#0c2908" height="80">
    <v-btn variant="text" append-icon="mdi-github" @click="emit('goToGithub')">
      Github Page
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
type Emits = {
  goToGithub: [];
};

const emit = defineEmits<Emits>();
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
