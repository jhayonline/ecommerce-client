---
version: alpha
colors:
  primary: "hsl(0 84% 55%)"
  foreground: "#000000"
  background: "#ffffff"
  muted: "#f5f5f5"
  border: "#e5e5e5"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
rounded:
  card: "16px"
  control: "12px"
spacing:
  section: "72px"
  gutter: "24px"
---
# Phoenix Mall

## Overview
A Ghanaian marketplace with the confidence of an independent product magazine. The signature is an oversized headline beside an asymmetric photographic category composition. Homepage expression is balanced by familiar, practical shop and account controls.

## Colors
Preserve red, black, white, and neutral gray. Runtime ownership is `src/index.css`: primary/accent map to existing `--primary`/`--accent`; foreground/background, muted and border map to their namesake CSS variables. Tailwind consumes these through `tailwind.config.ts`. Red signals primary actions and selection; keep content surfaces neutral. Dark mode retains existing semantic tokens.

## Typography
Use a heavy Arial display with tight tracking for the homepage headline; existing system/Inter stack for controls and reading. Use large scale instead of decorative gradient words. Section titles are left-aligned, compact and direct. Currency uses tabular numerals.

## Layout
Maximum content width 1280px, responsive gutters 20–40px. Homepage uses an asymmetric two-column hero, a compact category grid, then listings. Collapse the hero on phones; product grids retain two columns where readable. Product and account pages favor task clarity. Reserve image aspect ratios and loading space.

## Elevation & Depth
Thin neutral borders and quiet surfaces. Shadows only clarify raised controls, overlays, and the hero's photographic composition. Avoid glow and blanket hover lifts.

## Shapes
16px cards, 12px controls, pill-shaped category shortcuts. Keep icon geometry consistent using Lucide.

## Components
Shared navigation: `components/layout/Header.tsx`; listing cards: `components/sections/ProductGrid.tsx`; foundational controls: `components/ui`. Links navigate; buttons perform actions. Every active control has hover and keyboard focus. Image crops must retain recognizable products; category photographs are illustrative, never fake listings. Reduced motion disables animation and smooth scrolling.

## Do's and Don'ts
Use real inventory and truthful empty/error states. Never invent reviews, discounts, product totals, testimonials or delivery guarantees. Keep photography and typography expressive; avoid rainbow category gradients and repeated promotional badges. Preserve authenticated workflows.
