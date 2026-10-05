# Build Spec (Lean Version): Citi Full-Stack Interview Prep Site

## Goal

Build a **calm, sequential study site** for a Citi Enterprise Risk Technology **Senior Full-Stack Developer** interview (Rutherford, NJ; Angular front end; backend likely Java/Spring Boot, possibly Python/FastAPI). The candidate has **2-3 days**. They know React, TypeScript, Python, FastAPI, REST, and containers, but not Angular idioms or Java/Spring.

This is a **docs-style reading site with a few interactive practice tools**, not a large app. Build the reading path first, add interactivity only where it beats reading, then add **cross-device sync (required)**. There is **no offline/PWA support and no timed mock interview**.

**The first screen must not overwhelm.** One headline, one button, one short outline. Everything else is a click away.

---

## Non-Negotiable UX Rules

1. **Home page shows only:** title, one sentence of purpose, a single primary button ("Start Day 1" or "Continue: <lesson name>"), a 3-row collapsed outline (Day 1 / Day 2 / Day 3 with time estimates), and a small progress bar. Nothing else. No grids of cards, no tier tables, no source lists.
2. **One path, one order.** Lessons are numbered and sequential. Each lesson ends with a single "Next lesson" button. A secondary "Back" link is allowed. No branching menus inside lessons.
3. **Progressive disclosure.** Show the essentials first; put depth behind collapsible "Go deeper" sections (collapsed by default). Answers to practice questions are hidden until the user clicks "Reveal."
4. **Small lessons.** Each lesson takes 15-35 minutes, has at most 5 short sections, and stays under about 900 words plus code and practice. Split anything longer. The two 45-minute lessons (system design, leadership) are mostly practice and are split into a clearly marked **Part A / Part B** with a natural stopping point between them.
5. **Consistent lesson template** (below), so the user always knows what comes next.
6. **Sidebar shows only the current day expanded.** Other days collapsed. On phones the sidebar is a slide-over menu.
7. **Focus mode** (default on): hides sidebar and header; shows lesson content, a thin progress strip, and Back/Next. Toggle in the corner.
8. **Skippable by design.** "Skip for now" is always available and moves a lesson to a small "Skipped" list on the Progress page. Never block the path.
9. **No gamification, badges, streaks, or animations** beyond subtle transitions (respect reduced-motion).
10. **Typography:** readable measure (about 70 characters), generous spacing, one accent color, dark mode, large tap targets (phone-friendly).

---

## Lesson Template (Every Lesson Uses It)

1. **Why this matters** (2-3 sentences; label any interview-frequency claim as "candidate-reported").
2. **Core idea** (the minimum to understand; for Java/Angular/Spring, a "You know this from React/TS/FastAPI" bridge box with one "Where the analogy breaks" line).
3. **Example** (one short, runnable or readable code sample).
4. **Practice** (2-4 items: quiz-style reveal questions or one interactive exercise).
5. **Say it out loud** (one 60-90 second interview-style prompt the user answers aloud, with a collapsible "strong answer includes" list; untimed; no microphone or recording).
6. **Go deeper** (collapsed; optional extras).
7. **Cheat-sheet block** (`<CheatSheet>`, 3-6 bullets; not shown inline, collected by `/cheatsheet`).
8. **Footer:** estimated minutes, "Mark complete," "Skip for now," "Next lesson."

---

## The Sequential Path

Order is chosen so each lesson builds on the last and the highest-yield topics come first. Lesson time totals about 12.5 hours; with about 30 minutes a day for redoing missed questions, the plan is about 14 hours across 3 days.

**Compress mode (2 days):** hides lessons marked optional (24, 25), hides any content wrapped in `<CompressHide>` (e.g., the Saga/outbox and micro-frontend sections of lesson 23), and redistributes the remaining lessons, in the same order, across 2 days by cumulative minutes (about 6 h/day). Nothing else is cut.

### Day 1: SQL, Java, Backend, Angular Start (about 4.5 h)

