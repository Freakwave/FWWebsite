import { describe, expect, it } from 'vitest';
import { initModals } from '../../../src/js/features/modals.js';
import { createContext, createPage } from '../helpers/page.js';

async function setup() {
  const page = await createPage();
  const context = createContext(page);
  initModals(context);
  return { ...page, context };
}

describe('modals', () => {
  it('opens every modal from its trigger and closes it with the close button', async () => {
    const { document } = await setup();
    const triggers = [...document.querySelectorAll('[data-modal-target]')];
    expect(triggers.length).toBeGreaterThanOrEqual(5);
    for (const trigger of triggers) {
      const modal = document.getElementById(trigger.dataset.modalTarget);
      trigger.click();
      expect(modal.classList.contains('hidden')).toBe(false);
      modal.querySelector('[data-modal-close]').click();
      expect(modal.classList.contains('hidden')).toBe(true);
    }
  });

  it('closes on backdrop click but not on panel click', async () => {
    const { document } = await setup();
    const modal = document.getElementById('dossierModal');
    document.getElementById('navDossierBtn').click();
    modal.firstElementChild.click();
    expect(modal.classList.contains('hidden')).toBe(false);
    modal.click();
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  it('closes on Escape and stays silent when nothing is open', async () => {
    const { window, document, context } = await setup();
    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(context.playClick).not.toHaveBeenCalled();
    document.getElementById('navExpBtn').click();
    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.getElementById('experienceModal').classList.contains('hidden')).toBe(true);
  });
});
