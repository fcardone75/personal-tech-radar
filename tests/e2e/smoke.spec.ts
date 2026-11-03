import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

interface Entry {
  id: string;
  name: string;
  ring: string;
}

const radar = JSON.parse(readFileSync(new URL('../../src/data/radar.json', import.meta.url), 'utf8')) as { entries: Entry[] };
const total = radar.entries.length;
const holdCount = radar.entries.filter((e) => e.ring === 'hold').length;

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    // Web fonts are external: ignore them when the test machine is offline.
    if (/fonts\.(googleapis|gstatic)\.com/.test(message.location().url)) return;
    errors.push(message.text());
  });
  return errors;
}

test('the radar loads, opens an entry, filters and searches', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Technology is a choice.');
  await expect(page.getByTestId('blip')).toHaveCount(total);

  // Selecting an entry opens its details and puts it in the URL.
  const firstItem = page.getByTestId('legend-item').first();
  const name = (await firstItem.locator('.legend-name').innerText()).trim();
  await firstItem.click();
  await expect(page.getByTestId('detail-panel')).toContainText(name);
  await expect(page).toHaveURL(/#[a-z0-9-]+$/);
  await page.getByRole('button', { name: 'Close and show the radar key' }).click();
  await expect(page.getByTestId('detail-panel')).toContainText('How to read the rings');

  // A ring filter dims everything outside the ring.
  await page.getByRole('button', { name: /^Hold\b/ }).click();
  await expect(page.locator('[data-testid="blip"][data-dimmed="false"]')).toHaveCount(holdCount);

  // A search with no results says so.
  await page.getByRole('button', { name: /^All\b/ }).click();
  await page.getByLabel('Search technologies').fill('zzzz-no-match');
  await expect(page.getByRole('status')).toContainText('No technologies match');

  expect(errors).toEqual([]);
});

test('a shared link opens that entry', async ({ page }) => {
  const errors = collectErrors(page);
  const entry = radar.entries[0];
  await page.goto(`./#${entry.id}`);
  await expect(page.getByTestId('detail-panel')).toContainText(entry.name);
  expect(errors).toEqual([]);
});

test('the list view shows every entry', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await expect(page.getByTestId('list-row')).toHaveCount(total);
});
