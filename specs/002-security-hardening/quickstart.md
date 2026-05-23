# Quickstart: Security & Cost Hardening

## 1. Vercel Security Headers
The headers are already configured in `vercel.json`. They include:
- **CSP**: Restricted to 'self' and Firebase/reCAPTCHA domains.
- **HSTS**: 1-year duration with preload.
- **Clickjacking**: Protected via `X-Frame-Options: DENY`.

## 2. Firebase App Check
1. Enable **reCAPTCHA Enterprise** in Google Cloud Console.
2. Generate a **Site Key**.
3. Add `VITE_APP_CHECK_SITE_KEY` to your `.env.local` and Vercel.
4. The app automatically initializes App Check in `src/shared/services/firebase.ts`.

## 3. Database Security
Firestore rules are hardened to silo data by `userId`.
To verify rules locally:
```bash
npx firebase emulators:exec "npm test"
```

## 4. Secret Management
Ensure `.env.local` is never committed. Reference `.env.example` for required keys.
Rotation procedures are documented in `specs/002-security-hardening/docs/secrets.md`.

## 5. Cost Alerting
1. Go to [GCP Billing](https://console.cloud.google.com/billing).
2. Create a budget for the project.
3. Set alerts at 50%, 90%, and 100% of the monthly threshold.
4. Enable **Forecasted Spend** alerts.
