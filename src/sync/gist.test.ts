import { describe, expect, it, vi } from 'vitest';
import { GistClient } from './gist';
import { emptyState } from '../state/model';

function response(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); }

describe('GistClient', () => {
  it('creates a secret Gist and stores only the progress filename', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response({ id: 'abc', files: {} }));
    const client = new GistClient(fetcher); const state = emptyState('device');
    await client.create('token-value', state);
    expect(fetcher).toHaveBeenCalledWith('https://api.github.com/gists', expect.objectContaining({ method: 'POST' }));
    const [, init] = fetcher.mock.calls[0];
    const payload = JSON.parse(String(init?.body));
    expect(payload.public).toBe(false);
    expect(Object.keys(payload.files)).toEqual(['interview-prep-state.json']);
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer token-value', 'X-GitHub-Api-Version': '2022-11-28' });
  });
  it('finds the Gist by exact description and filename', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response([{ id: 'wanted', description: 'interview-prep-sync', files: { 'interview-prep-state.json': {} } }]));
    await expect(new GistClient(fetcher).find('t')).resolves.toMatchObject({ id: 'wanted' });
  });
  it('reads and patches state', async () => {
    const state = emptyState('device');
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(response({ files: { 'interview-prep-state.json': { content: JSON.stringify(state) } } })).mockResolvedValueOnce(response({ id: 'id' }));
    const client = new GistClient(fetcher);
    await expect(client.read('t', 'id')).resolves.toMatchObject({ deviceId: 'device' });
    await client.patch('t', 'id', state);
    expect(fetcher.mock.calls[1][0]).toBe('https://api.github.com/gists/id');
    expect(JSON.parse(String(fetcher.mock.calls[1][1]?.body)).files['interview-prep-state.json'].content).toContain('device');
  });
  it('maps auth, permission, missing and invalid statuses to useful messages', async () => {
    for (const [status, text] of [[401, 'Token expired'], [403, 'rate limit'], [404, 'not found'], [422, '422']] as const) {
      const client = new GistClient(vi.fn<typeof fetch>().mockResolvedValue(response({}, status)));
      await expect(client.read('t', 'id')).rejects.toThrow(new RegExp(text, 'i'));
    }
  });
  it('surfaces network failures without losing local state', async () => {
    const client = new GistClient(vi.fn<typeof fetch>().mockRejectedValue(new Error('offline')));
    await expect(client.read('t', 'id')).rejects.toThrow('offline');
  });
});
