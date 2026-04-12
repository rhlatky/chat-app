import type { User } from '@chat-app/contracts';

export type UiUser = User & {
  avatar: string;
};
