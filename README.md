# Citi Full-Stack Interview Prep

A calm, sequential study site for a Citi Enterprise Risk Technology Senior Full-Stack Developer interview. It focuses on SQL, Java/Spring (with an optional Python/FastAPI backend track), Angular/RxJS, testing, coding patterns, security, system design, and leadership stories.

## Run locally

Requires Node.js 22.12+ (Vite 8).

```sh
npm ci
npm run dev
```

Quality checks:

```sh
npm run typecheck
npm test -- --run
npm run build
```

## Deploy in 5 minutes

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
3. The workflow at `.github/workflows/deploy.yml` builds and deploys the site automatically.
4. Open the published URL on desktop and phone. The workflow sets the Vite base path for the repository; HashRouter-style URLs keep lesson links refresh-safe.

To test the repository subpath locally:

```sh
VITE_BASE=/repo-name/ npm run build
npm run preview
```

The static app has no service worker, PWA/offline mode, backend, timed mock interview, or live LLM calls. The CSP is in `index.html`; GitHub Pages does not let this project set response headers. The SQL playground loads its WASM asset from the deployed base path.

## Set up sync on desktop and phone

1. On the first device, open **Settings → Cross-device sync**.
2. Create a classic GitHub personal access token with only the `gist` scope and a short expiry. Paste it into the setup screen, then select **Create sync Gist**.
3. Secret Gists are **unlisted, not private**: anyone with the Gist URL can read the contents. The QR code contains only the Gist ID. Copy that ID to the second device (or use **Find my Gist** there).
4. On the second device, paste the same token and Gist ID, then sync. Each device stores its token locally in its own browser storage; it is never exported or synced.
5. Keep notes and leadership stories free of confidential employer information. Revoke the token after the interview, especially if it was pasted on a shared computer.

A fine-grained token with Gists read/write may also work if GitHub offers that permission for your account. Sync merges user-authored records, keeps tombstones for deletions, and retains local progress when network requests fail. JSON export/import is available as a fallback and never includes the token.

## Study path and state

- Home has a single continue/start action and a collapsed day outline.
- Lessons are sequential, skippable, and saved locally. Focus mode is on by default.
- Compress mode removes optional lessons 24–25 and distributes the rest across two days.
- `/progress`, `/practice`, `/cheatsheet`, and `/settings` are accessible from the site navigation.
- SQL exercises use local SQLite WASM. Coding exercises execute in disposable Web Workers with a hard timeout; they run JavaScript (not TypeScript type-checking).
- Backend choice, completion, skips, grades, notes, and stories are persisted locally and included in Gist sync.

## Notes for maintainers

Lesson content and the reveal question bank are in `src/content/lessons.ts`. User state/merge logic is in `src/state/model.ts`; the GitHub Gist client and sync manager are in `src/sync/gist.ts`. Core merge/path tests are colocated with those modules.
