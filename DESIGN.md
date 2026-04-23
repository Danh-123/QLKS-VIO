---
name: vio-luxury-design-spec
description: Implementation-ready design system and UI blueprint for VIO hotel website + admin dashboard (frontend-only).
type: design-spec
category: frontend
priority: high
---

<!-- GSD-META: type=design-spec, category=frontend, auto-inject=true, version=2.0 -->

# VIO Luxury — UI/UX Specifications

## Mission
Xay dung bo quy chuan giao dien cao cap, de trien khai nhanh va dong nhat cho toan bo User + Admin area cua du an VIO. Tinh uu tien: mobile first, cam giac luxury tinh gian, va hieu nang thuc te (LCP/CLS).

## Product Scope
- Product: VIO hotel booking website + admin operation dashboard
- Tech: Next.js App Router, frontend-only, du lieu mock/external API
- Areas:
  - User area: home, rooms, room detail, booking wizard
  - Admin area: dashboard, rooms, bookings, customers, pricing, roles
- Success metrics:
  - User: tim phong nhanh, dat phong tin cay, form de dung tren mobile
  - Admin: thao tac cap nhat nhanh, bang du lieu ro rang, khong roi

## Visual Direction
- Design language: Quiet Luxury, editorial spacing, contrast mem
- Atmosphere: warm, calm, high-end boutique
- Principles:
  - Chu dep, dung nhieu khoang tho
  - Mau co chieu sau, tranh "ui phang"
  - Motion nhe, khong giat, uu tien doc de

## Token System

### Typography
- Display font: phong cach serif sang trong cho heading lon
- Body font: sans de doc tot tren mobile
- Scale khuyen nghi:
  - xs: 12
  - sm: 13
  - md: 14
  - lg: 16
  - xl: 20
  - 2xl: 28
  - 3xl: 36
  - 4xl: 48
- Heading tracking: 0.02em -> 0.04em
- Body line-height:
  - mobile: 1.72 -> 1.86
  - desktop: 1.8 -> 1.95

### Color Roles (map voi token hien co)
- Base dark: vio-near-black
- Surface warm: vio-parchment, vio-ivory
- Accent: vio-terracotta
- Border: vio-border-cream
- Text secondary: vio-stone-gray
- Rule:
  - Khong dung den tuyet doi #000 cho text body dai
  - Khong dung xam qua mo lam giam contrast

### Spacing Scale
- Core scale: 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 56, 72
- Vertical rhythm:
  - section mobile: 48 -> 64
  - section desktop: 80 -> 112

### Breakpoints
- micro-sm: 360px (compact)
- sm-plus: 390px (modern small phones)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Motion Rules
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
- Durations:
  - micro: 160ms
  - fast: 260ms
  - standard: 420ms
  - editorial reveal: 520 -> 660ms
- Mobile-specific guidance:
  - Giam quang duong animate (y/x) 20-35% so voi desktop
  - Giam duration 15-25% de tranh cam giac lag
  - Stagger toi da 60-80ms
- Reduced motion:
  - Ton trong prefers-reduced-motion
  - Chuyen ve fade nhe, bo parallax

## Image Performance Standards

### next/image Policy
- Tat ca anh content dung next/image
- Uu tien fill + parent co aspect ratio ro rang
- Tuyet doi tranh layout shift do thieu khung

### LCP Strategy
- Chi 1 anh hero chinh moi trang duoc priority
- Cac anh khac lazy default
- sizes bat buoc theo section, khong dung "100vw" cho tat ca

### Recommended sizes patterns
- Full bleed hero:
  - sizes="100vw"
- Two-column editorial:
  - sizes="(max-width: 390px) 92vw, (max-width: 768px) 88vw, 45vw"
- Cards 3 cot desktop:
  - sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
- Thumbnail strip:
  - sizes="(max-width: 640px) 72px, 96px"

### CLS Guardrails
- Moi image wrapper phai co 1 trong 2:
  - aspect-[x/y]
  - min-h co dinh
- Tranh thay doi text wrapping dot ngot do heading qua dai tren 360px

