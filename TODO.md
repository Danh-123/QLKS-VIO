# TODO.md - QLKS-VIO Redesign Phases

## Phase 1: Admin Pages Migration/Redesign (✅ Complete)

## Phase 2: User Area Migration/Polish (In Progress [0/9])

### Steps:

2. [ ] app/rooms/page.tsx ← legacy/pages/RoomListPage.tsx (room grid, filters).
3. [ ] app/rooms/[id]/page.tsx ← legacy/pages/RoomDetailPage.tsx (hero carousel, facts, amenities).
4. [ ] app/bookings/page.tsx ← legacy/pages/BookingWizardPage.tsx (wizard steps).
5. [ ] app/search/page.tsx ← legacy/pages/HotelSearchPage.tsx (search form, results).
6. [ ] app/login/page.tsx ← legacy/pages/LoginPage.tsx (auth form).
7. [ ] Image perf audit (sizes, priority, CLS=0).
8. [ ] A11y audit (keyboard, axe WCAG AA).
9. [ ] Test/QA: `npm run dev`, 360px+, Lighthouse.

**Run: `npm run dev` → test /, /rooms, /bookings**

## Future
Phase 3: Perf/A11y final polish.

