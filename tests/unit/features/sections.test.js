import { describe, expect, it } from 'vitest';
import { initializeLandingPage } from '../../../src/js/app.js';
import { createPage } from '../helpers/page.js';

describe('portfolio sections', () => {
  it('shows the selected section and supports keyboard navigation', async () => {
    const { window, document } = await createPage();
    initializeLandingPage(document, window);

    const aiTab = document.getElementById('tab-ai');
    const projectTab = document.getElementById('tab-project-management');
    const rescueTab = document.getElementById('tab-rescue-dogs');

    expect(aiTab.getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('panel-ai').hidden).toBe(false);
    expect(document.getElementById('panel-project-management').hidden).toBe(true);

    projectTab.click();
    expect(projectTab.getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('panel-project-management').hidden).toBe(false);
    expect(document.getElementById('panel-ai').hidden).toBe(true);

    projectTab.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(rescueTab.getAttribute('aria-selected')).toBe('true');
    expect(rescueTab.tabIndex).toBe(0);
  });
});
