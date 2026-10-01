import { describe, expect, it } from 'vitest';
import { initZoom } from '../../../src/js/features/zoom.js';
import { createContext, createPage } from '../helpers/page.js';

async function setup() {
  const page = await createPage();
  const context = createContext(page);
  return { ...page, context, zoom: initZoom(context), canvas: page.document.getElementById('blueprintCanvasWrapper') };
}

describe('zoom', () => {
  it('zooms in, out, and back to 1 with the toolbar buttons', async () => {
    const { document, context, canvas } = await setup();
    document.getElementById('zoomInBtn').click();
    expect(context.state.zoom).toBeCloseTo(1.15);
    expect(canvas.style.transform).toBe('scale(1.15)');
    document.getElementById('zoomOutBtn').click();
    document.getElementById('zoomOutBtn').click();
    expect(context.state.zoom).toBeCloseTo(0.85);
    document.getElementById('zoomResetBtn').click();
    expect(context.state.zoom).toBe(1);
  });

  it('clamps zoom to the supported range', async () => {
    const { zoom } = await setup();
    expect(zoom.setZoom(10)).toBe(1.6);
    expect(zoom.setZoom(0)).toBe(0.75);
  });
});