## Accessibility Baseline (WCAG 2.2 AA)
- Keyboard full path cho booking flow va admin table actions
- Focus ring ro, contrast cao, khong an outline
- Tap target toi thieu 44x44
- Form errors co thong bao cu the + aria-live khi can
- Bang du lieu admin:
  - scope="col"
  - aria-sort khi sortable

## Page-Level Specifications

### 1) Home
- Hero:
  - H1 toi da 2 dong o 390px, 3 dong o 360px
  - CTA chinh o fold dau tien
  - Parallax nhe, khong qua 28px tren mobile
- Featured rooms:
  - card image 3:4 mobile, 4:5 desktop
  - spacing card gap mobile 24-32
- Story section:
  - text stack truoc, image sau tren mobile
  - image co aspect ratio co dinh de bao CLS
- Banner experience:
  - motion image dung motion div + next/image
  - text width toi da 42ch

### 2) Room Detail
- Hero editorial carousel:
  - transition 520-580ms mobile
  - thumbnail hit area >= 44px
- Body content:
  - chia section ro: story, key facts, amenities, related
  - heading mobile uu tien 2 cap co do chenh ro
- Related cards:
  - card image sizes theo card grid
  - button full width mobile

### 3) Booking Wizard
- Step transition:
  - x offset ngan (8-10px)
  - duration 360-420ms
- Step 1 summary block:
  - compact tren 360/390, khong tran dong
- Step 2 room cards:
  - image optimized sizes
  - card spacing giam 10-20% tren man nho
- Step 3 preferences:
  - language ngan, tone luxury but practical

### 4) Admin Dashboard
- Layout:
  - sidebar dep, clean, states ro (active/hover/focus)
  - content khong qua sat vien man hinh
- Stats cards:
  - hierarchy ro: metric > trend > context
  - skeleton loading dong bo
- Tables:
  - sticky header (neu can)
  - status badge tokenized
  - pagination de chot o mobile

## Component Standards

### Buttons
- Variants: primary, secondary, ghost, destructive
- Heights: 40 / 44 / 48
- Disabled khong duoc giam contrast qua muc doc duoc

### Cards
- Border nhe + shadow mem
- Radius: 12 -> 18 theo cap
- Hover:
  - desktop: lift nhe
  - mobile: han che transform, uu tien brightness

### Badges
- Status colors phai map 1-1 voi semantics
- Text uppercase nhe, tracking 0.12-0.2em

### Tables (admin)
- Header sticky voi nen solid
- Row hover ro, khong loe
- Actions icon co aria-label ro nghia

## Content Tone
- User-facing:
  - calm, refined, warm
  - cau ngan, tranh marketing overclaim
- Admin-facing:
  - task-first, ro rang
  - labels hanh dong truc tiep

## Error and Empty States
- Empty rooms:
  - thong diep ro nguyen nhan + CTA reset
- Booking invalid dates:
  - error inline gan field
- API fail:
  - thong bao ngan + nut Retry

## QA Checklist
- [ ] Visual dung token va nhat quan giua User/Admin
- [ ] Breakpoints dat chuan cho 360, 390, 768, 1024, 1280
- [ ] Keyboard flow cho booking va admin table
- [ ] Axe khong loi nghiem trong
- [ ] Khong con img thuan trong code giao dien
- [ ] LCP page user <= target noi bo
- [ ] CLS moi page <= 0.1
- [ ] Build va lint pass on clean run

## Implementation Order (de thuc thi)
1. Add luxury fonts and complete token mapping.
2. Build shared admin components: card, table, badge.
3. Redesign admin sidebar + shell layout.
4. Migrate dashboard/rooms/customers tables ve component moi.
5. Chay lint + build + visual QA 360/390.

## Anti-Patterns
- Khong hardcode mau/font tai component layer
- Khong animate qua nhieu tren mobile
- Khong dat sizes anh chung chung cho moi section
- Khong dua auth demo vao localStorage neu khong can
- Khong merge neu chua test 360px viewport

## Version History
- v2.0 (2026-04-22): Rewrite complete spec theo huong VIO Luxury, mobile micro-breakpoints (360/390), motion tuning va image performance standards.