| # | Lesson | Min | Why here |
|---:|---|---:|---|
| 1 | How this plan works + pick backend (Java default / Python) | 10 | Orientation, one decision |
| 2 | SQL 1: SELECT, WHERE, ORDER BY, aggregates, GROUP BY, HAVING | 25 | Highest-ROI skill; candidate-reported as a large part of the screen |
| 3 | SQL 2: Joins and anti-joins | 25 | Most common SQL tasks |
| 4 | SQL 3: Subqueries, CTEs, window functions, latest-row-per-group | 30 | Senior-level SQL |
| 5 | Java essentials for TS/Python devs | 25 | Java trivia and Java test-fixing are candidate-reported; candidate doesn't know Java |
| 6 | Backend 1: How a request flows (controller -> service -> repository) | 20 | Frame for Spring/FastAPI |
| 7 | Backend 2: Dependency injection and configuration | 25 | Core Spring/FastAPI idea |
| 8 | Backend 3: Validation, errors, and REST design | 25 | Commonly probed |
| 9 | Backend 4: Database access, ORM, transactions, N+1 | 30 | Candidate-reported frequently |
| 10 | Angular 1: Components, templates, data binding (via React) | 25 | Start of the front end |
| 11 | Angular 2: Services, dependency injection, HTTP | 25 | Connects to backend |

### Day 2: Front End, Testing, Coding (about 5 h)

| # | Lesson | Min | Why here |
|---:|---|---:|---|
| 12 | Angular 3: Change detection and OnPush | 25 | Classic senior Angular question |
| 13 | Angular 4: Signals vs RxJS, forms, routing | 30 | Modern Angular |
| 14 | RxJS: operators that matter (switchMap, concatMap, exhaustMap, mergeMap) | 30 | Frequent scenario questions |
| 15 | Testing 1: Jasmine, Karma, TestBed, Cypress roles | 25 | In the job description |
| 16 | Testing 2: Test a service and a component (HttpTestingController) | 30 | Hands-on |
| 17 | Testing 3: Debug a failing unit test (Java/JUnit or Python/pytest) | 35 | Candidate-reported Karat-style task |
| 18 | Coding 1: Hash-map aggregation | 30 | Highest-priority pattern |
| 19 | Coding 2: String and log parsing | 30 | Second pattern |
| 20 | Coding 3: Snapshot plus updates (versions, deletes, ordering) | 35 | Third pattern |
| 21 | Coding 4: Sets and membership | 30 | Dedupe, reconciliation, neighbour lookup |

### Day 3: Security, Design, Leadership, Review (about 3.75 h)

| # | Lesson | Min | Why here |
|---:|---|---:|---|
| 22 | Security: authN vs authZ, JWT/OAuth basics, CORS, CSRF, XSS | 30 | Banking context |
| 23 | Architecture: microservices, messaging (Kafka concepts), caching | 30 | Senior differentiators |
| 24 | Delivery: Docker, CI/CD, micro-frontends (optional) | 25 | In the job description |
| 25 | Working with LLM APIs (brief; optional) | 15 | Quick, user already knows agents; some Citi postings mention AI |
| 26 | System design: risk-management portal walkthrough (Part A / B) | 45 | Senior design round |
| 27 | Leadership: four STAR-L stories (Part A / B) | 45 | Likely behavioral focus |
| 28 | Final cheat sheet, review of misses, day-of checklist | 30 | Last-hour review |

There is no timed mock interview; leftover time is for re-reading weak lessons and redoing missed questions.

---

## Information Architecture

```text
/                  Home: one button + collapsed 3-day outline + progress bar
/day/1, /day/2, /day/3     Day overview: ordered lesson list with time + status (done/skipped/next)
/lesson/:n         Lesson page (template above), Back / Next
/practice          Optional: all interactive practice in one place (SQL playground, coding runner)
/progress          Done, skipped, weak topics (from self-grades), "Review these" list
/cheatsheet        Printable one-pager: <CheatSheet> blocks from all lessons, weak lessons first
/settings          Backend track, compress mode, dark mode, sync setup, export/import
```

Home must stay minimal even after progress exists: it shows only "Continue: <next lesson>", the progress bar, and (once sync is enabled) a tiny status dot. Weak-topic details live on `/progress`, not on Home.

