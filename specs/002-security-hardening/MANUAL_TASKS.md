# Manual Post-Implementation Tasks

The following tasks must be performed manually in the respective consoles to complete the security and cost hardening setup.

## 1. Google Cloud Console (GCP)
- [ ] **reCAPTCHA Enterprise**:
  - Enable the "reCAPTCHA Enterprise API".
  - Create a "Site Key" for the web domain.
  - Copy the Site Key and add it to Vercel/Local env as `VITE_APP_CHECK_SITE_KEY`.
- [ ] **Billing & Budgets**:
  - Go to Billing > Budgets & alerts.
  - Create a budget for the project (e.g., $10/month).
  - Set alerts at 50%, 90%, and 100% of spend.
  - Enable "Forecasted Spend" alerts.
- [ ] **API Key Restrictions**:
  - Go to APIs & Services > Credentials.
  - Restrict the Firebase API Key to only: "Cloud Firestore", "Firebase Authentication", and "reCAPTCHA Enterprise API".
  - (Optional) Restrict by HTTP Referrer to your production domain.

## 2. Firebase Console
- [ ] **App Check**:
  - Go to Build > App Check.
  - Register the reCAPTCHA Enterprise provider using the Site Key generated above.
  - Monitor telemetry for 24-48 hours before setting enforcement to "Enforced".

## 3. Vercel Dashboard
- [ ] **Environment Variables**:
  - Add `VITE_APP_CHECK_SITE_KEY` with the reCAPTCHA Site Key.
  - Ensure all `VITE_FIREBASE_*` keys from `.env.example` are present.
- [ ] **Deployment**:
  - Trigger a new deployment to apply the `vercel.json` headers.
