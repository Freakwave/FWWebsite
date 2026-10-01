import { byId } from '../core/dom.js';

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.15;

export function initZoom({ document, state, playClick }) {
  const canvas = byId(document, 'blueprintCanvasWrapper');

  function setZoom(level) {
    state.zoom = Math.min(Math.max(level, MIN_ZOOM), MAX_ZOOM);
    if (canvas) canvas.style.transform = `scale(${state.zoom})`;
    return state.zoom;
  }

  byId(document, 'zoomInBtn')?.addEventListener('click', () => {
    playClick(720);
    setZoom(state.zoom + ZOOM_STEP);
  });
  byId(document, 'zoomOutBtn')?.addEventListener('click', () => {
    playClick(480);
    setZoom(state.zoom - ZOOM_STEP);
  });
  byId(document, 'zoomResetBtn')?.addEventListener('click', () => {
    playClick(580);
    setZoom(1);
  });

  return { setZoom };
}