A lesson is "weak" if any of its questions is graded Missed or Partial and has not since been re-graded Strong.

---

## Interactive Tools (Only These Three)

1. **SQL playground** (`sql.js`/SQLite in the browser): 20 exercises on seeded risk data (`trades`, `accounts`, `risk_limits`, `breaches`, `users`, `orders`). Each: prompt, schema viewer, editor, Run, result diff against expected, three-level hint ladder, model solution. Embedded in lessons 2-4 and available on `/practice`.
2. **Coding runner:** JS/TS exercises executed in a Web Worker with hidden tests, plus a prompt for time and space complexity. TypeScript is type-stripped in the worker with Sucrase (no type-checking). Enforce the timeout by calling `worker.terminate()` and starting a fresh worker. Used in lessons 18-21.
3. **Reveal-style questions:** question -> answer (typed, or said aloud) -> reveal "strong answer includes" -> self-grade Missed/Partial/Strong. Misses feed `/progress`.

Do **not** build anything else interactive (no chatbot, no live LLM calls from the site, no timed mock interview, no diagram editor, no dashboards, no auto-grading of free text, no speech recognition). Mermaid diagrams are static and read-only in lessons 23 and 26.

---

## Content Requirements

### SQL (Lessons 2-4)
Joins (inner, left, anti-join via `LEFT JOIN ... IS NULL` and `NOT EXISTS`), `GROUP BY`/`HAVING`, `COUNT(DISTINCT)`, conditional aggregation, subqueries (scalar, correlated, `IN` vs `EXISTS`), CTEs, window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG/LEAD`, running totals), latest-row-per-group, top-N per group, dedupe, NULL semantics, indexes and why queries are slow, transactions and isolation basics, Oracle/Postgres/SQLite quirks (`ROWNUM`/`FETCH FIRST`, `NVL`/`COALESCE`).

### Java Essentials (Lesson 5, both tracks; "recommended" on the Python track)
Goal: read and fix Java code and answer Java trivia, not write large programs. Static types and `var`; classes, interfaces, abstract classes, records; generics; access modifiers and `final`; `List`/`Map`/`Set` and their common implementations; streams (`map`, `filter`, `collect`, `groupingBy`); `Optional`; checked vs unchecked exceptions and try-with-resources; `equals()`/`hashCode()` contract; `==` vs `.equals()`; `BigDecimal` for money; reading a JUnit 5 test (`@Test`, `assertEquals`, `assertThrows`). Bridge boxes to TS/Python throughout. **Go deeper:** threads, `ExecutorService`, `CompletableFuture`, `synchronized`, `ConcurrentHashMap`, immutability (candidate-reported later rounds include threading).

### Backend (Lessons 6-9): Java track (default)
Request flow; IoC/DI; bean scopes; **singleton beans must be stateless/thread-safe**; constructor vs field injection; `@Qualifier` vs `@Primary`; auto-configuration; profiles and `application.yml`; `@RestController`, binding, DTOs, `@Valid`, `ResponseEntity`; `@ControllerAdvice`; JPA/Hibernate entities, lazy vs eager, N+1, `@Transactional` (rollback rules, self-invocation pitfall). Bridge table: FastAPI `Depends` ~ DI; Pydantic ~ DTO + validation; exception handlers ~ `@ControllerAdvice`; SQLAlchemy ~ JPA; pytest ~ JUnit; `unittest.mock` ~ Mockito.

### Backend: Python track
Same lessons with FastAPI: `Depends`, Pydantic, exception handlers, SQLAlchemy sessions/transactions, async vs sync, pytest + `TestClient`. The backend choice swaps lesson bodies 6-9 and 17; it never changes the lesson numbers or order.

### Angular (Lessons 10-13)
Components/templates, standalone components, `@Input/@Output` or signal inputs, services and DI scope (not equal to React Context), `HttpClient` and interceptors, change detection (default vs `OnPush`, what triggers updates, `trackBy`/`track`), signals vs RxJS, reactive forms, router guards and lazy loading, lifecycle and cleanup (`DestroyRef`, `takeUntilDestroyed`). **Recognize both eras:** bank codebases often run older Angular, so show NgModules alongside standalone components and `*ngIf`/`*ngFor` alongside `@if`/`@for`. Each concept gets a React equivalent box.

### RxJS (Lesson 14)
Forced-choice scenarios: type-ahead -> `switchMap`; prevent double submit -> `exhaustMap`; ordered writes -> `concatMap`; bounded concurrency -> `mergeMap(…, n)`; `catchError` placement; hot vs cold; why nested subscribes are bugs.

### Testing (Lessons 15-17)
- Jasmine (specs, expectations, spies) vs Karma (browser runner) vs TestBed (DI/template environment) vs Cypress (integrated flows). Service test with `HttpTestingController` (success, 404, error, retry). Component test (loading, thresholds, error + retry, disabled action).
- Java-side vocabulary (lesson 17, Java track): JUnit 5, Mockito (`@Mock`, `when`, `verify`), and what `@WebMvcTest`, `@DataJpaTest`, and `@SpringBootTest` each load.
- **Debug-a-failing-test lab:** a small multi-file codebase (e.g., a `TradeReconciler` that dedupes by symbol only) with a failing test. In the browser it is a **read-only multi-file viewer** with step-by-step reveals (no JVM in the browser). Optionally ship `labs/java-debug` (Maven) and `labs/python-debug` (pytest) in the repo so the user can run them locally. Teach the loop (read test -> reproduce -> inspect -> minimal fix -> rerun -> explain) across six bug types (broken `equals/hashCode`, float vs `BigDecimal` formatting, off-by-one, shared mutable state, null/empty handling, wrong comparator).

### Coding (Lessons 18-21, four patterns only)
1. Hash-map aggregation: Group Anagrams (LeetCode 49), Top K Frequent Elements (347), Contains Duplicate (217).
2. String/log parsing: Reorder Data in Log Files (937), Validate IP Address (468).
3. Snapshot plus updates: Stock Price Fluctuation (2034), Simple Bank System (2043), Time Based Key-Value Store (981).
4. Sets and membership: Intersection of Two Arrays (349), Longest Consecutive Sequence (128), plus a set-difference reconciliation over trade ids.

Capstone: process `RiskEvent` upserts/deletes with `version` and `sequence`, keep the newest per id, total by category, ignore stale updates, detect sequence gaps. Also a journey-counting variant (count completed enter->exit pairs, ignore orphans). Teach the routine: restate -> clarify -> example -> edge cases -> approach -> complexity -> code -> test. Advise: in a Karat-style screen, use whichever language you are fastest in (usually allowed), and think aloud.

### Security, Architecture, Delivery (Lessons 22-24)
- Security: authN vs authZ; sessions vs JWT; OAuth2/OIDC concepts; CORS misconceptions; CSRF; XSS and CSP; clickjacking; **the server enforces entitlements, hiding UI is not security**; audit logging; PII in logs.
- Architecture: microservices vs modular monolith; REST vs messaging; Kafka concepts (partitions, ordering, consumer groups, at-least-once, idempotent consumers); cache-aside and invalidation; timeouts, retries, circuit breakers, idempotency keys; correlation IDs. In `<CompressHide>`: Saga/outbox concepts, micro-frontend trade-offs.
- Delivery (optional): PR checks -> CI -> multi-stage Docker build -> scans -> immutable artifact -> promotion -> smoke tests -> approvals -> rollback.

### Working with LLM APIs (Lesson 25, brief, 15 minutes, optional)
Purpose: be able to discuss LLM integration credibly in a regulated bank. Some Citi Python/risk postings mention AI agent platforms, so a short, practical lesson is worthwhile; label this "job-posting-reported," not a guaranteed interview topic. The candidate already builds AI agents, so keep it concise and lead with the enterprise framing rather than basics.

Cover, one short section each:
1. **Calling an LLM API:** stateless HTTP request/response (messages, model, parameters), streaming via server-sent events, timeouts, retries with backoff on `429/5xx`, idempotency, and a small TypeScript or Python example behind a backend endpoint.
2. **Keep keys and calls server-side:** never expose API keys in an Angular/React bundle; the browser calls your backend, which authenticates the user, enforces entitlements, applies rate limits, and calls the model.
3. **Structured output and validation:** ask for JSON against a schema, then validate (Pydantic or Bean Validation) before using it; treat model output as untrusted input; never execute it or render it as raw HTML (XSS).
4. **Tool use / function calling:** the model proposes a call; the application validates arguments, checks permissions, executes, and returns the result; keep tools least-privilege and read-only by default; require human approval for risky actions.
5. **Retrieval (RAG) at a glance:** retrieve authorized documents, pass them as context, cite sources; filter retrieval by the caller's entitlements so users never see data they are not allowed to see.
6. **Bank-grade concerns:** data classification and PII/confidential data handling (use only approved, internal or contracted models; no sensitive data to public endpoints), prompt-injection risk, audit logging of prompts/responses/tool calls with correlation IDs, redaction, evaluation and regression tests with fixed examples, non-determinism, cost/latency budgets, caching, fallbacks and graceful degradation when the model is down, and human-in-the-loop for decisions.
7. **UI patterns:** streaming tokens, loading/partial/error states, "AI-generated" labelling, easy correction and feedback, never auto-submitting model output.

Practice: three reveal questions (e.g., "Where should the API key live and why?", "How do you stop a prompt-injected document from triggering a tool call?", "How would you test a feature whose output is non-deterministic?") and one "Say it out loud" prompt: *"Design an AI assistant that summarizes risk-limit breaches for a risk manager."* Strong answers mention entitlement-filtered retrieval, server-side calls, schema validation, audit logging, evaluation sets, and human review. No live LLM calls from the study site itself.

### System Design (Lesson 26)
Risk-management portal walkthrough with a suggested 45-minute phase guide (requirements 5 / NFRs 5 / architecture 10 / front end + API + data 10 / security + resilience 7 / delivery + observability 5 / trade-offs 3), shown as reading guidance, not a timer. Part A: requirements through architecture; Part B: the rest. Risk-UX rules: "as of" timestamps; zero vs no data; stale/partial markers; precision and rounding; drill-down lineage; server-side entitlements. Add one optional "Go deeper" note on where an LLM summary feature would fit (see lesson 25).

### Leadership (Lesson 27)
Four stories (production incident, technical disagreement, mentoring/raising quality, stopping a risky release or raising a security concern) in a simple Situation / Ownership / Actions / Result / Learning form with a short quality checklist. Part A: stories 1-2; Part B: stories 3-4, a "Why Citi ERT?" answer, and a short list of questions to ask the interviewers. Stories sync through the Gist, so remind the user not to include confidential employer details.

### Final Review (Lesson 28)
Links to `/cheatsheet` and the "Review these" list, then a short **day-of checklist**: confirm the interview format and language choice; set up a quiet room and a working editor; restate and clarify before coding; think aloud; test with an example before saying "done"; have your stories and questions within reach.

---

## Candidate-Reported Context (Label as Such)

Use this only as light framing in "Why this matters," never as guaranteed questions: reported Citi full-stack screens have included roughly 15 minutes of Spring, 10 of Angular, and 20 of SQL; other reports describe a failing unit test to fix, short Java trivia (`equals()`/`hashCode()`, checked vs unchecked exceptions), and a log/event counting problem. Later rounds reportedly cover Spring Boot, exception handling, microservices, messaging, caching, threading, and system design.

---

## Tech Stack

- Vite + React 18 + TypeScript (strict), **MDX** for lesson content via `@mdx-js/rollup` with `remark-frontmatter` + `remark-mdx-frontmatter` (one file per lesson, frontmatter: `number`, `title`, `minutes`, `day`, `optional`, `track` (`both`/`java`/`python`)), React Router **`HashRouter`**.
- Plain CSS or Tailwind; a small component set: `Callout`, `Bridge`, `Reveal`, `Collapsible`, `Quiz`, `SqlExercise`, `CodeExercise`, `CheatSheet`, `CompressHide`, `FileViewer` (debug lab).
- Shiki at **build time** via `@shikijs/rehype` (no runtime highlighter). Mermaid lazy-loaded only on lessons 23 and 26.
- `sql.js` for SQL; Web Worker + Sucrase for JS/TS exercises.
- Questions live in a per-lesson data file next to each MDX file (e.g., `content/lessons/07-backend-di.questions.ts`).
- State in `localStorage` (versioned): current lesson, completed, skipped, self-grades, notes, stories, settings.
- Vitest (`"test": "vitest"`) for the path/progress logic, compress-mode bucketing, SQL checker, and sync merge.
- Content is data, not code: adding or editing a lesson means editing one MDX file and its questions file.
- **No service worker, PWA manifest, or offline caching.**

---

## Deployment: GitHub Pages (Required)

- Static site only. `base: process.env.VITE_BASE ?? '/'`; the workflow sets `VITE_BASE=/<repo-name>/`.
- `HashRouter` so refresh and deep links work without redirects.
- Resolve all assets, including the `sql.js` `.wasm` file, with `import.meta.env.BASE_URL` or Vite asset imports. Verify SQL works under the sub-path.
- Never put secrets or tokens in the bundle.
- Add a Content-Security-Policy `<meta>` tag (GitHub Pages can't set headers) with `connect-src 'self' https://api.github.com https://gist.githubusercontent.com`. sql.js may need `script-src 'wasm-unsafe-eval'`, workers may need `worker-src 'self' blob:`, and Mermaid may need `style-src 'unsafe-inline'`. Verify each still works in the production preview.
- `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck && npm test -- --run
      - run: npm run build
        env:
          VITE_BASE: /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- Commit `package-lock.json` (required by `npm ci`).
- README "Deploy in 5 minutes": create repo -> push to `main` -> Settings -> Pages -> Source = GitHub Actions -> open the URL on desktop and phone.
- Local production test: `VITE_BASE=/repo-name/ npm run build && npm run preview`.

---

## Required: Progress Sync Across Devices via GitHub Gist

Progress must stay identical on desktop and phone with no custom backend. The synced data is tiny: current lesson, completed/skipped lists, self-grades, notes, stories, and settings.

### Design
- One **secret Gist** (`interview-prep-state.json`, description `interview-prep-sync`). Secret Gists are unlisted, not private: anyone with the URL can read them. Warn the user on the setup screen and never sync confidential employer data.
- Auth: a **classic personal access token with only the `gist` scope** and a short expiry, pasted once per device in Settings. Sources disagree on whether fine-grained tokens can access Gists, so say: "Use a classic token with only the `gist` scope; a fine-grained token with a Gists read/write permission may also work if your account offers it." Store the token in `localStorage` under its own key on that device only; **never** include it in exports, the Gist, logs, or URLs. Provide "Disconnect and erase token."
- Call `https://api.github.com/gists` directly from the browser with `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`, and `X-GitHub-Api-Version`.
- Setup flows:
  1. Device 1: paste token -> "Create sync Gist" (`POST /gists`, `public: false`) -> store `gistId`, show the ID and a QR code containing **only the ID**.
  2. Device 2: paste token -> scan the QR code, paste the ID, or choose "Find my Gist" (list gists, match description and filename).
