# Prompt: Build Fully Responsive Website Pages (Small Phones → Ultra-Wide Screens)

How to use: fill in the `[BRACKETED]` fields in **Part A**, paste Parts A and B into your AI coding agent, and attach `AGENT.MD` (and optionally the docs indexes) as context.

---

## PART A — Master prompt

**Role**
You are a senior front-end engineer and UI designer. You build production-quality pages that look and work correctly on every screen from a 320 px phone to a 2560 px ultra-wide monitor, with mouse, touch, and keyboard.

**Task**
Build [PAGE NAME / ROUTE, e.g. "Explore page at /explore"] for [PRODUCT + AUDIENCE, e.g. "a student learning platform"].
Page purpose: [ONE SENTENCE].
Sections / content, in priority order: [LIST, e.g. hero, search + filters, results grid, pagination, empty state].
Primary user action on this page: [e.g. "find and join a class"].

**Stack (do not change it)**
[e.g. React 19 + Vite, JavaScript/JSX, Tailwind CSS v4, shadcn/ui (base-nova, Base UI), lucide-react, React Router v8.]
Reuse existing components and design tokens before creating new ones.

### 1. Approach: mobile-first, content-driven

1. Design and code the **smallest layout first** (320–360 px wide), then add complexity upward with `sm:` `md:` `lg:` `xl:` `2xl:` prefixes. Unprefixed utilities are the mobile styles.
2. Add a breakpoint only **where the content breaks**, not per device model. Tailwind v4 defaults: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px, `2xl` 1536 px.
3. Use **container queries** (`@container`, `@sm:`, `@md:`, …) for reusable components (cards, list rows, panels) so they adapt to the space they are given rather than to the viewport.
4. Prefer **fluid** techniques over fixed steps: `clamp()` for type and spacing, `minmax()` and `auto-fit` / `auto-fill` grids, `flex-wrap`, `%` / `fr` / `min()` / `max()` widths.

### 2. Layout rules

- **No horizontal scroll at any width** (except intentional scroll regions such as code blocks, wide tables, or carousels, which must scroll inside their own container).
- Page shell: a single centered content container with `max-width` (about 1200–1440 px) and responsive horizontal padding (`px-4 sm:px-6 lg:px-8`). On very large screens, the content stays readable and centered, backgrounds may extend full-bleed. Never stretch text lines across a 2560 px screen.
- **Grids:** 1 column on mobile → 2 on `sm`/`md` → 3–4 on `lg`/`xl`, or `grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]`. Keep consistent `gap` values that scale with the viewport.
- **Navigation:** full nav bar on `lg+`; on smaller screens collapse into a menu button that opens a sheet/drawer. Sidebars become an off-canvas sheet (or a bottom bar) on mobile. Keep the primary action reachable with one thumb.
- **Sticky/fixed elements:** must not cover content or the on-screen keyboard. Add `scroll-margin-top` equal to sticky header height for anchor links.
- **Viewport height:** use `dvh` / `svh` (`h-dvh`, `min-h-dvh`), never bare `100vh`, so mobile browser toolbars don't cut content.
- **Safe areas:** for full-bleed or fixed bars, respect notches with `env(safe-area-inset-top|bottom|left|right)` and `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- **Tables:** on mobile convert rows to stacked cards, or wrap the table in an `overflow-x-auto` container with a visible scroll affordance and a sticky first column.
- **Modals/dialogs:** centered dialog on `md+`; full-height sheet or bottom drawer on mobile, with scrollable body and a fixed footer for actions.
- **Forms:** single column on mobile, multi-column only where fields are naturally paired. Inputs are full width, at least 16 px font size (prevents iOS zoom), correct `type` / `inputmode` / `autocomplete`, labels always visible, errors adjacent to the field.
- **Long content:** handle long words, URLs, and names with `min-w-0`, `truncate` / `line-clamp-*`, `break-words`. Flex children that must shrink need `min-w-0`.

### 3. Typography and spacing

- Fluid type scale, for example `text-[clamp(1.75rem,4vw+1rem,3.5rem)]` for the hero heading; body text stays 16 px minimum on mobile.
- Line length 45–75 characters (`max-w-prose` or `max-w-[65ch]`); line-height 1.4–1.7 for body text.
- Spacing scales with the viewport: tight on mobile (`py-8`), roomy on desktop (`lg:py-16`). Use the Tailwind spacing scale consistently, no arbitrary pixel values unless needed.

### 4. Touch, pointer, and input

- Interactive targets are **at least 44 × 44 px** on touch screens with adequate spacing between them.
- Never rely on hover for essential information or actions. Use `hover:` only as enhancement, and gate with `@media (hover: hover)` behavior where it would otherwise "stick" on touch.
- Every interactive element has a visible **focus-visible** style and is fully keyboard operable; tab order follows visual order.

### 5. Media and performance

- Images: `w-full h-auto` or fixed `aspect-*` ratios to prevent layout shift; `object-cover` / `object-contain` deliberately; set `width`/`height` attributes; `loading="lazy"` below the fold and `fetchpriority="high"` for the hero/LCP image; use `srcset` + `sizes` (or WebP/AVIF) for large images.
- Icons and illustrations: SVG that scales with `currentColor`.
- Avoid layout shift: reserve space for async content with skeletons that match final dimensions.
- Lazy-load route-level code and heavy components; don't ship large libraries for small effects.

### 6. Accessibility and preferences

- Semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`), one `h1`, logical heading order, a "skip to content" link, meaningful `alt` text.
- Text contrast at least WCAG AA (4.5:1 body, 3:1 large text/UI).
- Works at **200% browser zoom** and with increased default font size (use `rem`, not `px`, for type and layout spacing).
- Respect `prefers-reduced-motion` (`motion-reduce:`), `prefers-color-scheme` / the app's dark mode, and `prefers-contrast` where practical.
- Works in portrait and landscape; landscape phones (short height) must not trap content behind fixed bars.

