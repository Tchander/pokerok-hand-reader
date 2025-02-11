<template>
  <div class="progress-wrapper">
    <div :class="[props.size ? `label-${props.size}` : 'label-medium']">
      {{ props.label }}
    </div>
    <v-progress-circular
      :model-value="props.value"
      :rotate="360"
      :size="circularSize"
      :width="circularWidth"
      :color="calculateColor"
      bg-color="#2d2d2d"
    >
      <span :class="[props.size ? `value-${props.size}` : 'value-medium']">
        {{ roundValue }}
      </span>
    </v-progress-circular>
  </div>
</template>

<script setup lang="ts">
// TODO: Add tooltip icon
import { computed } from 'vue';
import type { StatCircularProps } from './types';

const props = defineProps<StatCircularProps>();

const circularSize = computed(() => {
  if (!props.size) return 100;

  if (props.size === 'big') return 150;
  if (props.size === 'small') return 50;
  return 100;
});

const circularWidth = computed(() => {
  if (!props.size) return 15;

  if (props.size === 'big') return 20;
  if (props.size === 'small') return 5;
  return 15;
});

const roundValue = computed(() => {
  return Math.round(props.value);
});

const calculateColor = computed(() => {
  if (props.value > 80) return 'red';

  if (props.value > 50) return 'orange';

  return 'green';
});
</script>

<style scoped>
.progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.label-big {
  font-size: 24px;
}

.label-medium {
  font-size: 18px;
}

.label-small {
  font-size: 14px;
}

.value-big {
  font-size: 32px;
}

.value-medium {
  font-size: 24px;
}

.value-small {
  font-size: 16px;
}
</style>
