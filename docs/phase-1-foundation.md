# PHASE 1 — FOUNDATION ARCHITECTURE

## Architecture

This module is a Vercel-native Next.js clinical care application. The frontend and backend live in the App Router, with Route Handlers for APIs, Server Components for default rendering, Client Components only for interactive shell features, Prisma for Supabase PostgreSQL, Auth.js credentials/JWT sessions, and a lightweight realtime abstraction that can target Supabase Realtime or Pusher.

The foundation is patient-context-first. Feature modules should not behave like isolated CRUD pages; they should read active patient and encounter context, then write timeline, alert, audit, and realtime events around that context.

## Folder Structure

- `/app`: App Router routes, layouts, API route handlers, and global providers.
- `/modules`: Feature modules. Phase 1 includes the foundation shell and login workflow.
- `/components`: Shared UI primitives and clinical workflow components.
- `/config`: Navigation, environment parsing, and RBAC permission maps.
- `/server`: Server-only auth, database, and realtime utilities.
- `/services`: Domain services for audit and notifications.
- `/server/events`: Activity event bus for operational events.
- `/server/audit`: Audited action wrapper for permission-checked writes.
- `/server/files`: Supabase Storage upload abstraction for clinical documents.
- `/hooks`: Client hooks.
- `/store`: Persisted UI state.
- `/types`: Type augmentation.
- `/prisma`: Prisma schema and migrations.
- `/docs`: Phase documentation.

## Database Schema

The Prisma schema models multi-hospital tenancy, user memberships, feature permissions, patients, allergies, documents, alerts, wards, beds, encounters, clinical notes, vitals, diagnoses, prescriptions, lab orders, radiology orders, care plans, nursing notes, bed allocations, discharge summaries, notifications, and audit logs.

Key production patterns are included:

- UUID primary keys.
- Soft-delete columns on core entities.
- Hospital-scoped unique constraints.
- Query indexes for high-volume clinical workflows.
- JSON fields for extensible healthcare structures.
- Audit log persistence for security review.

## Prisma Models

Core models: `Hospital`, `Department`, `User`, `UserMembership`, `Patient`, `Encounter`, `Ward`, `Bed`, `ClinicalNote`, `VitalSign`, `Prescription`, `LabOrder`, `RadiologyOrder`, `CarePlan`, `DischargeSummary`, `Notification`, and `AuditLog`.

## APIs

- `GET /api/health`: serverless health endpoint.
- `GET /api/me`: protected current-user endpoint.
- `GET /api/notifications`: protected hospital-scoped notification endpoint.
- `/api/auth/[...nextauth]`: Auth.js credentials/JWT route.

## Operational UI Layer

The foundation now exposes clinical workstation state in the shell and login screen:

- Workspace identity, region, security zone, uptime, and compliance posture.
- Realtime sync state, active shift, current ward context, alert count, and hospital context.
- Connected clinical modules and feature flag state.
- Clinical navigation labels: Overview, Patients, OPD, Admissions, Nursing, Vitals, Medications, Lab, Radiology, ICU, Wards, Discharge, Schedules, Alerts, Audit, Settings.

## Frontend Pages

- `/login`: secure sign-in screen.
- `/`: protected clinical command center inside the enterprise shell.

## Reusable Components

Phase 1 includes `AppShell`, `Sidebar`, `Header`, `DataTable`, `MedicalTable`, `FormBuilder`, `PatientCard`, `ClinicalBadge`, `StatusIndicator`, `AlertBanner`, `DrawerPanel`, `Timeline`, `EmptyState`, `LoadingState`, and `PermissionGuard`.

## Validation

Zod powers shared validation for login, UUIDs, and pagination. React Hook Form is wired into the login workflow and the reusable `FormBuilder`.

## Registries And Standards

- `config/permissions.ts`: role permission map and permission registry.
- `config/features.ts`: feature flag registry for patient context, encounter context, realtime ward sync, ICU monitoring, and terminology services.
- `config/clinical.ts`: clinical enum constants and workstation metadata.
- `config/terminology.ts`: ICD-ready terminology layer with future SNOMED, LOINC, and RxNorm hooks.
- `server/realtime/index.ts`: standardized realtime topics and event names.
- `services/notifications/notification-service.ts`: notification channel architecture.
- `server/events/activity-event-bus.ts`: application activity event bus.
- `server/audit/with-audit.ts`: audit middleware wrapper for protected clinical actions.
- `server/files/upload-service.ts`: file upload abstraction for Supabase Storage.
- `modules/patient-context`: active patient provider/store.
- `modules/encounter-context`: active encounter provider/store.

## Loading And Error States

The foundation includes reusable loading and empty states, typed API success/error helpers, application error classes, and toast notifications.

## Next Phase

Phase 2 should build the Patient Management module on this foundation: UHID generation, patient registration, demographics, insurance, allergies, emergency contacts, document upload to Supabase Storage, patient alerts, medical history, and timeline views.

Recommended Phase 2 screen order:

1. Patient Search Workspace.
2. Patient Registration Flow.
3. Patient Workspace.
4. Timeline System.
5. Alerts Engine.
6. Encounter Context.
