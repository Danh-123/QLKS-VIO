========================================
GLOBAL UI RULE: RESPONSIVE COMPLIANCE (MANDATORY)
========================================

Before making any changes, you MUST:

1. READ AND ANALYZE EXISTING FILE
- Understand current layout structure (grid, flex, spacing)
- Identify responsive issues:
  - broken layout
  - inconsistent spacing
  - non-adaptive components

----------------------------------------

2. RESPONSIVE IS NOT OPTIONAL
- Every UI change MUST be responsive
- Mobile-first approach is REQUIRED
- Desktop-only design is NOT allowed

----------------------------------------

3. BREAKPOINT SYSTEM (TAILWIND)

You MUST use:

- default (mobile): <640px
- sm: ≥640px
- md: ≥768px
- lg: ≥1024px

----------------------------------------

4. LAYOUT RULES

You MUST ensure:

- Mobile:
  - flex-col
  - grid-cols-1
  - full width elements

- Tablet:
  - sm:grid-cols-2

- Desktop:
  - lg:grid-cols-3 (or appropriate)

----------------------------------------

5. CARD SYSTEM (CRITICAL)

All cards MUST:

- use:

  flex flex-col h-full

- have equal height
- have consistent spacing
- NOT depend on content length

CTA MUST be pinned:

  mt-auto

----------------------------------------

6. IMAGE RULE (MOST IMPORTANT)

All images MUST:

- use fixed ratio:

  aspect-[4/3]

- use:

  object-cover

- prevent layout shifting

----------------------------------------

7. FORM RESPONSIVENESS

Forms MUST:

- mobile: flex-col
- desktop: flex-row

Inputs:

- mobile: w-full
- desktop: adaptive

----------------------------------------

8. BUTTON RULE

Buttons MUST:

- mobile:

  w-full
  large touch area

- desktop:

  w-auto

----------------------------------------

9. SPACING SYSTEM

- Mobile:

  p-4 gap-4

- Desktop:

  md:p-6 lg:p-8

----------------------------------------

10. TEXT SCALING

- Title:

  text-2xl md:text-4xl

- Body:

  text-sm md:text-base

----------------------------------------

11. CONTAINER RULE

Wrap main content:

  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

----------------------------------------

12. FINAL VALIDATION (MANDATORY)

Before returning code, you MUST verify:

- No layout breaking on mobile
- No horizontal scroll
- No overlapping elements
- Cards are aligned evenly
- UI is readable on small screens
- Buttons are easy to tap

----------------------------------------

FINAL INSTRUCTION:

If any responsive issue exists → you MUST fix it before returning code.

DO NOT skip responsive validation.