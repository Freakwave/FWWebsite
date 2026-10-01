import { agentNodes } from './agent-nodes.js';
import { humanNodes } from './human-nodes.js';
import { supportNodes } from './support-nodes.js';

function deepFreeze(value) {
  Object.values(value).forEach((child) => {
    if (typeof child === 'object' && child !== null) deepFreeze(child);
  });
  return Object.freeze(value);
}

export const workflowNodes = deepFreeze({ ...humanNodes, ...agentNodes, ...supportNodes });

/** Order in which the simulation packet visits nodes. The advisor is on demand and not part of the happy path. */
export const simulationSequence = Object.freeze([
  'human-goal', 'requirements', 'architect', 'tasks', 'orchestrator',
  'dev-backend', 'dev-frontend', 'dev-domain',
  'pr-agent', 'qa-tests', 'qa-security', 'dossier',
  'human-gate', 'release', 'staging',
]);
