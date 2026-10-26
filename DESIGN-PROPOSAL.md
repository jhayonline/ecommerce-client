# Phoenix Mall UI direction

Status: approved and implemented. See docs/ui-verification.md for verification and limitations.

## Intent

Make Ghana's Phoenix Mall marketplace inviting to explore and straightforward to use. Preserve the existing red, black, white, and neutral gray brand. Work on `main`, with separate commits for completed steps and no co-author trailers.

## Recommended direction: an editorial marketplace

Use oversized, tightly composed headlines, generous white space, strong product photography, and precise red accents. The first screen should explain the marketplace and immediately offer search, browsing, and selling. Product pages and account screens should retain practical, familiar controls.

The homepage composition:

1. A compact brand header with clear browsing, saved items, account, and selling entry points.
2. A headline such as “Your next great find. Right here.” alongside a composed photographic feature. A prominent search submits into the existing shop route. Category shortcuts offer a second way in.
3. A compact category grid with consistent image proportions and always-visible labels.
4. Newest listings using actual API data, clear prices in GHS, locations, and accessible save controls. Loading, empty, and unavailable states have distinct explanations and recovery actions.
5. A selling invitation and restrained footer with working destinations.

Avoid fabricated popularity, random ratings, unsupported guarantees, decorative counters, and controls with no behavior. Photography representing categories must not imply a specific item is available.

## Alternatives considered

- Dense classifieds: puts many listings and filters above the fold, but gives Phoenix Mall less visual character.
- Campaign-led storefront: emphasizes large lifestyle photography, but pushes everyday browsing further down.
- Editorial marketplace (recommended): gives the brand a memorable opening while keeping search and real listings central.

## Scope and constraints

Keep React, TypeScript, Tailwind, React Router, existing API modules, and maintained Radix/shadcn primitives. Improve the shared header, footer, product grid, category browsing, homepage, and the visual consistency of the shop and product-detail experience. Preserve authentication, pricing, messaging, and seller business rules.

The existing homepage is `src/pages/Index.tsx`; `HomePage.tsx` is not the routed homepage. Existing primary/accent values are `hsl(0 84% 55%)`. Use existing brand values rather than introducing another accent palette.

Replace exaggerated hover scaling and looping hero rotation with restrained transitions. Honor reduced motion. Ensure visible keyboard focus, semantic links/buttons, legible text, usable mobile navigation, and stable image geometry.

## Implementation checkpoints

1. Establish the visual and interaction contracts and shared styling.
2. Rebuild the homepage composition and category discovery.
3. Refine shared listing presentation, navigation, and shopping screens.
4. Verify and polish responsive layouts and interaction states.

Commit each completed checkpoint on the current branch using ordinary commit messages without attribution trailers.

## Verification

Run the production build, TypeScript checking, lint, and design contract checks. Separate existing lint findings from introduced problems. Inspect desktop and narrow mobile views in a browser; check search navigation, category links, listing navigation, menus, focus, reduced motion, and API failure/empty states. Do not claim authenticated backend workflows passed when the server or test account is unavailable.
