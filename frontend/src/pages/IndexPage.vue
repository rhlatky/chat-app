<template>
  <q-page class="row items-center justify-evenly">
    <q-card v-if="currentUser" class="q-pa-md col justify-center">
      <template v-for="message in messages" :key="message.id">
        <q-chat-message
          :text="[message.message]"
          :name="message.username"
          :stamp="message.createdAt"
          :avatar="message.avatar"
          :sent="message.userId === currentUser.userId"
        ></q-chat-message>
      </template>
      <q-input
        v-model:model-value="messageInput"
        @keyup.enter="sendMessage(messageInput)"
      ></q-input>
    </q-card>
    <div>
      <p>Connected: {{ isConnected ? 'yes' : 'no' }}</p>

      <div v-if="currentUser">
        <p>User ID: {{ currentUser.userId }}</p>
        <p>Username: {{ currentUser.username }}</p>
      </div>

      <div v-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>

      <ul>
        <li v-for="user in onlineUsers" :key="user.userId">
          {{ user.username }}
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { io } from 'socket.io-client';
import type { Message, PresencePayload, User } from '@chat-app/contracts';
import { messageSchema, socketEvents } from '@chat-app/contracts';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import multiavatar from '@multiavatar/multiavatar/esm';

const isConnected = ref(false);

const currentUser = ref<User | null>(null);
const onlineUsers = ref<PresencePayload>([]);

const messageInput = ref('');

type UiMessage = Message & {
  avatar: string;
};

const messages = ref<UiMessage[]>([]);

const errorMessage = ref('');

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

const sendMessage = (message: string) => {
  socket.emit(socketEvents.SEND_MESSAGE, {
    message: message,
  });
  messageInput.value = '';
};

const fetchMessages = async () => {
  try {
    const response = await fetch('http://localhost:3000/messages');

    if (!response.ok) {
      errorMessage.value = 'Failed to load message history';
      return;
    }

    const data: unknown = await response.json();
    const parsed = z.array(messageSchema).safeParse(data);

    if (!parsed.success) {
      errorMessage.value = 'Data is in wrong format';
      return;
    }

    messages.value = parsed.data.map((message) => ({
      ...message,
      message: sanitizeHtml(message.message),
      avatar: `data:image/svg+xml;utf8,${encodeURIComponent(multiavatar(message.userId))}`,
    }));
  } catch {
    errorMessage.value = 'Failed to load message history';
  }
};

onMounted(() => {
  socket.on('connect', () => {
    isConnected.value = true;
    socket.emit(socketEvents.JOIN, { username: 'Anakin2' + Math.random() });
  });

  socket.on(socketEvents.JOINED, async (payload: User) => {
    currentUser.value = payload;
    await fetchMessages();
    console.log(socketEvents.JOINED, payload);
  });
  socket.on(socketEvents.PRESENCE_UPDATED, (payload: PresencePayload) => {
    onlineUsers.value = payload;
    console.log(socketEvents.PRESENCE_UPDATED, payload);
  });

  socket.on(socketEvents.MESSAGE_RECEIVED, (payload: Message) => {
    const sanitizedMessage = {
      ...payload,
      message: sanitizeHtml(payload.message),
      avatar: `data:image/svg+xml;utf8,${encodeURIComponent(multiavatar(payload.userId))}`,
    };
    messages.value.push(sanitizedMessage);
  });

  socket.on('exception', (payload: { message: string }) => {
    errorMessage.value = payload.message;
    console.log('exception', payload);
  });
});

onBeforeUnmount(() => {
  socket.off('connect');
  socket.off(socketEvents.JOINED);
  socket.off(socketEvents.PRESENCE_UPDATED);
  socket.off('disconnect');
  socket.disconnect();
});
</script>