- A guided 3-step "Set up sync" screen in Settings (token -> create/find Gist -> confirm). Home shows only a tiny status dot once enabled.

### Data and conflict handling
- Root fields: `schemaVersion`, `revision` (monotonic), `updatedAt`, `deviceId` (random UUID per device). Every user-authored record (completion, skip, self-grade, note, story, setting) has its own `updatedAt` and `deviceId`.
- **Merge, never blindly overwrite:** fetch remote -> merge with local, last-write-wins per record -> save locally -> `PATCH /gists/{id}` with the merged JSON. Key arrays by id, not index. Use tombstones (`deleted: true, updatedAt`) so deletions do not resurrect.
- Per-record winner: the higher `updatedAt`; on an exact tie, the higher `deviceId` (string compare). This makes the merge deterministic and commutative.
- **Race check:** Gist `PATCH` has no conditional write, so two devices can overwrite each other. After each `PATCH`, re-fetch; if any local record is missing or older remotely, re-merge and `PATCH` again (at most 2 attempts, then report and retry on the next trigger).
- If the remote `schemaVersion` is newer than the app understands, refuse to merge and ask the user to reload the page for the latest version.
- Sync only user-authored state, never lesson content. If the API reports `truncated: true`, fetch `raw_url`.
- On `401`, show "Token expired or revoked - paste a new one." On `403/429`, back off exponentially and show a short retry message. Failed syncs never lose data: local changes stay in `localStorage` and are included in the next successful sync.

