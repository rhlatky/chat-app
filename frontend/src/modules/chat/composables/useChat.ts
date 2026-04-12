import { onBeforeUnmount, onMounted, ref } from 'vue';
import { io } from 'socket.io-client';
import type { Message, PresencePayload, User } from '@chat-app/contracts';
import { messageSchema, socketEvents } from '@chat-app/contracts';
import { z } from 'zod';
import type { UiMessage } from 'src/modules/chat/types/uiMessage';
import type { UiUser } from 'src/modules/chat/types/uiUser';
import { mapMessageToUiMessage } from 'src/modules/chat/utils/mapMessageToUiMessage';
import { mapUserToUiUser } from 'src/modules/chat/utils/mapUserToUiUser';

export function useChat() {
  const isConnected = ref(false);

  const currentUser = ref<User | null>(null);
  const onlineUsers = ref<UiUser[]>([]);

  const areMessagesLoading = ref(false);
  const messages = ref<UiMessage[]>([]);

  const errorMessage = ref('');

  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  });

  const sendMessage = (message: string) => {
    socket.emit(socketEvents.SEND_MESSAGE, {
      message: message,
    });
  };

  const fetchMessages = async () => {
    areMessagesLoading.value = true;

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

      messages.value = parsed.data.map((message) => mapMessageToUiMessage(message));
    } catch {
      errorMessage.value = 'Failed to load message history';
    } finally {
      areMessagesLoading.value = false;
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
      onlineUsers.value = payload.map(mapUserToUiUser);
      console.log(socketEvents.PRESENCE_UPDATED, payload);
    });

    socket.on(socketEvents.MESSAGE_RECEIVED, (payload: Message) => {
      const mappedMessage = mapMessageToUiMessage(payload);
      messages.value.push(mappedMessage);
    });

    socket.on('exception', (payload: { message: string }) => {
      errorMessage.value = payload.message;
      console.log('exception', payload);
    });

    socket.on('disconnect', () => {
      isConnected.value = false;
    });
  });

  onBeforeUnmount(() => {
    socket.off('connect');
    socket.off(socketEvents.JOINED);
    socket.off(socketEvents.PRESENCE_UPDATED);
    socket.off(socketEvents.MESSAGE_RECEIVED);
    socket.off('exception');
    socket.off('disconnect');
    socket.disconnect();
  });

  return {
    isConnected,
    currentUser,
    onlineUsers,
    messages,
    errorMessage,
    sendMessage,
    areMessagesLoading,
  };
}
