<template>
  <q-page class="row items-center justify-evenly">
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
import { socketEvents } from '@chat-app/contracts';
import type { User, PresencePayload } from '@chat-app/contracts';

const currentUser = ref<User | null>(null);
const onlineUsers = ref<PresencePayload>([]);
const errorMessage = ref('');
const isConnected = ref(false);

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

onMounted(() => {
  socket.on('connect', () => {
    socket.emit(socketEvents.JOIN, { username: 'Anakin' });
  });

  socket.on(socketEvents.JOINED, (payload: User) => {
    isConnected.value = true;
    currentUser.value = payload;
    console.log(socketEvents.JOINED, payload);
  });
  socket.on(socketEvents.PRESENCE_UPDATED, (payload: PresencePayload) => {
    onlineUsers.value = payload;
    console.log(socketEvents.PRESENCE_UPDATED, payload);
  });
  socket.on(socketEvents.ERROR, (payload: { message: string }) => {
    errorMessage.value = payload.message;
    console.log(socketEvents.ERROR, payload);
  });
});

onBeforeUnmount(() => {
  socket.off('connect');
  socket.off(socketEvents.JOINED);
  socket.off(socketEvents.PRESENCE_UPDATED);
  socket.off(socketEvents.ERROR);
  socket.off('disconnect');
  socket.disconnect();
});
</script>
