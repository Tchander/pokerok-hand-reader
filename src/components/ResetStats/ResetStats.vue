<template>
  <v-btn class="reset-stats-button" variant="text" @click="showResetModal = true">
    Reset stats
  </v-btn>
  <PhrDialog v-if="showResetModal" v-model="showResetModal" title="Are you sure you want to reset statistics?"
    text="By clicking the confirm button you will completely delete the current statistics data" width="430px">
    <template #actions>
      <div class="buttons-wrapper">
        <v-btn class="ms-auto" variant="tonal" @click="closeResetModal">Back</v-btn>
        <v-btn class="ms-auto" variant="outlined" @click="onConfirmClick">Confirm</v-btn>
      </div>
    </template>
  </PhrDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCountersStore } from '@/stores/counters';
import { useStatsStore } from '@/stores/stats';
import PhrDialog from '../Ui/PhrDialog.vue';

const countersStore = useCountersStore();
const statsStore = useStatsStore();

const showResetModal = ref<boolean | undefined>(false);

function closeResetModal() {
  showResetModal.value = false;
}

async function onConfirmClick() {
  try {
    await countersStore.resetCountersStore();
    await statsStore.resetStatsStore();
  } catch (error) {
    console.error(`Ошибка ${error} при удалении статистики`);
  } finally {
    closeResetModal();
  }
}
</script>

<style scoped>
.reset-stats-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.buttons-wrapper {
  display: flex;
  gap: 24px;
}
</style>
