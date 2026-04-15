<template>
  <q-card-section class="q-pa-md">
    <q-input
      v-model:model-value="messageInput"
      outlined
      :disable="props.disabled"
      bg-color="white"
      placeholder="Write a message"
      @keyup.enter="handleSend"
    >
      <template #append>
        <q-btn
          :disable="props.disabled"
          flat
          round
          color="amber-8"
          icon="send"
          @click="handleSend"
        />
      </template>
    </q-input>
    <div v-if="disabled" class="text-caption text-grey-6 q-mt-sm">
      You are disconnected. Messages are temporarily disabled.
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  send: [message: string];
}>();

const messageInput = ref('');

const handleSend = () => {
  const message = messageInput.value.trim();

  if (!message || props.disabled) {
    return;
  }

  emit('send', message);
  messageInput.value = '';
};
</script>
