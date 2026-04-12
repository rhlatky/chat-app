<template>
  <div class="col overflow-auto q-px-lg q-py-md messages-scroll">
    <template v-if="loading">
      <div class="column items-center justify-center full-height q-gutter-sm text-grey-6">
        <q-spinner-dots size="40px" color="amber-8" />
        <div class="text-caption">Loading messages...</div>
      </div>
    </template>

    <template v-else-if="messages.length === 0">
      <div class="column items-center justify-center text-center full-height text-grey-6">
        <div class="text-subtitle2 text-weight-medium">No messages yet</div>
        <div class="text-caption q-mt-xs">Start the conversation by sending the first message.</div>
      </div>
    </template>

    <template v-else>
      <template v-for="message in messages" :key="message.id">
        <q-chat-message
          :text="[message.message]"
          :name="message.userId === currentUserId ? 'You' : message.username"
          :stamp="message.createdAt"
          :avatar="message.avatar"
          :sent="message.userId === currentUserId"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { UiMessage } from '../types/uiMessage';

defineProps({
  messages: {
    type: Array as PropType<UiMessage[]>,
    required: true,
  },
  currentUserId: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.messages-scroll {
  min-height: 0;
}
</style>
