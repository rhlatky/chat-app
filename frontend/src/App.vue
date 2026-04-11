<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { io } from 'socket.io-client';

const userId = ref('');

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

onMounted(() => {
  socket.on('connect', () => {
    socket.emit('join', { username: 'Anakin' }, (response: string) => {
      userId.value = response;
      console.log(response);
    });
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>