### Triggers and UX
- Sync on app open, when the tab regains focus, 10 seconds after changes (debounced), and when the browser fires the `online` event.
- On `visibilitychange` to hidden (e.g., phone switching apps), flush pending changes immediately with `fetch(..., { keepalive: true })` so edits inside the debounce window are not stranded.
- "Sync now" button and a small status text in Settings: `Synced <time>`, `Syncing...`, `Couldn't sync - tap for details`.
- Settings: connect/disconnect, Gist ID (copyable), last sync time, device name, "Force pull" and "Force push" (both confirm), JSON export/import fallback (never includes the token).
- Security guidance: narrowest scope, short expiry, revoke the token after the interview, avoid shared computers.

### Implementation
- Code in `src/sync/`: `GistClient` (fetch wrapper), pure `mergeState()`, `SyncManager` (scheduling, retry, race check, status store), `useSyncStatus` hook.
- Unit-test `mergeState`: different-record concurrent edits, same-record conflicts, exact-timestamp ties, tombstones, first pull on a new device with existing local progress, schema mismatch, clock skew, idempotency (merging the same state twice changes nothing), and commutativity (`merge(a, b)` equals `merge(b, a)`). Mock `fetch` for `GistClient`: create, find, read, patch, 401, 403, 404, 422, network failure.

