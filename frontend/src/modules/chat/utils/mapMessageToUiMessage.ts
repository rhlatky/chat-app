import type { Message } from '@chat-app/contracts';
import sanitizeHtml from 'sanitize-html';
import multiavatar from '@multiavatar/multiavatar/esm';
import type { UiMessage } from '../types/uiMessage';
import { date } from 'quasar';

export const mapMessageToUiMessage = (message: Message): UiMessage => ({
  ...message,
  message: sanitizeHtml(message.message),
  createdAt: formatMessageDate(message.createdAt),
  avatar: `data:image/svg+xml;utf8,${encodeURIComponent(multiavatar(message.userId))}`,
});

const formatMessageDate = (createdAt: string) => {
  const messageDate = new Date(createdAt);
  const now = new Date();

  return date.isSameDate(messageDate, now, 'day')
    ? date.formatDate(messageDate, 'HH:mm')
    : date.formatDate(messageDate, 'DD.MM.YYYY HH:mm');
};
