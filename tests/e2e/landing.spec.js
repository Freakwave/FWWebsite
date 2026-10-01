import { expect, test } from '@playwright/test';

test('landing page loads and exposes key interactions', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/GIEMSA/);
  await expect(page.getByRole('heading', { name: /AUTONOMOUS AGENT WORKFLOWS/i })).toBeVisible();

  await page.getByRole('button', { name: /CAREER_TRACK/i }).click();
  await expect(page.locator('#experienceModal')).toBeVisible();
  await page.locator('#experienceModal .closeModalBtn').click();
  await expect(page.locator('#experienceModal')).toBeHidden();

  await page.locator('#viewAgentsBtn').click();
  await expect(page.locator('#currentViewModeLabel')).toContainText('AUTONOMOUS AGENTS');
  await page.locator('#dismissCalloutBtn').click();
  await expect(page.locator('#inspectorBadge')).toBeHidden();

  await page.locator('#node-agent-01').click();
  await expect(page.locator('#inspectorNodeTitle')).toContainText('AGENT-01');
  await page.locator('#closeDrawerBtn').click();
  await expect(page.locator('#inspectorDrawer')).toHaveClass(/translate-x-full/);

  await page.locator('#toggleAlertBtn').click();
  await page.locator('#resolveEscalationBtn').click();
  await expect(page.locator('#hudPipelineStatus')).toContainText('CLEARED');
  await page.locator('#resolveEscalationBtn').click();

  await expect(page.locator('#navContactBtn')).toHaveCount(0);
  await expect(page.locator('#contactForm')).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test('supports a mobile viewport, zoom, and blocked simulation', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AUTONOMOUS AGENT WORKFLOWS/i })).toBeVisible();

  await page.locator('#zoomInBtn').click();
  await expect(page.locator('#blueprintCanvasWrapper')).toHaveCSS('transform', /matrix\(1\.15/);

  await page.locator('#runSimBtn').click();
  await expect(page.locator('#toastMessage')).toContainText('Transmitting simulated PRD');
  await expect(page.locator('#runSimBtn')).toBeEnabled({ timeout: 8_000 });
  await expect(page.locator('#toastMessage')).toContainText('Simulation blocked at HITL-02');
  await page.close();
});
