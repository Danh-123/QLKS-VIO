# Next Work Items

## Muc tieu
Hoan thien redesign theo DESIGN.md tren toan bo he thong, khong chi cac man admin chinh.

## Cong viec tiep theo uu tien cao

1. Redesign cac trang admin con lai theo format moi
- BookingCalendarPage
- PricingRulesPage
- StaffRolesPage
- Rooms matrix va cac page quan tri chua migrate
- Dam bao dong nhat sidebar/header/table/card/badge moi

2. Chuan hoa user area theo cung bo token
- Home, RoomDetail, BookingWizard da duoc polish, can ra soat tiep RoomList, Contact, Login
- Can chinh typography va spacing cho 360px/390px
- Dam bao CTA va form controls dat chuan tap target 44px+

3. Hoan tat image performance pass
- Ra soat lai tat ca image sizes theo tung section
- Dam bao chi 1 anh hero priority moi page
- Verify khong co layout shift o hero, card grid, gallery

4. A11y pass theo WCAG 2.2 AA
- Keyboard navigation cho booking flow va admin tables
- Focus visible ro rang tren tat ca controls
- Chay axe cho cac route chinh: /, /rooms, /rooms/[id], /book, /admin, /admin/rooms, /admin/customers

5. QA va visual regression
- Snapshot/check thu cong o breakpoint: 360, 390, 768, 1024, 1280
- Kiem tra dark-overlay readability tren cac hero section
- Kiem tra state: loading, empty, error, disabled

6. Performance verification
- Chay Lighthouse mobile cho Home, RoomDetail, BookingWizard
- Theo doi LCP, CLS, INP; fix tiep neu chua dat nguong noi bo

7. Chot release FE
- Chay lai lint va build tren nhanh cuoi
- Viet changelog ngan cho redesign phase
- Gom danh sach component da thay doi de handoff

## Definition of Done
- Toan bo User + Admin man chinh dong nhat visual language theo DESIGN.md
- Lint/build pass on clean run
- Khong co warning nghiem trong ve a11y/perf
- Hoan tat test tai 360px va 390px
