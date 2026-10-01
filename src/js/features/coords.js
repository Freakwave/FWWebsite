import { byId, setText } from '../core/dom.js';

export function initCoords({ document }) {
  const canvas = byId(document, 'blueprintCanvasWrapper');
  const readout = byId(document, 'canvasCoords');

  canvas?.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = String(Math.round(event.clientX - rect.left)).padStart(4, '0');
    const y = String(Math.round(event.clientY - rect.top)).padStart(4, '0');
    setText(readout, `CANVAS_COORD: X:${x} Y:${y}`);
  });
}
