import { beforeEach, describe, expect, it } from 'vitest';
import { initializeLandingPage } from '../../src/js/main.js';

function addFixture() {
  document.body.innerHTML = `
    <button id="viewAllBtn"></button><button id="viewAgentsBtn"></button><button id="viewLoopsBtn"></button><button id="viewHitlBtn"></button>
    <span id="currentViewModeLabel"></span><div class="agent-node"></div><div class="hitl-node"></div><div class="loop-element"></div>
    <button id="zoomInBtn"></button><button id="zoomOutBtn"></button><button id="zoomResetBtn"></button><div id="blueprintCanvasWrapper"></div>
    <button id="toggleAlertBtn"></button><div id="inspectorBadge"></div><button id="dismissCalloutBtn"></button>
    <button id="resolveEscalationBtn"></button><div id="path-blocked-link"></div><div id="blockedCrossX"></div><div id="path-resolved-link"></div>
    <div id="rectAgent05"></div><div id="rectHitl02"></div><div id="headerHitl02"></div><div id="pillHitl02"></div><span id="statusHitl02"></span>
    <div id="calloutCardInner"></div><span id="calloutBadgeHeader"></span><span id="calloutHeadline"></span><span id="calloutSubtext"></span><span id="calloutImpactMetric"></span>
    <span id="hudPipelineStatus"></span><span id="hudJitterValue"></span><span id="hudRetryBudget"></span>
    <div id="toastNotification" class="opacity-0"><span id="toastMessage"></span></div>
    <div id="inspectorDrawer" class="translate-x-full"></div><span id="inspectorCategory"></span><span id="inspectorNodeTitle"></span>
    <span id="inspectorNodeDesc"></span><span id="inspectorOwner"></span><span id="inspectorEngine"></span><span id="inspectorSla"></span>
    <span id="inspectorStatus"></span><span id="inspectorInputs"></span><span id="inspectorOutputs"></span><span id="inspectorNotes"></span><ul id="inspectorCriteriaList"></ul>
    <button id="navExpBtn"></button><div id="experienceModal" class="hidden fixed"><button class="closeModalBtn"></button></div>
  `;
}

let app;
beforeEach(() => {
  addFixture();
  app = initializeLandingPage(document, window);
});

describe('landing page interactions', () => {
  it('changes layer filters and highlights only requested SVG groups', () => {
    document.getElementById('viewAgentsBtn').click();
    expect(app.state.currentView).toBe('agents');
    expect(document.getElementById('currentViewModeLabel').textContent).toContain('AUTONOMOUS AGENTS');
    expect(document.querySelector('.agent-node').style.opacity).toBe('1');
    expect(document.querySelector('.hitl-node').style.opacity).toBe('0.2');
  });

  it('clamps zoom and resets to the default scale', () => {
    expect(app.setZoom(10)).toBe(1.6);
    expect(document.getElementById('blueprintCanvasWrapper').style.transform).toBe('scale(1.6)');
    expect(app.setZoom(0)).toBe(0.75);
    document.getElementById('zoomResetBtn').click();
    expect(app.state.zoom).toBe(1);
  });

  it('toggles the alert and resolves the escalation gate', () => {
    document.getElementById('dismissCalloutBtn').click();
    expect(document.getElementById('inspectorBadge').style.display).toBe('none');
    document.getElementById('toggleAlertBtn').click();
    expect(document.getElementById('inspectorBadge').style.display).toBe('block');
    document.getElementById('resolveEscalationBtn').click();
    expect(app.state.isResolved).toBe(true);
    expect(document.getElementById('statusHitl02').textContent).toBe('CLEARED');
    expect(document.getElementById('path-blocked-link').style.display).toBe('none');
  });

  it('opens and closes modals from navigation and close controls', () => {
    document.getElementById('navExpBtn').click();
    expect(document.getElementById('experienceModal').classList.contains('hidden')).toBe(false);
    document.querySelector('.closeModalBtn').click();
    expect(document.getElementById('experienceModal').classList.contains('hidden')).toBe(true);
  });

  it('opens a node drawer and fills its technical specification', () => {
    app.inspectNode('agent-01');
    expect(document.getElementById('inspectorNodeTitle').textContent).toContain('AGENT-01');
    expect(document.getElementById('inspectorDrawer').classList.contains('translate-x-full')).toBe(false);
  });
});
