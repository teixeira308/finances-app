# Quickstart: Security and Cost Hardening

## Overview
This document guides the setup of security and cost controls.

## Setup Steps

### 1. Security Headers
Ensure `vercel.json` contains the following headers to enforce secure HTTP communication:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 2. Firestore Rules
Deploy the following rules via Firebase CLI:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Monitoring
1. **Firebase**: Go to Billing -> Budgets and set alerts at 50%, 90% of budget.
2. **Vercel**: Go to Settings -> Usage & Billing to configure project-level spend limits.
