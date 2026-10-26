# Phoenix Mall UI implementation plan

**Goal:** Implement the approved editorial marketplace direction.
**Architecture:** Keep shared React components and API contracts; establish CSS tokens, then migrate discovery and listing surfaces.
**Tech stack:** React, TypeScript, Tailwind, Radix, Vite.
**Spec:** DESIGN-PROPOSAL.md (approved).

## Constraints
Keep the brand colors, existing API behavior, and current branch. Commit completed steps without co-author trailers. Do not fabricate availability, reviews, or guarantees.

## Review focus
Search must reach the shop with its query. Categories must use existing slugs. API errors must differ from empty data. Mobile layouts must not overflow. Saved-item controls must be independently keyboard accessible.

## Tasks
- [ ] Foundation: create DESIGN.md and UX-CONTRACT.md; refine global focus, motion, scrollbars, typography and buttons. Check build and commit.
- [ ] Discovery: rebuild HeroSection, CategoriesSection, Index and Footer; preserve live API data, add retry, working search and clear. Check TypeScript/build and commit.
- [ ] Shopping: refine Header, ProductGrid, HeroBanner and shared shopping presentation. Check navigation and responsive layouts; commit.
- [ ] Verification: run lint, TypeScript, build, strict UI audit and browser checks; resolve introduced problems, document limitations, and commit.

## Execution ledger
Approved direction; implementation runs inline on main as requested. Existing lint debt will be reported separately. Visual changes use build and browser checks rather than tests that merely mirror markup.
