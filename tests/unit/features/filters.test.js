import { describe, expect, it } from 'vitest';
import { initFilters } from '../../../src/js/features/filters.js';
import { createContext, createPage } from '../helpers/page.js';

async function setup() {
  const page = await createPage();
  const context = createContext(page);
  return { ...page, context, filters: initFilters(context), diagram: page.document.getElementById('multiAgentSvg') };
}

describe('view filters', () => {
  it('switches the diagram view, pressed button, and label', async () => {
    const { document, context, diagram } = await setup();
    document.getElementById('viewAdvisoryBtn').click();
    expect(context.state.currentView).toBe('advisory');
    expect(diagram.dataset.view).toBe('advisory');
    expect(document.getElementById('viewAdvisoryBtn').getAttribute('aria-pressed')).toBe('true');
    expect(document.getElementById('viewAllBtn').getAttribute('aria-pressed')).toBe('false');
    expect(document.getElementById('currentViewModeLabel').textContent).toContain('ADVISORY PATHS');
    expect(context.toast).toHaveBeenCalledWith('Human advisory paths highlighted.');
  });

  it('supports every toolbar mode and ignores unknown modes', async () => {
    const { document, context, filters, diagram } = await setup();
    for (const button of document.querySelectorAll('[data-view-mode]')) {
      button.click();
      expect(diagram.dataset.view).toBe(button.dataset.viewMode);
    }
    filters.setView('unknown');
    expect(context.state.currentView).toBe('human');
  });
});