## Not Included

- **No offline/PWA support:** no service worker, manifest, or install prompt. The site needs a connection to load; progress is still saved locally and synced when reachable.
- **No timed mock interview:** no mock route, timer, or rubric screens. Practice comes from reveal questions, the SQL playground, the code runner, and untimed "Say it out loud" prompts.
- **No live LLM calls from the study site:** lesson 25 is reading and reveal questions only.

---

## Build Order (Each Step Leaves a Working Site)

The candidate starts studying as soon as Day 1 content exists, so content for the earliest lessons comes before infrastructure that can wait.

1. Shell: Home, day pages, lesson page template, lesson 1, Next/Back, progress in `localStorage`, focus mode, dark mode, and GitHub Pages deployment (**deploy a skeleton first**).
2. Lessons 2-4 (SQL) with the SQL playground and 20 exercises.
3. **Gist sync** (`GistClient`, `mergeState`, `SyncManager`, Settings setup screen, tests). Progress made before this step is kept locally and merges in on the first sync.
4. Lessons 5-9 (Java essentials, backend) with reveal questions; Java content first, Python variant second.
5. Lessons 10-14 (Angular, RxJS).
6. Lessons 15-17 (testing and debug lab).
7. Lessons 18-21 (coding runner).
8. Lessons 22-24, 26, 27 (security, architecture, delivery, system design, leadership).
9. Lesson 28 (cheat sheet, review of misses, day-of checklist).
10. Lesson 25 (LLM APIs, brief) if time allows.
11. Accessibility pass, phone layout check, README.

