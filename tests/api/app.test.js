import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../server/app.js';

describe('Express application', () => {
  let staticDirectory;
  let app;

  beforeEach(async () => {
    staticDirectory = await mkdtemp(path.join(os.tmpdir(), 'fwwebsite-'));
    await writeFile(path.join(staticDirectory, 'architectural_landing_page.html'), '<!doctype html><title>GIEMSA</title>');
    await mkdir(path.join(staticDirectory, 'assets'));
    await writeFile(path.join(staticDirectory, 'assets', 'site.js'), 'export default true;');
    await writeFile(path.join(staticDirectory, 'assets', 'site-12345678.js'), 'export default true;');
    app = createApp({ staticDirectory });
  });

  afterEach(async () => {
    await rm(staticDirectory, { recursive: true, force: true });
  });

  it('serves the landing page at /', async () => {
    const response = await request(app).get('/').expect(200);
    expect(response.text).toContain('<title>GIEMSA</title>');
  });

  it('exposes a health check', async () => {
    await request(app).get('/healthz').expect(200, { status: 'ok' });
  });

  it('serves static assets with security headers', async () => {
    const response = await request(app).get('/assets/site.js').expect(200);
    expect(response.text).toContain('export default true');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
  });

  it('caches only fingerprinted assets immutably', async () => {
    const regularAsset = await request(app).get('/assets/site.js').expect(200);
    const fingerprintedAsset = await request(app).get('/assets/site-12345678.js').expect(200);
    expect(regularAsset.headers['cache-control']).not.toContain('immutable');
    expect(fingerprintedAsset.headers['cache-control']).toContain('max-age=31536000');
    expect(fingerprintedAsset.headers['cache-control']).toContain('immutable');
  });

  it('returns JSON 404 for unknown resources', async () => {
    await request(app).get('/missing').expect(404, { error: 'Not found' });
  });
});
