import { byId, setText } from '../core/dom.js';

const VIEWS = {
  all: { label: 'ALL WORKFLOW LAYERS', message: 'All workflow layers visible.' },
  agents: { label: 'AUTONOMOUS AGENTS', message: 'Autonomous agent stages highlighted.' },
  advisory: { label: 'ADVISORY PATHS', message: 'Human advisory paths highlighted.' },
  human: { label: 'HUMAN CHECKPOINTS', message: 'Human checkpoints highlighted.' },
};

export function initFilters({ document, state, toast, playClick }) {
  const diagram = byId(document, 'multiAgentSvg');
  const buttons = [...document.querySelectorAll('[data-view-mode]')];

  function setView(mode) {
    if (!Object.hasOwn(VIEWS, mode)) return;
    state.currentView = mode;
    diagram?.setAttribute('data-view', mode);
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.viewMode === mode));
    });
    setText(byId(document, 'currentViewModeLabel'), `VIEW: ${VIEWS[mode].label}`);
    toast(VIEWS[mode].message);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      playClick(520, 'sine', 0.03);
      setView(button.dataset.viewMode);
    });
  });

  return { setView };
}
