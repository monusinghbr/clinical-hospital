# PHASE 2 — PATIENT WORKSPACE ARCHITECTURE

## Architecture

Phase 2 begins with patient workspace architecture rather than patient CRUD. The core design unit is active patient context plus active encounter context. Search, registration, timeline, alerts, orders, vitals, and future clinical workflows should all attach to that shared context.

## Folder Structure

- `/modules/patients`: patient search, registration, workspace, validation, services, actions, and types.
- `/modules/patient-context`: active patient provider and store.
- `/modules/encounter-context`: active encounter provider and store.
- `/app/(clinical)/patients`: protected patient workflow routes.
- `/app/api/patients`: patient route handlers.

## Database Schema

Phase 2 adds first-class structures for longitudinal patient operations:

- `PatientFlag`: risk, safety, registration, and operational flags.
- `PatientInsurance`: payer and policy records.
- `EncounterParticipant`: doctor, nurse, ICU staff, and other role participation.
- `ClinicalEvent`: longitudinal timeline events emitted by clinical actions.

These extend existing `Patient`, `PatientAllergy`, `EmergencyContact`, `PatientDocument`, `Encounter`, and order/note/vital models.

## Prisma Models

New models: `PatientFlag`, `PatientInsurance`, `EncounterParticipant`, `ClinicalEvent`.

Updated models: `Patient`, `Encounter`, `User`.

## APIs

- `GET /api/patients/search`: protected UHID/name/phone/encounter search.
- `GET /api/patients/[patientId]/timeline`: protected patient timeline stream.

## Frontend Pages

- `/patients`: global patient search workspace.
- `/patients/register`: operational registration flow.
- `/patients/[patientId]`: patient cockpit with sticky summary, timeline, and active care rail.

## Reusable Components

- `PatientSearchWorkspace`
- `PatientRegistrationFlow`
- `PatientWorkspace`
- `PatientSummaryPanel`
- `PatientTimelineStream`
- `ActiveClinicalRail`
- `PatientContextHydrator`

## Validation

Zod validates patient search and registration modes. Registration supports quick, full, emergency, walk-in, insured, and unknown patient modes. The draft schema is intentionally separate from final submit validation so autosave can persist incomplete work safely.

## Loading And Error States

Patient routes include loading and error boundaries. The search page degrades gracefully when database credentials are not connected, while preserving the workflow UI. Protected routes remain behind Auth.js proxy and permission checks.

## Next Phase

Continue Phase 2 by implementing real patient registration persistence against Supabase, seeded hospital/admin setup, patient alert management, document upload UI, insurance verification, and timeline event writes from vitals, notes, orders, and encounters.
