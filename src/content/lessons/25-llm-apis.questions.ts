import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q25-1', lesson: 25, minutes: 2, source: 'job-posting-reported',
    prompt: 'Where should the LLM API key live, and why?',
    strongAnswerPoints: ['Only on the server, in a secrets manager or environment, never in the Angular or React bundle.', 'Anything shipped to the browser is readable, so a leaked key means abuse and cost.', 'The browser calls your backend, which authenticates, enforces entitlements and rate limits.', 'Same in Spring or FastAPI; rotate keys and log usage per user.'],
    redFlags: ['Puts the key in an environment variable consumed by the frontend build', 'Relies on obfuscation'] },
  { id: 'q25-2', lesson: 25, minutes: 3, source: 'job-posting-reported',
    prompt: 'A retrieved document contains hidden text telling the model to call a tool that emails data externally. How do you stop that?',
    strongAnswerPoints: ['Treat retrieved text as data, not instructions; you cannot fully prevent injection in the prompt.', 'Enforce in code: validate tool arguments, check the user\'s permissions, not the model\'s.', 'Least privilege and read-only tools by default; no external egress tool, or allowlisted recipients.', 'Human approval for risky actions; audit log of every tool call.'],
    redFlags: ['Relies only on "ignore malicious instructions" in the system prompt', 'Lets the model execute tools with the service account\'s full rights'] },
  { id: 'q25-3', lesson: 25, minutes: 3, source: 'job-posting-reported',
    prompt: 'How would you test a feature whose model output is non-deterministic?',
    strongAnswerPoints: ['Build an eval set of representative and adversarial inputs with expected properties.', 'Assert on schema validity, required facts, citations and forbidden content rather than exact strings.', 'Run regression evals on prompt or model changes; track scores over time.', 'Mock the model in unit tests; use low temperature where possible; human review samples.'],
    redFlags: ['Asserts exact equality on generated text', 'Tests only by trying it manually'] },
];
