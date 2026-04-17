import { date } from 'quasar';
import type { Message } from '@chat-app/contracts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mapMessageToUiMessage } from './mapMessageToUiMessage';

describe('mapMessageToUiMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sanitizes message html and adds avatar data uri', () => {
    const message: Message = {
      id: 'message-1',
      userId: 'user-1',
      username: 'Anakin',
      message: '<script>alert(1)</script><b>Hello there</b>',
      createdAt: '2026-04-17T09:15:00.000Z',
    };

    const mapped = mapMessageToUiMessage(message);

    expect(mapped.message).toBe('<b>Hello there</b>');
    expect(mapped.avatar.startsWith('data:image/svg+xml;utf8,')).toBe(true);
  });

  it('formats same-day messages as time only', () => {
    const message: Message = {
      id: 'message-1',
      userId: 'user-1',
      username: 'Anakin',
      message: 'Hello there',
      createdAt: '2026-04-17T09:15:00.000Z',
    };

    const mapped = mapMessageToUiMessage(message);

    expect(mapped.createdAt).toBe(date.formatDate(new Date(message.createdAt), 'HH:mm'));
  });

  it('formats older messages with date and time', () => {
    const message: Message = {
      id: 'message-1',
      userId: 'user-1',
      username: 'Anakin',
      message: 'Hello there',
      createdAt: '2026-04-15T09:15:00.000Z',
    };

    const mapped = mapMessageToUiMessage(message);

    expect(mapped.createdAt).toBe(date.formatDate(new Date(message.createdAt), 'DD.MM.YYYY HH:mm'));
  });
});
