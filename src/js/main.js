import { createClickSound } from './audio.js';
import { pipelineData } from './pipeline-data.js';
import { createInitialState } from './state.js';
import { createToast } from './toast.js';

const byId = (document, id) => document.getElementById(id);
const setText = (element, value) => {
  if (element) element.textContent = value;
};

export function initializeLandingPage(document = window.document, windowObject = window) {
  const state = createInitialState();
  const toast = createToast(document);
  const playClick = createClickSound(windowObject);
  const modalIds = ['experienceModal', 'agentTaxonomyModal', 'governanceModal', 'dossierModal', 'contactModal'];
  const modals = modalIds.map((id) => byId(document, id)).filter(Boolean);
  const closeModal = (modal) => {
    if (!modal) return;
    playClick(420);
    modal.classList.add('hidden');
  };
  const openModal = (modal) => {
    if (!modal) return;
    playClick(640);
    modal.classList.remove('hidden');
  };

  function setZoom(level) {
    state.zoom = Math.min(Math.max(level, 0.75), 1.6);
    const canvas = byId(document, 'blueprintCanvasWrapper');
    if (canvas) canvas.style.transform = `scale(${state.zoom})`;
    return state.zoom;
  }

  function setFilterMode(mode) {
    const modeButtons = {
      all: byId(document, 'viewAllBtn'),
      agents: byId(document, 'viewAgentsBtn'),
      loops: byId(document, 'viewLoopsBtn'),
      hitl: byId(document, 'viewHitlBtn'),
    };
    if (!Object.hasOwn(modeButtons, mode)) return;
    state.currentView = mode;
    playClick(520, 'sine', 0.03);
    const inactive = 'px-2.5 py-1 bg-parchment border border-blueprint-border text-neutral-800 hover:bg-neutral-200 transition-colors uppercase font-medium';
    const active = 'px-2.5 py-1 bg-drafting-ink text-white hover:bg-neutral-800 transition-colors uppercase font-medium shadow-xs';
    Object.entries(modeButtons).forEach(([key, button]) => {
      if (button) button.className = key === mode ? active : inactive;
    });

    const opacity = {
      all: ['1', '1', '1'],
      agents: ['1', '0.2', '0.25'],
      loops: ['0.25', '0.2', '1'],
      hitl: ['0.25', '1', '0.25'],
    }[mode];
    document.querySelectorAll('.agent-node').forEach((node) => { node.style.opacity = opacity[0]; });
    document.querySelectorAll('.hitl-node').forEach((node) => { node.style.opacity = opacity[1]; });
    document.querySelectorAll('.loop-element').forEach((node) => { node.style.opacity = opacity[2]; });
    const labels = {
      all: 'VIEW: ALL PIPELINE LAYERS',
      agents: 'VIEW: AUTONOMOUS AGENTS',
      loops: 'VIEW: FEEDBACK LOOPS',
      hitl: 'VIEW: HUMAN CHECKPOINTS (HITL)',
    };
    setText(byId(document, 'currentViewModeLabel'), labels[mode]);
    toast(({ all: 'All system layers visible.', agents: 'Autonomous agent synthesis nodes highlighted.', loops: 'Closed autonomous loops L-01, L-02, and L-03 highlighted.', hitl: 'Human-in-the-loop checkpoints highlighted.' })[mode]);
  }

  function setCalloutVisible(visible) {
    state.calloutVisible = visible;
    const badge = byId(document, 'inspectorBadge');
    const toggle = byId(document, 'toggleAlertBtn');
    if (badge) badge.style.display = visible ? 'block' : 'none';
    if (toggle) {
      toggle.textContent = `ALERT OVERLAY: ${visible ? 'ON' : 'OFF'}`;
      toggle.className = visible
        ? 'ml-1 px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 border border-blueprint-border font-bold text-[10px] uppercase transition-colors'
        : 'ml-1 px-2.5 py-1 bg-parchment text-neutral-800 border border-blueprint-border hover:bg-neutral-200 font-bold text-[10px] uppercase transition-colors';
    }
  }

  function resolveEscalation() {
    state.isResolved = !state.isResolved;
    playClick(state.isResolved ? 840 : 360, 'triangle', 0.08);
    const resolved = state.isResolved;
    const assignments = resolved ? {
      pathBlocked: 'none', cross: 'none', pathResolved: '1', stroke: '#008744', status: 'CLEARED',
      calloutClass: 'bg-gate-emerald text-white p-3.5 sm:p-4 shadow-2xl relative border-2 border-white select-text transition-colors duration-300',
      badge: 'HITL-02 RESOLVED : HUMAN LEAD APPROVED BYPASS',
      headline: 'FPGA REAL-TIME SHIM INJECTED // LOOP JITTER 0.88ms',
      subtext: 'Eric Giemsa approved the driver-level real-time thread priority bypass. HIL loop determinism restored. Release candidate unblocked.',
      impact: 'STATUS: GATE CLEARED // PIPELINE FLOWING', button: 'REVERT ESCALATION ↺',
      buttonClass: 'bg-white text-gate-emerald hover:bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/40',
      pipeline: 'CLEARED & FLOWING', jitter: '0.88ms (OPTIMAL)', retry: 'RESET (0/3)', toast: 'Escalation resolved: FPGA shim authorized, pipeline unblocked.',
    } : {
      pathBlocked: 'block', cross: 'inline', pathResolved: '0', stroke: '#ff3b00', status: 'HOLDING',
      calloutClass: 'bg-technical-orange text-white p-3.5 sm:p-4 shadow-2xl relative border-2 border-white select-text transition-colors duration-300',
      badge: 'HITL-02 ESCALATION : AUTONOMOUS RETRY LIMIT REACHED',
      headline: 'AGENT-05 HIL TIMING JITTER > 2.4ms (CURRENT: 2.84ms)',
      subtext: 'Dynamic QA harness reached the maximum 3 autonomous retries on Loop L-02. Human Product Owner & Technical Lead intervention required to approve FPGA real-time driver bypass.',
      impact: 'STATUS: HOLDING AT GATE', button: '[ RESOLVE ESCALATION ] ↵',
      buttonClass: 'bg-black text-white hover:bg-neutral-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/40',
      pipeline: 'BLOCKED AT HITL-02', jitter: '2.84ms (BUDGET: 2.0ms)', retry: '3/3 EXHAUSTED', toast: 'Pipeline reverted to blocked escalation state.',
    };

    const setStyle = (id, key, value) => { const element = byId(document, id); if (element) element.style[key] = value; };
    setStyle('path-blocked-link', 'display', assignments.pathBlocked);
    setStyle('blockedCrossX', 'display', assignments.cross);
    setStyle('path-resolved-link', 'opacity', assignments.pathResolved);
    ['rectAgent05', 'rectHitl02'].forEach((id) => setStyle(id, 'stroke', assignments.stroke));
    ['headerHitl02', 'pillHitl02'].forEach((id) => setStyle(id, 'fill', assignments.stroke));
    setText(byId(document, 'statusHitl02'), assignments.status);
    const callout = byId(document, 'calloutCardInner');
    if (callout) callout.className = assignments.calloutClass;
    setText(byId(document, 'calloutBadgeHeader'), assignments.badge);
    setText(byId(document, 'calloutHeadline'), assignments.headline);
    setText(byId(document, 'calloutSubtext'), assignments.subtext);
    setText(byId(document, 'calloutImpactMetric'), assignments.impact);
    const resolveButton = byId(document, 'resolveEscalationBtn');
    if (resolveButton) {
      resolveButton.textContent = assignments.button;
      resolveButton.className = assignments.buttonClass;
    }
    setText(byId(document, 'hudPipelineStatus'), assignments.pipeline);
    setText(byId(document, 'hudJitterValue'), assignments.jitter);
    setText(byId(document, 'hudRetryBudget'), assignments.retry);
    const hudClass = `font-bold ${resolved ? 'text-gate-emerald' : 'text-technical-orange'}`;
    ['hudPipelineStatus', 'hudJitterValue'].forEach((id) => { const node = byId(document, id); if (node) node.className = hudClass; });
    const retry = byId(document, 'hudRetryBudget');
    if (retry) retry.className = resolved ? hudClass : 'font-bold text-neutral-800';
    pipelineData['hitl-02'].status = resolved ? 'GATE CLEARED // APPROVED' : 'HOLDING (ESCALATED)';
    pipelineData['hitl-02'].statusColor = resolved ? 'text-gate-emerald' : 'text-technical-orange';
    pipelineData['agent-05'].status = resolved ? 'ALL TESTS PASSING' : 'HOLDING // JITTER DETECTED';
    pipelineData['agent-05'].statusColor = resolved ? 'text-gate-emerald' : 'text-technical-orange';
    toast(assignments.toast);
  }

  function inspectNode(key) {
    const data = pipelineData[key];
    const drawer = byId(document, 'inspectorDrawer');
    if (!data || !drawer) return;
    state.selectedNodeKey = key;
    const fields = {
      inspectorCategory: data.category,
      inspectorNodeTitle: data.title,
      inspectorNodeDesc: data.desc,
      inspectorOwner: data.owner,
      inspectorEngine: data.engine,
      inspectorSla: data.sla,
      inspectorStatus: data.status,
      inspectorInputs: data.inputs,
      inspectorOutputs: data.outputs,
      inspectorNotes: data.notes,
    };
    Object.entries(fields).forEach(([id, value]) => setText(byId(document, id), value));
    const status = byId(document, 'inspectorStatus');
    if (status) status.className = `font-bold ${data.statusColor}`;
    const criteria = byId(document, 'inspectorCriteriaList');
    if (criteria) {
      criteria.replaceChildren(...data.criteria.map((criterion) => {
        const item = document.createElement('li');
        item.textContent = criterion;
        return item;
      }));
    }
    playClick(680, 'triangle', 0.04);
    drawer.classList.remove('translate-x-full');
    drawer.classList.remove('pointer-events-none');
  }

  windowObject.inspectNode = inspectNode;
  document.addEventListener('click', (event) => {
    const node = event.target.closest('[data-node-key]');
    if (node) inspectNode(node.dataset.nodeKey);
  });
  byId(document, 'dismissCalloutBtn')?.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    playClick(380, 'sine', 0.05);
    setCalloutVisible(false);
    toast('Escalation callout closed. Click "ALERT OVERLAY: OFF" in toolbar to restore.');
  });
  byId(document, 'toggleAlertBtn')?.addEventListener('click', () => {
    playClick(540, 'sine', 0.04);
    setCalloutVisible(!state.calloutVisible);
    toast(state.calloutVisible ? 'Escalation callout displayed.' : 'Escalation callout hidden.');
  });
  byId(document, 'resolveEscalationBtn')?.addEventListener('click', (event) => {
    event.stopPropagation();
    resolveEscalation();
  });
  byId(document, 'resetPipelineLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.isResolved) resolveEscalation();
    setCalloutVisible(true);
    setFilterMode('all');
    setZoom(1);
    toast('Multi-agent pipeline reset to baseline state.');
  });

  byId(document, 'viewAllBtn')?.addEventListener('click', () => setFilterMode('all'));
  byId(document, 'viewAgentsBtn')?.addEventListener('click', () => setFilterMode('agents'));
  byId(document, 'viewLoopsBtn')?.addEventListener('click', () => setFilterMode('loops'));
  byId(document, 'viewHitlBtn')?.addEventListener('click', () => setFilterMode('hitl'));
  byId(document, 'zoomInBtn')?.addEventListener('click', () => { playClick(720); setZoom(state.zoom + 0.15); });
  byId(document, 'zoomOutBtn')?.addEventListener('click', () => { playClick(480); setZoom(state.zoom - 0.15); });
  byId(document, 'zoomResetBtn')?.addEventListener('click', () => { playClick(580); setZoom(1); });
  byId(document, 'blueprintCanvasWrapper')?.addEventListener('mousemove', (event) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = String(Math.round(event.clientX - rect.left)).padStart(4, '0');
    const y = String(Math.round(event.clientY - rect.top)).padStart(4, '0');
    setText(byId(document, 'canvasCoords'), `CANVAS_COORD: X:${x} Y:${y}`);
  });

  const waypoints = [
    ['node-agent-01', 'agent-01', 30, 130], ['node-agent-01', 'agent-01', 122, 130],
    ['node-hitl-01', 'hitl-01', 295, 130], ['node-agent-02', 'agent-02', 475, 130],
    ['node-agent-03', 'agent-03', 675, 130], ['node-agent-04', 'agent-04', 875, 130],
    ['node-agent-05', 'agent-05', 1010, 185], ['node-agent-05', 'agent-05', 890, 280],
    ['node-hitl-02', 'hitl-02', 615, 280], ['node-agent-06', 'agent-06', 415, 280],
    ['node-hitl-03', 'hitl-03', 215, 280], ['node-deploy', 'deploy', 45, 280],
  ];
  const simulationButton = byId(document, 'runSimBtn');
  simulationButton?.addEventListener('click', () => {
    if (state.isSimulating) return;
    state.isSimulating = true;
    simulationButton.disabled = true;
    simulationButton.innerHTML = '<span>SIMULATING PACKET...</span>';
    simulationButton.classList.add('opacity-80');
    const packet = byId(document, 'simPacket');
    packet?.setAttribute('opacity', '1');
    toast('Transmitting simulated PRD work-package through multi-agent DAG...');
    let step = 0;
    const finish = () => {
      if (packet) packet.setAttribute('opacity', '0');
      state.isSimulating = false;
      simulationButton.disabled = false;
      simulationButton.innerHTML = '<span>▶ RUN PIPELINE SIMULATION</span>';
      simulationButton.classList.remove('opacity-80');
    };
    const advance = () => {
      if (step >= waypoints.length) {
        finish();
        toast('Simulation complete: Package safely ingested by global production runtime.');
        return;
      }
      const [id, key, x, y] = waypoints[step];
      packet?.setAttribute('cx', String(x));
      packet?.setAttribute('cy', String(y));
      const node = byId(document, id);
      node?.classList.add('node-executing');
      setTimeout(() => node?.classList.remove('node-executing'), 360);
      if (key === 'hitl-02' && !state.isResolved) {
        toast('Simulation blocked at HITL-02: Jitter limit exceeded! Resolve escalation to proceed.');
        setTimeout(() => {
          packet?.setAttribute('cx', '780');
          packet?.setAttribute('cy', '420');
          setTimeout(finish, 600);
        }, 900);
        return;
      }
      step += 1;
      setTimeout(advance, 240);
    };
    advance();
  });

  byId(document, 'closeDrawerBtn')?.addEventListener('click', () => {
    playClick(400);
    const drawer = byId(document, 'inspectorDrawer');
    drawer?.classList.add('translate-x-full', 'pointer-events-none');
  });
  byId(document, 'copyNodeSpecBtn')?.addEventListener('click', async () => {
    const data = pipelineData[state.selectedNodeKey];
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    try {
      if (windowObject.navigator.clipboard?.writeText) await windowObject.navigator.clipboard.writeText(json);
      else {
        const temporary = document.createElement('textarea');
        temporary.value = json;
        document.body.append(temporary);
        temporary.select();
        document.execCommand('copy');
        temporary.remove();
      }
      toast(`Copied ${state.selectedNodeKey.toUpperCase()} JSON schema to clipboard.`);
    } catch {
      toast(`Spec ready for ${state.selectedNodeKey.toUpperCase()}.`);
    }
  });

  const modalOpeners = {
    navExpBtn: 'experienceModal',
    navAgentTaxonomyBtn: 'agentTaxonomyModal',
    navGovernanceBtn: 'governanceModal',
    navDossierBtn: 'dossierModal',
    openDossierBtn: 'dossierModal',
    navContactBtn: 'contactModal',
  };
  Object.entries(modalOpeners).forEach(([buttonId, modalId]) => {
    byId(document, buttonId)?.addEventListener('click', () => openModal(byId(document, modalId)));
  });
  byId(document, 'brandResetBtn')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.isResolved) resolveEscalation();
    setCalloutVisible(true);
    setFilterMode('all');
    setZoom(1);
    toast('GIEMSA Architectural Console reset.');
  });
  document.querySelectorAll('.closeModalBtn').forEach((button) => {
    button.addEventListener('click', (event) => closeModal(event.target.closest('.fixed')));
  });
  windowObject.addEventListener('click', (event) => {
    if (modals.includes(event.target)) closeModal(event.target);
  });
  windowObject.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modals.forEach((modal) => closeModal(modal));
  });
  byId(document, 'contactForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const organization = byId(document, 'formOrg')?.value ?? '';
    const email = byId(document, 'formEmail')?.value ?? '';
    closeModal(byId(document, 'contactModal'));
    event.currentTarget.reset();
    toast(`Inquiry for Eric Giemsa logged from ${organization} (${email}). You will be contacted shortly.`);
  });

  return { state, setFilterMode, setZoom, resolveEscalation, inspectNode, openModal, closeModal };
}

if (byId(document, 'blueprintCanvasWrapper')) initializeLandingPage();
