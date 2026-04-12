<template>
  <q-card-section class="q-pa-md">
    <q-input
      v-model:model-value="messageInput"
      outlined
      bg-color="white"
      placeholder="Write a message"
      @keyup.enter="handleSend"
    >
      <template #append>
        <q-btn flat round color="amber-8" icon="send" @click="handleSend" />
      </template>
    </q-input>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  send: [message: string];
}>();

const messageInput = ref('');

const handleSend = () => {
  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  emit('send', message);
  messageInput.value = '';
};
</script>
