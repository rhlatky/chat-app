<template>
  <q-card-section class="row items-center justify-between q-px-lg q-py-md">
    <div>
      <div class="text-subtitle1 text-weight-bold">RealTime Chat</div>
      <div class="text-caption text-grey-7">Talk in real time with connected teammates</div>
    </div>

    <q-chip
      :color="props.isConnected ? 'green-7' : 'grey-3'"
      :text-color="props.isConnected ? 'grey-1' : 'grey-7'"
    >
      {{ props.isConnected ? 'Connected' : 'Disconnected' }}
    </q-chip>
  </q-card-section>

  <q-separator />
</template>

<script setup lang="ts">
const props = defineProps<{
  isConnected: boolean;
}>();
</script>
