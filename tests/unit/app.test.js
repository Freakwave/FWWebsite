import { describe, expect, it } from 'vitest';
import { initializeLandingPage } from '../../src/js/app.js';
import { createPage } from './helpers/page.js';

describe('landing page wiring', () => {
  it('resets view and zoom from the reset links', async () => {
    const { window, document } = await createPage();
    const app = initializeLandingPage(document, window);
    document.getElementById('zoomInBtn').click();
    document.getElementById('viewAgentsBtn').click();
    document.getElementById('resetViewLink').click();
    expect(app.state.zoom).toBe(1);
    expect(app.state.currentView).toBe('all');
    expect(document.getElementById('multiAgentSvg').dataset.view).toBe('all');
    expect(document.getElementById('simStatus').textContent).toBe('IDLE');
  });

  it('updates the coordinate readout on mouse move', async () => {
    const { window, document } = await createPage();
    initializeLandingPage(document, window);
    document.getElementById('blueprintCanvasWrapper').dispatchEvent(
      new window.MouseEvent('mousemove', { clientX: 12, clientY: 7, bubbles: true }),
    );
    expect(document.getElementById('canvasCoords').textContent).toBe('CANVAS_COORD: X:0012 Y:0007');
  });
});
