<template>
  <v-sheet class="mx-auto pa-8 show-stats" max-width="1500px" width="100%" rounded="lg">
    <h3 class="title">Hero stats from GG pokerOK</h3>
    <div v-if="stats" class="number-of-hands">{{ totalHands }}</div>
    <div class="main-stats">
      <StatCircular v-for="stat in mainStats" :key="stat.label" v-bind="stat" />
    </div>
    <div class="additional-stats">
      <StatCircular v-for="stat in additionalStats" :key="stat.label" v-bind="stat" />
    </div>
    <ResetStats />
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStatsStore } from '@/stores/stats';
import StatCircular from './StatCircular';
import ResetStats from './ResetStats';
import type { Stats } from '@/stores/stats';
import type { StatCircularProps } from './StatCircular';

const statsStore = useStatsStore();

const stats = ref<Stats | null>(null);

const totalHands = computed(() => {
  return `Total hands: ${stats.value?.numberOfHands}`;
});

const mainStats = computed<StatCircularProps[]>(() => {
  if (!stats.value) return [];

  return [
    {
      label: 'VPIP',
      value: stats.value.vpip,
      size: 'big',
    },
    {
      label: 'PFR',
      value: stats.value.pfr,
      size: 'big',
    },
    {
      label: '3-BET',
      value: stats.value.threeBet,
      size: 'big',
    },
  ];
});

const additionalStats = computed<StatCircularProps[]>(() => {
  if (!stats.value) return [];

  return [
    {
      label: 'WTSD',
      value: stats.value.wtsd,
    },
    {
      label: 'W$SD',
      value: stats.value.wmsd,
    },
    {
      label: 'WWSF',
      value: stats.value.wwsf,
    },
    {
      label: 'Fold to 3-Bet',
      value: stats.value.foldThreeBetAfterRaising,
    },
    {
      label: 'Preflop Squeeze',
      value: stats.value.preFlopSqueeze,
    },
  ];
});

async function getStats() {
  try {
    stats.value = await statsStore.getStats();
  } catch (error) {
    console.error(`Ошибка ${error} при получении статистики`);
  }
}

getStats();

defineExpose({
  getStats,
});
</script>

<style scoped>
.show-stats {
  position: relative;
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

.main-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.additional-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .main-stats {
    grid-template-columns: repeat(1, 1fr);
  }

  .additional-stats {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
