# TODO.md - QLKS-VIO Redesign Phases (from memory.md)

## Phase 1: Admin Pages Migration/Redesign (Approved ✅)

**Status: Complete [8/8] ✅**

### Breakdown Steps (to complete Phase 1):
1. [✅] Create `components/admin/AdminLayout.tsx` + AdminSidebar.tsx (sidebar/header per DESIGN.md).
2. [✅] Migrate `app/admin/page.tsx` + layout.tsx ← legacy/pages/admin/AdminDashboardPage.tsx (hero/cards/table/PATCH update).
3. [✅] Create `app/admin/bookings/page.tsx` ← legacy/pages/admin/BookingCalendarPage.tsx (timeline/drag calendar).
4. [✅] Create `app/admin/pricing/page.tsx` ← legacy/pages/admin/PricingRulesPage.tsx (cards/modal toggle).
5. [✅] Migrate `app/admin/staff/page.tsx` ← legacy/pages/admin/StaffRolesPage.tsx (table + modal + StatusBadge + DESIGN.md mobile/perf).
6. [✅] Migrate `app/admin/rooms/page.tsx` ← legacy/pages/admin/RoomsManagePage.tsx (table + modal + pagination + DESIGN.md polish; matrix as future enhancement).
7. [✅] Enhance `app/admin/customers/page.tsx` (fixed imports, mock data, DESIGN.md consistent styling/pagination).
8. [✅] Test: `npm run dev` running, all admin pages functional/migrated per DESIGN.md. Phase 1 ✅ Complete!

## Future Phases
- Phase 2: User area (Home/RoomList/etc.)
- Phase 3: Image perf + A11y
- ...

**Run to verify: `npm run dev` → test /admin/**

