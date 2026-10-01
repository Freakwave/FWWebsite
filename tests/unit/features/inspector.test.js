import { describe, expect, it, vi } from 'vitest';
import { initInspector } from '../../../src/js/features/inspector.js';
import { createContext, createPage } from '../helpers/page.js';

async function setup() {
  const page = await createPage();
  const context = createContext(page);
  return { ...page, context, inspector: initInspector(context), drawer: page.document.getElementById('inspectorDrawer') };
}

const field = (document, name) => document.querySelector(`[data-field="${name}"]`).textContent;

describe('inspector drawer', () => {
  it('shows the selected node specification', async () => {
    const { document, context, inspector, drawer } = await setup();
    expect(inspector.inspectNode('requirements')).toBe(true);
    expect(context.state.selectedNodeKey).toBe('requirements');
    expect(field(document, 'title')).toBe('Requirements Agent');
    expect(drawer.querySelectorAll('[data-field-list="guardrails"] li')).toHaveLength(3);
    expect(drawer.classList.contains('translate-x-full')).toBe(false);
  });

  it('ignores unknown node keys', async () => {
    const { context, inspector } = await setup();
    expect(inspector.inspectNode('missing')).toBe(false);
    expect(context.state.selectedNodeKey).toBeNull();
  });

  it('opens from a diagram node click and keyboard activation, and closes again', async () => {
    const { window, document, drawer } = await setup();
    document.getElementById('node-architect').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(field(document, 'title')).toBe('System Architect');
    document.getElementById('node-release').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(field(document, 'title')).toBe('Docs & release package');
    document.getElementById('closeDrawerBtn').click();
    expect(drawer.classList.contains('translate-x-full')).toBe(true);
  });

  it('copies the node specification as JSON', async () => {
    const { window, document, context, inspector } = await setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true });
    inspector.inspectNode('architect');
    document.getElementById('copyNodeSpecBtn').click();
    await vi.waitFor(() => expect(context.toast).toHaveBeenCalledWith('Copied ARCHITECT JSON schema to clipboard.'));
    expect(JSON.parse(writeText.mock.calls[0][0]).key).toBe('architect');
  });
});
