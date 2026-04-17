import type { User } from '@chat-app/contracts';
import { mapUserToUiUser } from './mapUserToUiUser';

describe('mapUserToUiUser', () => {
  it('keeps original user fields', () => {
    const user: User = {
      userId: 'user-1',
      username: 'Anakin',
    };

    const mapped = mapUserToUiUser(user);

    expect(mapped).toEqual(
      expect.objectContaining({
        userId: user.userId,
        username: user.username,
      }),
    );
    expect(mapped.avatar).toEqual(expect.any(String));
  });

  it('returns stable avatar for the same user id', () => {
    const user: User = {
      userId: 'user-1',
      username: 'Anakin',
    };

    const first = mapUserToUiUser(user);
    const second = mapUserToUiUser(user);
    const third = mapUserToUiUser({
      userId: 'user-2',
      username: 'Leia',
    });

    expect(first.avatar).toBe(second.avatar);
    expect(second.avatar).not.toBe(third.avatar);
  });
});