If time runs short, cut polish first, then Python-track content, then optional lessons (25, then 24). Never cut SQL, Java essentials, backend, Angular/RxJS, testing, coding, security, system design, leadership, deployment, or sync.

---

## Question Bank (Used by Practice Items)

81 reveal-style questions spread across lessons: SQL 12, Java essentials 4, backend 14, Angular/TS 10, RxJS 6, testing/debug 8, security 6, architecture 6, LLM APIs 3, coding 6, leadership 6. Schema:

```ts
type Question = {
  id: string;
  lesson: number;
  prompt: string;
  strongAnswerPoints: string[];
  redFlags: string[];
  followUps?: string[];
  minutes: number;
  track?: 'both'|'java'|'python';
  source?: 'candidate-reported'|'job-description'|'job-posting-reported'|'general';
};
```

Missed/Partial grades add the question to the `/progress` "Review these" list, re-surfaced in lesson 28.

---

## Seed Rapid-Fire Answers (Put in the Matching Lessons)

- **equals/hashCode:** equal objects must have equal hash codes; override both together with stable fields.
- **Checked vs unchecked:** checked must be declared or handled; unchecked usually signal programming errors; Spring rolls back `@Transactional` on unchecked by default.
- **@Transactional pitfall:** self-invocation bypasses the proxy; know rollback rules.
- **Bean thread safety:** Spring beans are singletons by default and shared across request threads, so keep them stateless.
- **N+1:** lazy association loaded per row; fix with fetch joins, entity graphs, or batch fetching.
- **Anti-join:** prefer `NOT EXISTS` or `LEFT JOIN ... IS NULL`; beware `NOT IN` with NULLs.
- **OnPush:** updates on changed input reference, events, async-pipe emissions, signal changes, or explicit marking; profile first.
- **Signals vs RxJS:** signals for synchronous state; RxJS for async streams, cancellation, concurrency.
- **Authorization:** hiding a button is UX; the server must authenticate and authorize every protected call.
- **Micro-frontends:** justify by team autonomy and release independence; accept version skew and integration-test cost.
- **LLM in a bank:** keys and calls stay server-side; treat model output as untrusted; filter retrieval by entitlements; log and audit; keep a human in the loop for decisions.
- **Incident story:** contain, communicate, diagnose with evidence, recover safely, separate root cause from contributors, prevent recurrence.

