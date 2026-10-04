import { expect, test } from '@playwright/test';

test('landing page loads and exposes key interactions', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page).toHaveTitle(/Human-Centered AI/i);
  await expect(page.getByRole('heading', { name: /AI SHOULD MAKE GOOD WORK CLEARER/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /What agent design teaches us about working together/i })).toBeVisible();
  await expect(page.getByText(/Designing for AI is applied organizational development/i)).toBeVisible();
  await expect(page.getByRole('tab', { name: 'AI' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'PROJECT MANAGEMENT' }).click();
  await expect(page.getByRole('tabpanel', { name: /PROJECT MANAGEMENT/i })).toContainText(/develop the stories and insights together later/i);
  await page.getByRole('tab', { name: 'RESCUE DOGS' }).click();
  await expect(page.getByRole('tabpanel', { name: /RESCUE DOG LEADERSHIP/i })).toContainText(/develop the content together later/i);
  await page.getByRole('tab', { name: 'AI' }).click();

  await page.getByRole('button', { name: /CAREER_TRACK/i }).click();
  await expect(page.locator('#experienceModal')).toBeVisible();
  await page.locator('#experienceModal [data-modal-close]').click();
  await expect(page.locator('#experienceModal')).toBeHidden();

  await page.locator('#viewAgentsBtn').click();
  await expect(page.locator('#currentViewModeLabel')).toContainText('AUTONOMOUS AGENTS');
  await expect(page.locator('#multiAgentSvg')).toHaveAttribute('data-view', 'agents');
  await expect(page.locator('#node-human-goal')).toHaveCSS('opacity', '0.25');
  await page.locator('#viewAllBtn').click();

  await page.locator('#node-requirements').click();
  await expect(page.locator('[data-field="title"]')).toContainText(/Requirements Agent/i);
  await page.locator('#closeDrawerBtn').click();
  await expect(page.locator('#inspectorDrawer')).toHaveClass(/translate-x-full/);

  await expect(page.locator('#navContactBtn')).toHaveCount(0);
  await expect(page.locator('#contactForm')).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test('renders the workflow diagram with unique ids and no legacy pipeline', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id));
  expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  await expect(page.locator('#multiAgentSvg [data-node-key]')).toHaveCount(17);
  await expect(page.locator('#node-human-gate')).toContainText('Acceptance & merge approval');
  await expect(page.locator('#node-hitl-01, #node-agent-01, #inspectorBadge')).toHaveCount(0);
});

test('supports a mobile viewport, zoom, and a full simulation run', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /AI SHOULD MAKE GOOD WORK CLEARER/i })).toBeVisible();

  await page.locator('#zoomInBtn').click();
  await expect(page.locator('#blueprintCanvasWrapper')).toHaveCSS('transform', /matrix\(1\.15/);

  await page.locator('#runSimBtn').click();
  await expect(page.locator('#toastMessage')).toContainText('Transmitting simulated work-package');
  await expect(page.locator('#runSimBtn')).toBeDisabled();
  await expect(page.locator('#runSimBtn')).toBeEnabled({ timeout: 15_000 });
  await expect(page.locator('#toastMessage')).toContainText('Simulation complete');
  await page.close();
});
