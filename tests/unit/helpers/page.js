import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { vi } from 'vitest';
import { expandIncludes } from '../../../build/html-partials.js';
import { createInitialState } from '../../../src/js/core/state.js';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

/** Builds the real landing page (all partials expanded) in an isolated jsdom window. */
export async function createPage() {
  const source = await readFile(path.join(projectRoot, 'architectural_landing_page.html'), 'utf8');
  const { window } = new JSDOM(await expandIncludes(source, projectRoot));
  return { window, document: window.document };
}

export function createContext({ window, document }) {
  return {
    document,
    windowObject: window,
    state: createInitialState(),
    toast: vi.fn(),
    playClick: vi.fn(),
  };
}
