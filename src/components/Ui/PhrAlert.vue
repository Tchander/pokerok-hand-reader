<template>
  <v-alert v-model="modelValue" v-bind="props" closable position="absolute" width="100%" />
</template>

<script setup lang="ts">
// TODO: доделать позиционирование алерта
import type { VAlert } from 'vuetify/components';

type Props = {
  type?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  text?: string;
};
const props = defineProps<Props>();

const modelValue = defineModel<boolean | undefined>();
</script>
