# Research: Security and Cost Hardening

## Decision: Security Headers
- Decision: Use `vercel.json` headers configuration for hardening.
- Rationale: Most secure and standard way for Vercel-hosted apps to apply CSP and other security headers to all static assets and routes.
- Alternatives: Middleware/Edge functions (overkill for SPA static assets), custom server.

## Decision: Bot Protection
- Decision: Implement Firebase App Check.
- Rationale: Native Firebase solution, integrates directly with Firestore/Auth to prevent unauthorized access from outside the app.
- Alternatives: Captcha (intrusive for UX), cloudflare WAF (more expensive/complex).

## Decision: Firestore Security (RLS)
- Decision: Enforce `request.auth.uid == resource.data.userId` for all documents.
- Rationale: Mandatory for multi-user security.
- Alternatives: Complex backend proxy (complex/costly), disabling RLS (unsafe).

## Decision: Cost Control
- Decision: Use Google Cloud/Firebase Budgets + Vercel usage limits.
- Rationale: Cloud-native, zero-code, prevents overspending at the platform level.
- Alternatives: Custom monitoring microservice (complex/costly).