---

## Accessibility

Semantic landmarks, keyboard navigation, visible focus, labeled controls, no color-only status, adequate contrast, reduced-motion support, accessible dialogs and collapsibles, print styles for the cheat sheet.

---

## Acceptance Criteria

- Home shows only the title, one sentence, one primary button, a collapsed 3-day outline, and a progress bar; nothing else.
- Lessons follow the numbered path (28 lessons); every lesson uses the template, takes about 15-35 minutes (lessons 26 and 27 are 45 minutes, split into Part A/B), and ends with one Next button; deep content is collapsed by default; answers are hidden until revealed.
- Lesson 5 (Java essentials) exists on both tracks and prepares the user to read a JUnit test and answer the seeded Java trivia.
- Lesson 25 (LLM APIs) exists, is marked optional, takes about 15 minutes, and covers server-side keys, structured output validation, tool use, retrieval with entitlements, bank-grade concerns, and UI patterns.
- Skipping works and never blocks later lessons; compress mode hides lessons 24 and 25 and `<CompressHide>` content, and redistributes the rest across 2 days in order.
- SQL exercises run and auto-check in the browser; JS/TS exercises run in a worker with hidden tests and a hard timeout; missed questions appear on `/progress`; `/cheatsheet` prints the collected `<CheatSheet>` blocks, weak lessons first.
- Backend track switch swaps lesson bodies 6-9 and 17 without changing numbering.
- Deploys to GitHub Pages at a `/<repo>/` path, including SQL WASM, deep links, and refresh, with the CSP meta tag in place.
- Progress made on one device appears on the other after sync; concurrent edits merge without loss; failed syncs never lose local data; the token is never exported, synced, or bundled.
- No service worker, PWA manifest, timed mock interview, or live LLM call exists in the app.
- TypeScript strict passes; core logic (including `mergeState`) has tests; no console errors; phone layout is usable one-handed.

---

## Final Instruction to the Building LLM

First output a short implementation plan and file tree. Build in the order above, keeping the site runnable after every step. Write substantive lesson content (not placeholders) in the template, keeping each lesson concise. Prefer deleting content over adding it: if a lesson feels long, split it or move extras into "Go deeper." Run type-check, tests, and a production build with a sub-path preview, then report any remaining limitations honestly. The README must include "Deploy in 5 minutes" and "Set up sync on desktop and phone" sections.
