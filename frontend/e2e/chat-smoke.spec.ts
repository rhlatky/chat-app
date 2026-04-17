import { expect, test } from '@playwright/test';

test('user can join the room and send a message', async ({ page }) => {
  const username = `Anakin-${Date.now()}`;
  const message = `Hello there ${Date.now()}`;

  await page.goto('/');

  await page.locator('[data-testid="chat-join-username"] input').fill(username);
  await page.getByRole('button', { name: 'Enter room' }).click();

  await expect(page.getByTestId('online-users-list')).toBeVisible();
  await expect(page.getByText(username)).toBeVisible();

  const messageInput = page.locator('[data-testid="chat-message-input"] input');
  await messageInput.fill(message);
  await messageInput.press('Enter');

  await expect(page.getByText(message)).toBeVisible();
});
