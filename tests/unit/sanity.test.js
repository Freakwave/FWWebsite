import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('provides a DOM environment for UI tests', () => {
    const element = document.createElement('button');
    element.textContent = 'ready';
    document.body.append(element);
    expect(document.body.textContent).toContain('ready');
    element.remove();
  });
});
