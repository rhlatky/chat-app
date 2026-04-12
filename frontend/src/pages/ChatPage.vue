<template>
  <q-page class="window-height overflow-hidden bg-grey-2">
    <div class="row no-wrap full-height q-pa-md">
      <div class="q-pr-md">
        <online-users-list :online-users="onlineUsers" />
      </div>

      <div class="col column overflow-hidden chat-panel">
        <q-card v-if="currentUser" flat bordered class="col column overflow-hidden">
          <chat-header :is-connected="isConnected" :error-message="errorMessage" />

          <chat-message-list
            :loading="areMessagesLoading"
            :current-user-id="currentUser.userId"
            :messages="messages"
          />

          <q-separator />

          <chat-input @send="sendMessage" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useChat } from 'src/modules/chat/composables/useChat';
import OnlineUsersList from 'src/modules/chat/components/OnlineUsersList.vue';
import ChatHeader from 'src/modules/chat/components/ChatHeader.vue';
import ChatInput from 'src/modules/chat/components/ChatInput.vue';
import ChatMessageList from 'src/modules/chat/components/ChatMessageList.vue';

const {
  sendMessage,
  onlineUsers,
  currentUser,
  messages,
  isConnected,
  errorMessage,
  areMessagesLoading,
} = useChat();
</script>

<style scoped>
.chat-panel {
  min-width: 0;
  min-height: 0;
}
</style>
