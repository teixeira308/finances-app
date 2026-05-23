# Secret Management & Rotation Procedure

## 1. Environment Variables
All sensitive keys must be stored in `.env.local` for local development and in the **Vercel Dashboard** (Settings > Environment Variables) for production.

### Required Keys:
- `VITE_FIREBASE_API_KEY`: Firebase Web API Key.
- `VITE_APP_CHECK_SITE_KEY`: reCAPTCHA Enterprise Site Key.

## 2. Rotation Procedure

### Firebase API Key:
1. Go to **Google Cloud Console** > APIs & Services > Credentials.
2. Generate a new API Key.
3. Update the key in Vercel and local `.env` files.
4. Verify the app works with the new key.
5. Delete the old key after 24 hours.

### reCAPTCHA Site Key:
1. Go to **Google Cloud Console** > reCAPTCHA Enterprise.
2. Create a new Site Key for the domain.
3. Update `VITE_APP_CHECK_SITE_KEY` in Vercel.
4. Redeploy the application.

## 3. Best Practices
- **NEVER** commit `.env` files.
- **NEVER** log keys in plaintext (use the `src/shared/utils/logger.ts` redaction).
- Restrict API Keys in GCP Console to specific domains and services (Firestore, Auth, App Check).
