# Research: Security and Cost Hardening

## Decision Matrix: Security Headers (Vercel)

| Decision | Selection | Rationale | Alternatives Considered |
|----------|-----------|-----------|-------------------------|
| Implementation Method | `vercel.json` | Standard for all Vercel project types (including Vite SPA). | Middleware (Next.js only), Cloudflare Workers. |
| Content Security Policy (CSP) | Strict Baseline | Protects against XSS. Includes `script-src 'self'` and `style-src 'self'`. | Permissive CSP (Too risky), No CSP. |
| HSTS | Enabled (1 year) | Forces HTTPS, preventing SSL stripping. | Short duration HSTS. |
| Frame Options | `DENY` | Prevents Clickjacking by disallowing framing. | `SAMEORIGIN` (not needed if no local framing). |

## Decision Matrix: Bot & Abuse Protection (Firebase App Check)

| Decision | Selection | Rationale | Alternatives Considered |
|----------|-----------|-----------|-------------------------|
| Provider | reCAPTCHA Enterprise | Recommended by Firebase; identical free tier (10k) as v3 but with Replay Protection. | reCAPTCHA v3 (Legacy), Custom Provider. |
| Enforcement Mode | `Enforced` | Ensures only verified app instances can access Firestore/Functions. | `Unenforced` (Monitoring only). |
| Token Storage | IndexedDB | Default for Firebase App Check; secure for browser environments. | LocalStorage (less robust). |

## Decision Matrix: Database Security (Firestore Rules)

| Decision | Selection | Rationale | Alternatives Considered |
|----------|-----------|-----------|-------------------------|
| Access Model | RLS (User ID Silo) | Simplest and most secure way to ensure users only see their own data. | Admin-only access (Requires Backend). |
| Rule Granularity | Action-based (Create/Update/Delete) | Prevents accidental deletion or unauthorized modification of historical data. | Bulk `write` permission. |
| Data Validation | Type & Field Checks | Prevents malformed data from being injected into the DB. | Frontend-only validation. |

## Decision Matrix: Cost Management

| Decision | Selection | Rationale | Alternatives Considered |
|----------|-----------|-----------|-------------------------|
| Alerting | Budget Alerts (GCP) | Notifies at 50%, 90%, 100% of target spend. | Manual monitoring. |
| Quotas | Service-specific limits | Caps Cloud Function invocations and Firestore reads/writes. | No quotas (high risk). |
| Kill Switch | Manual Reaction | Automated kill switch (Pub/Sub) is too risky for a personal app; alerts are sufficient for now. | Automated Billing Disable. |

## Findings

### 1. Vercel Security Headers
- Use `vercel.json` in the root.
- Key headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- Score goal: A+ on SecurityHeaders.com.

### 2. Firebase App Check
- reCAPTCHA Enterprise is the way forward.
- Free tier: 10,000 assessments/month.
- Implementation requires:
  - Enabling API in GCP.
  - Generating Site Key.
  - Initializing in `firebase.ts`.

### 3. Firestore Rules
- Critical rule: `allow read, write: if request.auth != null && request.auth.uid == userId`.
- Structure should move towards `/users/{userId}/[collection]/{id}` if not already there, or use a `userId` field in every document.
- Validation: Check `request.resource.data` types.

### 4. Cost Control
- Budgets are set in Google Cloud Console, not Firebase Console.
- Alerts should include **Forecasted** spend to catch spikes early.
- SMS Pumping protection is needed if Phone Auth is ever used.

## Needs Clarification
- **Testing**: How will we verify Firestore rules? (Action: Research Firebase Emulator suite).
- **Error Tracking**: Does the project already have an error logger? (Checked: `src/shared/utils/logger.ts` exists but needs review).
