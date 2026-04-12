import multiavatar from '@multiavatar/multiavatar/esm';
import type { User } from '@chat-app/contracts';
import type { UiUser } from '../types/uiUser';

export const mapUserToUiUser = (user: User): UiUser => ({
  ...user,
  avatar: `data:image/svg+xml;utf8,${encodeURIComponent(multiavatar(user.userId))}`,
});
