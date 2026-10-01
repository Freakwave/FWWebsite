import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { simulationSequence } from '../../../src/js/data/workflow-nodes.js';
import { initSimulation } from '../../../src/js/features/simulation.js';
import { createContext, createPage } from '../helpers/page.js';

const STEP_MS = 450;

async function setup() {
  const page = await createPage();
  page.window.SVGElement.prototype.getBBox = () => ({ x: 10, y: 20, width: 100, height: 50 });
  const context = createContext(page);
  return { ...page, context, simulation: initSimulation(context) };
}

describe('simulation', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('highlights each node in sequence and then completes', async () => {
    const { document, context, simulation } = await setup();
    const button = document.getElementById('runSimBtn');
    const running = simulation.run();
    expect(context.state.isSimulating).toBe(true);
    expect(button.disabled).toBe(true);

    for (const key of simulationSequence) {
      expect(document.getElementById(`node-${key}`).classList.contains('node-executing'), key).toBe(true);
      await vi.advanceTimersByTimeAsync(STEP_MS);
    }
    await running;

    const packet = document.getElementById('simPacket');
    expect(packet.getAttribute('cx')).toBe('60');
    expect(packet.getAttribute('cy')).toBe('45');
    expect(packet.dataset.active).toBe('false');
    expect(document.getElementById('simStatus').textContent).toBe('COMPLETE');
    expect(document.querySelector('.node-executing')).toBeNull();
    expect(button.disabled).toBe(false);
    expect(context.state.isSimulating).toBe(false);
    expect(context.toast).toHaveBeenLastCalledWith('Simulation complete: approved release prepared for staging.');
  });

  it('ignores a second run while one is in progress', async () => {
    const { simulation, context } = await setup();
    const first = simulation.run();
    await simulation.run();
    await vi.runAllTimersAsync();
    await first;
    expect(context.toast).toHaveBeenCalledTimes(2);
  });

  it('still runs when the environment has no SVG geometry support', async () => {
    const { window, simulation, context } = await setup();
    delete window.SVGElement.prototype.getBBox;
    const running = simulation.run();
    await vi.runAllTimersAsync();
    await running;
    expect(context.state.isSimulating).toBe(false);
  });
});
