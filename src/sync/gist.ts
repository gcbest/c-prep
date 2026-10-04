import { mergeIntoLocal, hasUnsyncedRecords, type AppState, TOKEN_KEY } from '../state/model';

export const GIST_ID_KEY = 'citi-prep-gist-id';
const API = 'https://api.github.com';
const FILENAME = 'interview-prep-state.json';
const DESCRIPTION = 'interview-prep-sync';
const API_VERSION = '2022-11-28';
export type SyncStatus = { state: 'idle' | 'syncing' | 'synced' | 'error'; message: string; syncedAt?: string };
export type GistSummary = { id: string; description?: string; files: Record<string, unknown> };

export class GistClient {
  constructor(private fetcher: typeof fetch = fetch) {}
  private async request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
    const response = await this.fetcher(`${API}${path}`, {
      ...init,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': API_VERSION, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    });
    if (!response.ok) {
      const message = response.status === 401 ? 'Token expired or revoked - paste a new one.' : response.status === 403 || response.status === 429 ? 'GitHub rate limit or permissions issue. Wait a bit, then retry.' : response.status === 404 ? 'Sync Gist not found. Check the Gist ID or create a new one.' : `GitHub sync failed (${response.status}).`;
      throw Object.assign(new Error(message), { status: response.status });
    }
    return response.json() as Promise<T>;
  }
  create(token: string, state: AppState) {
    return this.request<GistSummary>('/gists', token, { method: 'POST', body: JSON.stringify({ description: DESCRIPTION, public: false, files: { [FILENAME]: { content: JSON.stringify(state, null, 2) } } }) });
  }
  async find(token: string) {
    let page = 1;
    while (page <= 10) {
      const gists = await this.request<GistSummary[]>(`/gists?per_page=100&page=${page}`, token);
      const match = gists.find(gist => gist.description === DESCRIPTION && Boolean(gist.files?.[FILENAME]));
      if (match) return match;
      if (gists.length < 100) break;
      page++;
    }
    throw new Error('No interview-prep-sync Gist found for this token. Create it on your first device.');
  }
  async read(token: string, gistId: string): Promise<AppState> {
    const gist = await this.request<{ files: Record<string, { content?: string; raw_url?: string; truncated?: boolean }> }>(`/gists/${encodeURIComponent(gistId)}`, token);
    const file = gist.files?.[FILENAME];
    if (!file) throw new Error('Sync file is missing from this Gist.');
    let content = file.content;
    if (file.truncated && file.raw_url) {
      const response = await this.fetcher(file.raw_url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.raw' } });
      if (!response.ok) throw new Error('Could not download the full sync file.');
      content = await response.text();
    }
    if (!content) throw new Error('Sync Gist is empty.');
    return JSON.parse(content) as AppState;
  }
  patch(token: string, gistId: string, state: AppState, keepalive = false) {
    return this.request<GistSummary>(`/gists/${encodeURIComponent(gistId)}`, token, { method: 'PATCH', keepalive, body: JSON.stringify({ files: { [FILENAME]: { content: JSON.stringify(state, null, 2) } } }) });
  }
}

export class SyncManager {
  private timer?: ReturnType<typeof setTimeout>;
  private busy = false;
  private listeners = new Set<(status: SyncStatus) => void>();
  private currentStatus: SyncStatus = { state: 'idle', message: 'Not connected' };
  constructor(private getState: () => AppState, private setState: (state: AppState) => void, private client = new GistClient()) {}
  get status() { return this.currentStatus; }
  subscribe(listener: (status: SyncStatus) => void) { this.listeners.add(listener); listener(this.currentStatus); return () => { this.listeners.delete(listener); }; }
  private setStatus(status: SyncStatus) { this.currentStatus = status; this.listeners.forEach(listener => listener(status)); }
  private credentials() {
    const token = localStorage.getItem(TOKEN_KEY); const gistId = localStorage.getItem(GIST_ID_KEY);
    if (!token || !gistId) throw new Error('Connect a GitHub token and sync Gist in Settings first.');
    return { token, gistId };
  }
  async createGist(token: string, state: AppState) { const gist = await this.client.create(token, state); localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(GIST_ID_KEY, gist.id); return gist.id; }
  async findGist(token: string) { const gist = await this.client.find(token); localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(GIST_ID_KEY, gist.id); return gist.id; }
  disconnect() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(GIST_ID_KEY); this.setStatus({ state: 'idle', message: 'Sync disconnected' }); }
  async sync(options: { keepalive?: boolean; force?: 'pull' | 'push' } = {}) {
    if (this.busy) return;
    this.busy = true; this.setStatus({ state: 'syncing', message: 'Syncing…' });
    try {
      const { token, gistId } = this.credentials();
      let local = this.getState();
      if (options.force === 'push') {
        await this.client.patch(token, gistId, local, options.keepalive); local = this.getState();
      } else {
        const remote = await this.client.read(token, gistId);
        if (remote.schemaVersion > local.schemaVersion) throw new Error('This sync has a newer schema. Reload the latest version before syncing.');
        if (options.force === 'pull') local = remote;
        else local = mergeIntoLocal(local, remote);
        this.setState(local);
        if (options.force !== 'pull' && hasUnsyncedRecords(local, remote)) await this.client.patch(token, gistId, local, options.keepalive);
      }
      if (!options.force) {
        // Gist PATCH is not conditional. Verify the merge and make one bounded repair attempt.
        let hasUnresolvedRace = false;
        for (let attempt = 0; attempt <= 2; attempt++) {
          const check = await this.client.read(token, gistId);
          local = mergeIntoLocal(local, check); this.setState(local);
          hasUnresolvedRace = hasUnsyncedRecords(local, check);
          if (!hasUnresolvedRace) break;
          if (attempt === 2) break;
          await this.client.patch(token, gistId, local, options.keepalive);
        }
        if (hasUnresolvedRace) throw new Error('Sync changed concurrently on another device. Local changes are safe; try Sync now again shortly.');
      }
      const syncedAt = new Date().toISOString();
      this.setStatus({ state: 'synced', message: `Synced ${new Date(syncedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`, syncedAt });
    } catch (error) {
      this.setStatus({ state: 'error', message: error instanceof Error ? error.message : 'Sync failed. Local progress is safe.' });
    } finally { this.busy = false; }
  }
  schedule() { clearTimeout(this.timer); this.timer = setTimeout(() => void this.sync(), 10_000); }
  start() {
    void this.sync();
    const focus = () => void this.sync(); const online = () => void this.sync();
    const hidden = () => { if (document.visibilityState === 'hidden') void this.sync({ keepalive: true }); };
    window.addEventListener('focus', focus); window.addEventListener('online', online); document.addEventListener('visibilitychange', hidden);
    return () => { clearTimeout(this.timer); window.removeEventListener('focus', focus); window.removeEventListener('online', online); document.removeEventListener('visibilitychange', hidden); };
  }
}

export function isSyncConnected() { return Boolean(localStorage.getItem(TOKEN_KEY) && localStorage.getItem(GIST_ID_KEY)); }
