<template>
  <v-snackbar v-model="modelValue" v-bind="props" close-on-content-click location="top" timeout="2000" />
</template>

<script setup lang="ts">
type Props = {
  text?: string;
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
  color?: string;
};
const props = withDefaults(defineProps<Props>(), {
  text: '',
  variant: 'elevated',
  color: '#0c2908'
});

const modelValue = defineModel<boolean | undefined>();
</script>
