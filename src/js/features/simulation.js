import { byId, setText } from '../core/dom.js';
import { simulationSequence, workflowNodes } from '../data/workflow-nodes.js';

const STEP_MS = 450;
const RUN_LABEL = '▶ Run workflow simulation';
const RUNNING_LABEL = 'Simulating…';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function centerOf(element) {
  if (typeof element?.getBBox !== 'function') return null;
  const box = element.getBBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export function initSimulation({ document, state, toast }) {
  const button = byId(document, 'runSimBtn');
  const packet = byId(document, 'simPacket');
  const status = byId(document, 'simStatus');

  function setRunning(running) {
    state.isSimulating = running;
    packet?.setAttribute('data-active', String(running));
    if (!button) return;
    button.disabled = running;
    button.textContent = running ? RUNNING_LABEL : RUN_LABEL;
  }

  async function visit(key) {
    const element = byId(document, `node-${key}`);
    const center = centerOf(element);
    if (center && packet) {
      packet.setAttribute('cx', String(center.x));
      packet.setAttribute('cy', String(center.y));
    }
    setText(status, `RUNNING: ${workflowNodes[key].title.toUpperCase()}`);
    element?.classList.add('node-executing');
    await wait(STEP_MS);
    element?.classList.remove('node-executing');
  }

  async function run() {
    if (state.isSimulating) return;
    setRunning(true);
    toast('Transmitting simulated work-package through the staged agent workflow...');
    try {
      for (const key of simulationSequence) await visit(key);
      setText(status, 'COMPLETE');
      toast('Simulation complete: approved release prepared for staging.');
    } finally {
      setRunning(false);
    }
  }

  button?.addEventListener('click', run);

  return { run };
}
