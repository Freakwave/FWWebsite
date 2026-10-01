import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { expandIncludes } from '../../build/html-partials.js';

async function createRoot(files) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'partials-'));
  for (const [name, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), content);
  }
  return root;
}

describe('expandIncludes', () => {
  it('expands nested includes and repeated includes', async () => {
    const root = await createRoot({ 'a.html': '<b><!-- @include c.html --></b>', 'c.html': 'x' });
    const html = await expandIncludes('<!-- @include a.html --><!-- @include a.html -->', root);
    expect(html).toBe('<b>x</b><b>x</b>');
  });

  it('keeps dollar signs from partial content untouched', async () => {
    const root = await createRoot({ 'a.html': '$& $1 $$100M' });
    expect(await expandIncludes('<!-- @include a.html -->', root)).toBe('$& $1 $$100M');
  });

  it('rejects circular includes', async () => {
    const root = await createRoot({ 'a.html': '<!-- @include b.html -->', 'b.html': '<!-- @include a.html -->' });
    await expect(expandIncludes('<!-- @include a.html -->', root)).rejects.toThrow(/Circular/);
  });

  it('rejects includes outside the project root', async () => {
    const root = await createRoot({ 'a.html': 'x' });
    await expect(expandIncludes('<!-- @include ../secret.html -->', root)).rejects.toThrow(/escapes project root/);
  });
});
