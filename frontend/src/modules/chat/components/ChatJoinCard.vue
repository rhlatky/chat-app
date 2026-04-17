<template>
  <q-card flat bordered class="q-pa-xl chat-join-card">
    <div class="text-h6 text-weight-bold">Pick a display name</div>
    <div class="text-caption text-grey-7 q-mt-sm">
      You’ll appear in the online list under this name
    </div>

    <div data-testid="chat-join-username">
      <q-input
        v-model:model-value="usernameInput"
        outlined
        class="q-mt-lg"
        label="Username"
        @keyup.enter="handleJoin"
      />
    </div>

    <q-btn
      color="amber-8"
      text-color="white"
      unelevated
      no-caps
      class="full-width q-mt-md"
      label="Enter room"
      data-testid="chat-join-submit"
      @click="handleJoin"
    />
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  join: [username: string];
}>();

const usernameInput = ref('');

const handleJoin = () => {
  const username = usernameInput.value.trim();

  if (!username) {
    return;
  }

  emit('join', username);
};
</script>

<style>
.chat-join-card {
  width: 100%;
  max-width: 420px;
}
</style>
