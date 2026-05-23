# Tasks: Security and Cost Hardening

**Input**: Design documents from `/specs/002-security-hardening/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Tests are RECOMMENDED for security rules and infrastructure validation.

**Organization**: Tasks are grouped by functional requirement (mapped to user stories) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which functional requirement/story this task belongs to (US1-US6)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and security API setup

- [ ] T001 Enable reCAPTCHA Enterprise API in Google Cloud Console
- [ ] T002 Generate reCAPTCHA Enterprise Site Key for the web domain
- [ ] T003 Configure Firebase App Check in the Firebase Console
- [ ] T004 [P] Install Firebase Emulator Suite for local security rule testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T005 [P] Define TypeScript interfaces for environment variables in `src/vite-env.d.ts`
- [ ] T006 [P] Update `src/shared/utils/logger.ts` to strictly redact sensitive data (PII and financial amounts)
- [ ] T007 Setup repository-level `.env.example` with all required security keys

**Checkpoint**: Foundation ready - security implementation can now begin

---

## Phase 3: User Story 1 - Security Headers (Priority: P1)

**Goal**: Protect the app against common browser-based vulnerabilities (XSS, Clickjacking, etc.)

**Independent Test**: Use `curl -I [deploy-url]` or SecurityHeaders.com to verify headers after deployment.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create or update `vercel.json` with recommended security headers at repository root
- [ ] T009 [US1] Configure Content-Security-Policy (CSP) in `vercel.json` with strict-origin baseline
- [ ] T010 [US1] Enable HSTS with `max-age=31536000` in `vercel.json`
- [ ] T011 [US1] Set `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` in `vercel.json`

---

## Phase 4: User Story 2 - Database Security (Priority: P1)

**Goal**: Ensure users can only access their own financial data and prevent unauthorized writes.

**Independent Test**: Run Firestore Emulator with test scripts simulating cross-user access attempts.

### Tests for User Story 2

- [ ] T012 [P] [US2] Create security rule test suite in `tests/firestore/rules.test.ts`
- [ ] T013 [US2] Verify that User A cannot read User B's transactions using Firestore Emulator

### Implementation for User Story 2

- [ ] T014 [US2] Hardening `firestore.rules` with `request.auth.uid == userId` silo logic
- [ ] T015 [US2] Add type and field-level validation for `transactions` collection in `firestore.rules`
- [ ] T016 [US2] Add type and field-level validation for `categories` collection in `firestore.rules`
- [ ] T017 [US2] Restrict unauthorized field updates (e.g., `userId`, `createdAt`) in `firestore.rules`

---

## Phase 5: User Story 3 - Bot/Abuse Protection (Priority: P2)

**Goal**: Prevent automated abuse using Firebase App Check and reCAPTCHA Enterprise.

**Independent Test**: Verify App Check tokens are being sent in the `X-Firebase-AppCheck` header for Firestore requests.

### Implementation for User Story 3

- [ ] T018 [US3] Initialize Firebase App Check with `ReCaptchaEnterpriseProvider` in `src/shared/services/firebase.ts`
- [ ] T019 [US3] Configure token auto-refresh in `src/shared/services/firebase.ts`
- [ ] T020 [US3] (Manual) Verify App Check enforcement status in Firebase Console after 24 hours of telemetry

---

## Phase 6: User Story 4 - Secret Management (Priority: P2)

**Goal**: Securely manage environment variables across development and deployment.

**Independent Test**: Confirm that no secrets are present in public git history or client-side bundles (except Vite-prefixed ones).

### Implementation for User Story 4

- [ ] T021 [P] [US4] Document secret rotation procedure in `specs/002-security-hardening/docs/secrets.md`
- [ ] T022 [US4] Configure Vercel Environment Variables for production/preview environments
- [ ] T023 [P] [US4] Update `.gitignore` to ensure all `.env` variants (except `.env.example`) are excluded

---

## Phase 7: User Story 5 - Monitoring & Cost Alerts (Priority: P2)

**Goal**: Prevent unexpected cloud bills through proactive budgeting and alerts.

**Independent Test**: Verify budget alert email received after setting a very low test threshold ($1).

### Implementation for User Story 5

- [ ] T024 [P] [US5] Create Google Cloud Budget for the project with alerts at 50%, 90%, and 100%
- [ ] T025 [P] [US5] Configure Forecasted Spend alerts to detect spikes early
- [ ] T026 [US5] Set usage quotas for Cloud Functions and Firestore (daily safety limits) in GCP Console

---

## Phase 8: User Story 6 - Error Monitoring (Priority: P3)

**Goal**: Identify and track application errors without leaking sensitive financial data.

**Independent Test**: Trigger a test error and verify it appears in the dashboard with redacted context.

### Implementation for User Story 6

- [ ] T027 [US6] Integrate basic error tracking (e.g., Sentry or Firebase Crashlytics) in `src/main.tsx`
- [ ] T028 [US6] Connect `src/shared/utils/logger.ts` to the error monitoring service
- [ ] T029 [US6] Verify that all financial amounts are redacted before being sent to the monitoring service

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T030 [P] Run final SecurityHeaders.com scan on production URL
- [ ] T031 [P] Update `specs/002-security-hardening/quickstart.md` with any implementation-specific changes
- [ ] T032 [P] Perform final review of all `firestore.rules` for over-permissive wildcards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must be completed first to provide Site Keys and infrastructure.
- **Foundational (Phase 2)**: Sets up safety rules and types.
- **User Stories (Phase 3-8)**: Can proceed in parallel after Foundation is ready.
  - US2 (Firestore Rules) is the highest priority for data safety.
  - US3 (App Check) depends on US4 (Secrets) for Site Key availability.

### Parallel Opportunities

- T001-T004 can be done in parallel.
- US1 (Headers) is fully independent of US2 (Firestore).
- US5 (Monitoring) and US6 (Error Tracking) are independent of core security implementation.

---

## Implementation Strategy

### MVP First (Data Safety)

1. Complete Setup (Phase 1)
2. Complete Foundational (Phase 2)
3. Complete Database Security (Phase 4 / US2) - **CRITICAL**
4. Complete Security Headers (Phase 3 / US1)

### Incremental Delivery

1. Foundation & Basic Rules -> Data is safe.
2. Headers & App Check -> Frontend is safe.
3. Alerts & Monitoring -> Wallet is safe.

---

## Notes

- Firebase Emulator is essential for testing US2 without affecting live data.
- Always use the `ReCaptchaEnterpriseProvider` for App Check as per research.
- Redaction in US6 is non-negotiable for privacy compliance.