### 7. Required states (design and build all of them)

Loading (skeleton), empty, error (with retry), success, long-content, and offline/slow-network behavior, each verified at mobile and desktop widths.

### 8. Test matrix. Verify before you finish

Check the page at these widths and confirm no overflow, clipping, overlap, or unreadable text:

| Class | Widths (px) |
|---|---|
| Small phone | 320, 360 |
| Phone | 390, 430 |
| Small tablet / foldable | 600, 768 |
| Tablet landscape / small laptop | 1024, 1180 |
| Laptop / desktop | 1280, 1440 |
| Large / ultra-wide | 1920, 2560 |

Also check: landscape phone (about 844 × 390), 200% zoom, dark mode, keyboard-only navigation, and a screen-reader pass on headings/landmarks.
Run the project's lint, tests, and build; fix all failures.

### 9. Output format

1. A brief **layout plan**: what changes at each breakpoint (a short table).
2. The **code**: complete files with paths, no placeholders or "rest unchanged" gaps.
3. A **responsive checklist** showing each item in sections 2–8 as pass/fail, with any deliberate exceptions explained.
4. A short list of **assumptions** you made and any open questions.

### 10. Definition of done

- Every item in the test matrix passes with no horizontal scroll, overlaps, or clipped content.
- All states (section 7) exist and look right at mobile and desktop widths.
- Touch targets, focus styles, contrast, and reduced-motion handling are in place.
- No hard-coded colors or magic pixel values where a design token or scale exists.
- Lint, tests, and build pass.

---

## PART B — Campus Mind addendum (paste with Part A when working in this repo)

Follow `AGENT.MD`. Project-specific constraints:

- **Stack:** React 19, Vite, JavaScript/JSX (no TypeScript), Tailwind v4 via `@tailwindcss/vite`, shadcn/ui `base-nova` on Base UI, lucide-react.
- **Where things go:** page in `src/features/<domain>/pages/`, lazy-imported in `src/routes/AppRoutes.jsx`, path added to `src/routes/paths.js` (use `routes.*`, never hard-coded strings), sidebar entry in `src/config/navigation.js` if needed.
- **Layouts:** authenticated pages render inside `DashboardLayout` (header + collapsible sidebar, `h-dvh` shell with the `<main>` as the scroll container). Public pages use `RootLayout`; auth pages use `AuthLayout`. Do not add a second scroll container or `100vh` inside `main`. Check how the existing sidebar/header behave on small screens (`src/components/ui/sidebar.jsx`, the `useMobile` hook, `Sheet`/`Drawer`) and reuse them.
- **Styling:** use semantic tokens from `src/index.css` (`bg-background`, `bg-card`, `bg-canvas`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`). Dark mode is the `.dark` class on `<html>`, so use `dark:` variants and never hard-code hex colors. Merge classes with `cn` from `@/lib/utils`.
- **Components:** reuse `components/ui/*` and `components/common/*` (`EmptyState`, `SearchInput`, `ContentList`, `CollapsibleSection`, skeletons) before writing new ones. Add new shadcn primitives with the shadcn CLI, keeping `.jsx`.
- **Data:** fetch with RTK Query hooks from the feature's `api/` folder; unwrap responses with `unwrapResponse`; show skeletons while loading and use `parseApiError` for messages. Don't call `fetch` directly for backend endpoints.
- **Tests:** add a co-located Vitest test (`*.test.jsx`) that runs in **Node** using `renderToString` (no jsdom or Testing Library). Assert on responsive class names and rendered states, and mock `react-router`, `react-redux`, and `@/context/AuthContext.jsx` with `vi.mock` as existing tests do.
- **Verification commands:** `npm run lint` → `npm test -- --run` → `npm run build`.

---

## Optional one-line variants

**Quick page:** "Build [PAGE] mobile-first with Tailwind v4 so it works from 320 px to 2560 px: fluid type, no horizontal scroll, 44 px touch targets, `dvh` units, container queries for cards, sheet/drawer patterns on mobile, dark mode, and all loading/empty/error states. Show the breakpoint plan, full code, and a pass/fail checklist."

**Audit an existing page:** "Audit [FILE/ROUTE] for responsiveness at 320, 390, 768, 1024, 1440, and 2560 px. List every overflow, overlap, tiny tap target, fixed-height/`100vh` bug, and hover-only interaction, then fix them with minimal changes and explain each fix."
