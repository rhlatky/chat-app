import type { Message } from '@chat-app/contracts';
import sanitizeHtml from 'sanitize-html';
import multiavatar from '@multiavatar/multiavatar/esm';
import type { UiMessage } from '../types/uiMessage';

export const mapMessageToUiMessage = (message: Message): UiMessage => ({
  ...message,
  message: sanitizeHtml(message.message),
  avatar: `data:image/svg+xml;utf8,${encodeURIComponent(multiavatar(message.userId))}`,
});
