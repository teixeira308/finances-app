# Data Model: Security and Cost Hardening

This feature doesn't introduce new functional data entities but enforces security constraints on existing entities.

## Entities

### Security Constraints
- **Transaction**: Must contain `userId` field to support Firestore RLS.
- **Category**: Must contain `userId` field to support Firestore RLS.

## Sync Contracts
- None
