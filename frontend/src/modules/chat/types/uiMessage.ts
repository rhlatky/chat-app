import type { Message } from '@chat-app/contracts';

export type UiMessage = Message & {
  avatar: string;
};
