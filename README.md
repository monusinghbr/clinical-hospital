# Clinical Hospital Workstation Simulator

Frontend-only enterprise clinical operations simulator built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, and dense seeded hospital data.

The application is intentionally workstation-first:

- `/workspace` is the main clinical operating surface.
- `/login` is a simulated local workstation entry screen.
- `/settings` exposes simulator configuration and local feature state.
- Realtime, telemetry, alerts, workflow queues, patient context, and escalation behavior are simulated in the browser.

No backend, Prisma client, API route handlers, external auth server, Supabase runtime, Docker, or self-managed infrastructure is required for the current simulator phase.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/workspace](http://localhost:3000/workspace).

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```
