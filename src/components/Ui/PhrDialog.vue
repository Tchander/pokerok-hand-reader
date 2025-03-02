<template>
  <v-dialog v-model="modelValue" :width="props.width" min-height="230px">
    <v-card :title="props.title" :text="props.text" color="#0c2908">
      <slot />
      <template v-slot:actions>
        <slot name="actions" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
type Props = {
  title?: string;
  text?: string;
  width?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: '',
  text: '',
  width: 'auto',
});

const modelValue = defineModel<boolean>()
</script>
