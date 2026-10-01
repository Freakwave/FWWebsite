import { byId, setText } from '../core/dom.js';

export function initReset({ document, state, toast, zoom, filters }) {
  function resetView() {
    filters.setView('all');
    zoom.setZoom(1);
    setText(byId(document, 'simStatus'), 'IDLE');
    toast('Workflow view reset to baseline.');
  }

  document.querySelectorAll('[data-action="reset-view"]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (!state.isSimulating) resetView();
    });
  });

  return { resetView };
}
