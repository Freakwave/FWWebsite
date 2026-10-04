import { createClickSound } from './core/audio.js';
import { createInitialState } from './core/state.js';
import { createToast } from './core/toast.js';
import { initCoords } from './features/coords.js';
import { initFilters } from './features/filters.js';
import { initInspector } from './features/inspector.js';
import { initModals } from './features/modals.js';
import { initReset } from './features/reset.js';
import { initSections } from './features/sections.js';
import { initSimulation } from './features/simulation.js';
import { initZoom } from './features/zoom.js';

export function initializeLandingPage(document = window.document, windowObject = window) {
  const state = createInitialState();
  const context = {
    document,
    windowObject,
    state,
    toast: createToast(document),
    playClick: createClickSound(windowObject),
  };

  const zoom = initZoom(context);
  const filters = initFilters(context);
  const inspector = initInspector(context);
  const modals = initModals(context);
  initSections(context);
  const simulation = initSimulation(context);
  initCoords(context);
  initReset({ ...context, zoom, filters });

  return { state, zoom, filters, inspector, modals, simulation };
}
