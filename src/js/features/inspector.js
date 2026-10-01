import { byId, setText } from '../core/dom.js';
import { workflowNodes } from '../data/workflow-nodes.js';

const MODE_COLORS = { human: 'text-human', agent: 'text-hitl-blue', support: 'text-neutral-700' };
const HIDDEN_CLASSES = ['translate-x-full', 'pointer-events-none'];

async function writeClipboard(windowObject, document, text) {
  if (windowObject.navigator.clipboard?.writeText) {
    await windowObject.navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  document.body.append(field);
  field.select();
  document.execCommand('copy');
  field.remove();
}

export function initInspector({ document, windowObject, state, toast, playClick }) {
  const drawer = byId(document, 'inspectorDrawer');

  function render(node) {
    drawer.querySelectorAll('[data-field]').forEach((element) => {
      setText(element, node[element.dataset.field]);
    });
    drawer.querySelector('[data-field="mode"]').className = `font-bold ${MODE_COLORS[node.kind]}`;
    drawer.querySelector('[data-field-list="guardrails"]').replaceChildren(
      ...node.guardrails.map((text) => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }),
    );
  }

  function inspectNode(key) {
    const node = workflowNodes[key];
    if (!node || !drawer) return false;
    state.selectedNodeKey = key;
    render(node);
    playClick(680, 'triangle', 0.04);
    drawer.classList.remove(...HIDDEN_CLASSES);
    return true;
  }

  function closeDrawer() {
    playClick(400);
    drawer?.classList.add(...HIDDEN_CLASSES);
  }

  async function copySpec() {
    const key = state.selectedNodeKey;
    if (!key) return;
    const label = key.toUpperCase();
    try {
      await writeClipboard(windowObject, document, JSON.stringify({ key, ...workflowNodes[key] }, null, 2));
      toast(`Copied ${label} JSON schema to clipboard.`);
    } catch {
      toast(`Spec ready for ${label}.`);
    }
  }

  document.addEventListener('click', (event) => {
    const node = event.target.closest('[data-node-key]');
    if (node) inspectNode(node.dataset.nodeKey);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const node = event.target.closest?.('[data-node-key]');
    if (!node) return;
    event.preventDefault();
    inspectNode(node.dataset.nodeKey);
  });
  byId(document, 'closeDrawerBtn')?.addEventListener('click', closeDrawer);
  byId(document, 'copyNodeSpecBtn')?.addEventListener('click', copySpec);

  return { inspectNode, closeDrawer };
}
