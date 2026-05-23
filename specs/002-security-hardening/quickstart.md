# Quickstart: Security & Cost Hardening

## 1. Vercel Security Headers
Add or update `vercel.json` in the root:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; ..." },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## 2. Firebase App Check
1. Enable **reCAPTCHA Enterprise** in Google Cloud Console.
2. Generate a **Site Key**.
3. Initialize in `src/shared/services/firebase.ts`:
```typescript
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('YOUR_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

## 3. Secret Management
Ensure `.env.local` is never committed. Add the following to Vercel/CI:
- `VITE_FIREBASE_API_KEY`
- `VITE_APP_CHECK_SITE_KEY`

## 4. Cost Alerting
1. Go to [GCP Billing](https://console.cloud.google.com/billing).
2. Create a budget for the project.
3. Set alerts at 50%, 90%, and 100% of the monthly threshold (e.g., $10).
