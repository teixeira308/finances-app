/**
 * ───────────────────────────────────────────────
 * Security Configuration & CSP Directive Builder
 * ───────────────────────────────────────────────
 *
 * This module centralizes all security-related constants and CSP
 * (Content Security Policy) generation. It acts as the single
 * source of truth for allowed origins and security decisions.
 *
 * ── Key Security Decisions ──
 *
 * 1. **Authentication (Firebase Auth)**
 *    Firebase SDK persists auth state in IndexedDB (not localStorage).
 *    This is inherently more XSS-resistant because IndexedDB requires
 *    explicit read access from JS. Tokens are never exposed via
 *    `document.cookie` or `window.localStorage`.
 *    → No HttpOnly cookies needed; Firebase's internal token management
 *      is sufficient for a SPA + WebView architecture.
 *
 * 2. **CSP (Content Security Policy)**
 *    - `default-src 'self'`            – Everything not listed falls back to same-origin.
 *    - `script-src 'self'`             – No inline scripts allowed in production.
 *                                       Vite outputs hashed JS files loaded via <script src>.
 *    - `style-src 'self' 'unsafe-inline'` – MUI Emotion & Bootstrap inject dynamic styles.
 *                                          Inline CSS is low risk (no CSS-based XSS vector here).
 *    - `object-src 'none'`             – Kill Flash/Java applets.
 *    - `base-uri 'self'`               – Prevent <base> tag injection.
 *    - `form-action 'self'`            – Forms submit only to own origin.
 *    - `frame-ancestors 'none'`        – Clickjacking protection (cannot frame).
 *    - `upgrade-insecure-requests`     – Auto-upgrade HTTP→HTTPS resources.
 *
 * 3. **HSTS (Strict-Transport-Security)**
 *    Enforced at the deployment layer (Vercel) with max-age=2 years,
 *    covering all subdomains and preload-ready.
 *
 * 4. **WebView Hardening**
 *    - `overscroll-behavior: none`     – Blocks Android pull-to-refresh.
 *    - `touch-action: manipulation`    – Removes 300ms tap delay.
 *    - Inputs enforce `font-size >= 16px` – Prevents iOS auto-zoom on focus.
 *    - `user-scalable=no`              – Disables pinch-zoom in WebView.
 *    - CSS `-webkit-touch-callout`     – Prevents link preview popups.
 */

/** Firebase SDK external origins required at runtime. */
export const ALLOWED_CONNECT_ORIGINS = [
  'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com',
  'https://firestore.googleapis.com',
  'wss://firestore.googleapis.com',
  'https://finances-gui-project.firebaseapp.com',
  'https://firebasestorage.googleapis.com',
] as const;

/** Build the production CSP string (used in vercel.json and as reference). */
export function buildProductionCSP(): string {
  const connectSrc = ["'self'", ...ALLOWED_CONNECT_ORIGINS].join(' ');
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ];
  return directives.join('; ');
}

/** Build a slightly relaxed CSP for local development (Vite HMR needs inline scripts + WebSocket). */
export function buildDevCSP(): string {
  const connectSrc = [
    "'self'",
    'ws://localhost:5173',
    'ws://127.0.0.1:5173',
    ...ALLOWED_CONNECT_ORIGINS,
  ].join(' ');

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connectSrc}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];
  return directives.join('; ');
}
