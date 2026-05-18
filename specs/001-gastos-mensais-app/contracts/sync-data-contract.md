# Sync Data Contract: Gastos Mensais Mobile

## Scope

This contract defines how local-first data must behave before and after future
optional backend synchronization is introduced.

## Local Source of Truth

- transactions, categories, goals, and onboarding state are created locally first
- local writes must succeed without connectivity for supported primary flows
- local identifiers must remain stable across reconciliation

## Future Sync Expectations

- synchronization is optional and must not block first-use or ongoing offline entry
- every synced entity must carry enough metadata to detect duplicates and conflicts
- reconciliation must never create duplicate transactions for a single local action
- conflict resolution must preserve the latest accepted value and retain a visible
  recoverable record for the user when human review is needed

## Error Handling Contract

- failed sync attempts must not remove local data
- sync failures must expose a user-safe status without leaking sensitive contents
- retry behavior must be explicit and idempotent

## Privacy Contract

- sensitive financial contents are never emitted to plaintext logs
- protected local values use the approved secure storage path for secrets and
  sensitive metadata
- exports or remote payloads are deferred until a dedicated backend feature is
  specified
