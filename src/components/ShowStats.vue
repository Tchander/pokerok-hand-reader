<template>
  <v-sheet class="mx-auto pa-8 show-stats" max-width="1500px" width="100%" rounded="lg">
    <h3 class="title">Hero stats from GG pokerOK</h3>
    <div class="number-of-hands">{{ totalHands }}</div>
    <div class="main-stats">

    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const numberOfHands = ref(0);

const totalHands = computed(() => {
  return `Total hands: ${numberOfHands.value}`;
});
</script>

<style scoped>
.show-stats {
  background-color: transparent;
  color: white;
  border: 3px solid #0c2908;
}

.title {
  text-align: center;
  font-size: 32px;
  line-height: 150%;
  margin-bottom: 16px;
}

.number-of-hands {
  font-size: 24px;
  line-height: 150%;
  margin-bottom: 32px;
}
</style>
