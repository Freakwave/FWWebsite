import { beforeAll, describe, expect, it } from 'vitest';
import { simulationSequence, workflowNodes } from '../../src/js/data/workflow-nodes.js';
import { createPage } from './helpers/page.js';

const REQUIRED_FIELDS = ['kind', 'category', 'title', 'summary', 'owner', 'executor', 'trigger', 'mode', 'inputs', 'outputs', 'guardrails', 'notes'];

let document;

beforeAll(async () => {
  ({ document } = await createPage());
});

describe('workflow data and markup stay in sync', () => {
  it('has a node entry for every diagram node and vice versa', () => {
    const diagramKeys = [...document.querySelectorAll('#multiAgentSvg [data-node-key]')].map((node) => node.dataset.nodeKey);
    expect(diagramKeys.toSorted()).toEqual(Object.keys(workflowNodes).toSorted());
  });

  it('gives each node a matching element id and a kind', () => {
    for (const element of document.querySelectorAll('#multiAgentSvg [data-node-key]')) {
      expect(element.id).toBe(`node-${element.dataset.nodeKey}`);
      expect(element.dataset.kind).toBe(workflowNodes[element.dataset.nodeKey].kind);
    }
  });

  it('defines every required field on every node', () => {
    for (const [key, node] of Object.entries(workflowNodes)) {
      for (const field of REQUIRED_FIELDS) expect(node[field], `${key}.${field}`).toBeTruthy();
      expect(node.guardrails.length, key).toBeGreaterThan(0);
    }
  });

  it('keeps node data immutable', () => {
    expect(Object.isFrozen(workflowNodes)).toBe(true);
    expect(Object.isFrozen(workflowNodes.requirements.guardrails)).toBe(true);
  });

  it('only simulates nodes that exist in the diagram', () => {
    for (const key of simulationSequence) expect(document.getElementById(`node-${key}`), key).not.toBeNull();
  });

  it('has unique element ids across the page', () => {
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  it('keeps presentation out of the SVG', () => {
    expect(document.querySelectorAll('#multiAgentSvg style, #multiAgentSvg [style]')).toHaveLength(0);
  });
});
