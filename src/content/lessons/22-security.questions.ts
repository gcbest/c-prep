import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q22-1', lesson: 22, minutes: 2, source: 'general',
    prompt: 'The UI hides the "Approve" button from users without the manager role. Is the feature secure?',
    strongAnswerPoints: ['No: hiding a button is UX; the API can be called directly.', 'The server must authenticate and authorize every protected call, including object-level checks.', 'Deny by default; return 401 vs 403 appropriately.', 'Audit approvals and denials.'],
    redFlags: ['Treats front-end checks as enforcement', 'Only checks the role at login'] },
  { id: 'q22-2', lesson: 22, minutes: 2, source: 'general',
    prompt: 'Compare sessions and JWTs for a banking web app.',
    strongAnswerPoints: ['Session: server-side state, opaque cookie, easy revocation.', 'JWT: signed, stateless, hard to revoke before expiry, readable so no secrets inside.', 'Validate signature, exp, iss, aud; short-lived access tokens with refresh.', 'Store in httpOnly Secure SameSite cookies rather than localStorage where possible.'],
    redFlags: ['Says JWTs are encrypted', 'Long-lived tokens with no revocation plan'] },
  { id: 'q22-3', lesson: 22, minutes: 2, source: 'general',
    prompt: 'What does CORS protect against, and what does it not? How does it differ from CSRF protection?',
    strongAnswerPoints: ['CORS is a browser policy controlling whether a page from another origin can read a response.', 'It is not access control: curl and servers ignore it, and simple requests are still sent.', 'CSRF is a cross-site request abusing automatically sent cookies; defend with SameSite, CSRF tokens, Origin checks.', 'Wildcard origin cannot be used with credentials.'],
    redFlags: ['Says CORS secures the API', 'Fixes CORS errors with allow-all in production'] },
  { id: 'q22-4', lesson: 22, minutes: 2, source: 'general',
    prompt: 'How do you prevent XSS in Angular or React, and what are the escape hatches that reintroduce the risk? What belongs in audit logs and what does not?',
    strongAnswerPoints: ['Framework escapes output by default; Angular also sanitises bound HTML.', 'Hazards: bypassSecurityTrust*, innerHTML with untrusted data, dangerouslySetInnerHTML.', 'Add a CSP; consider frame-ancestors for clickjacking.', 'Audit logs: who, what, when, record, outcome; never PII, tokens, passwords or card numbers.'],
    redFlags: ['Bypasses sanitiser to make something render', 'Logs request bodies or tokens wholesale'] },
];
