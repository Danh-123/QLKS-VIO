# QLKS-VIO Next Migration

Next.js App Router migration base for QLKS-VIO.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- React 19

## Run Project

1. Install dependencies

	npm install

2. Run dev server

	npm run dev

3. Open browser

	http://localhost:3000

4. Build production

	npm run build

## Migrated Route Map (preserved path names)

- /
- /search
- /rooms
- /rooms/[id]
- /book
- /bookings
- /bookings/create
- /admin
- /admin/bookings
- /admin/matrix
- /admin/calendar
- /admin/rooms
- /admin/pricing
- /admin/customers
- /admin/staff

## API Endpoints

- GET /api/rooms
- GET /api/rooms/[id]
- GET /api/bookings
- POST /api/bookings
- PATCH /api/bookings/[id]
- GET /api/users

All endpoints simulate network latency and return mock-backed data.

## State Architecture

Contexts retained and moved into Next app provider pipeline:

- contexts/UserStoreContext.tsx
- contexts/BookingStoreContext.tsx
- contexts/RoomStoreContext.tsx
- contexts/AppDataContext.tsx
- app/providers.tsx

Realtime simulation extracted to:

- components/RealtimeSimulation.tsx

Intervals are cleaned up on unmount.

## Business Logic Preservation

Logic is preserved in lib/businessLogic.ts:

- Booking date validation
- Pricing calculation (including service fee)
- Availability checking

API mutation handlers call this logic before writing data.

## UX Patterns Preserved

- Loading spinner
- Skeleton loading
- Empty state components
- Error handling for booking create/update

## What Changed vs Legacy Vite App

1. Routing moved from react-router setup to App Router file-based routes.
2. Context providers moved to app/providers.tsx and wired in app/layout.tsx.
3. Fake client-side delay moved into Next API routes.
4. Realtime setInterval simulation extracted into dedicated client component.
5. Added route handlers for room detail and booking mutation flows.

## Validation Checklist

1. Open /rooms and verify list renders.
2. Open /rooms/[id] and verify detail page resolves from API-backed store.
3. Open /bookings/create and create a booking.
4. Confirm booking appears in /bookings.
5. Change booking status in /admin/bookings.
6. Verify status update reflected in /bookings.
7. Wait on /admin or /rooms and observe realtime simulation updates.
8. Call API endpoints directly and verify response status + payload.

## Notes

- This is a migration base and can be extended to mirror every legacy UI detail.
- Data storage is in-memory for demo/testing and resets on server restart.
