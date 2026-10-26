# Marketplace redesign verification

Implemented on `main`, retaining the existing red/black/white palette, API modules and authentication rules. Checkpoint commits contain no co-author trailers.

## Changed experience

- Editorial homepage with local category photography, working search/clear, compact categories, real newest listings and a seller invitation.
- Shared header with Radix account dropdown and mobile Sheet, clear mobile bottom navigation, and a restrained footer linking to implemented destinations.
- Listing cards with independent save buttons, real ratings only, local image fallback, loading/empty states and accessible layout controls.
- Shop introduction, consistent spacing, live category URL handling, stale-response protection and inline retry on product failures. Product details receive shared navigation and refined image framing.
- Removed random homepage reviews, hardcoded brand totals, inactive promotional buttons and simulated newsletter success.

## Results

- `npx tsc --noEmit -p tsconfig.app.json`: passed.
- `npm run build`: passed. Existing large-bundle warning and outdated Browserslist data remain.
- Focused ESLint on rewritten header, footer, mobile navigation, hero, banner, categories, product grid and homepage: passed.
- Full `npm run lint`: 48 errors / 32 warnings. Baseline at `701e083`, checked from an archived copy: 49 errors / 35 warnings. Remaining findings concern existing API types and legacy screens/components; the repository is not lint-clean.
- `npx --yes --package @google/design.md designmd lint DESIGN.md`: passed, zero errors/warnings.
- `git diff --check`: passed.
- `node scripts/verify-marketplace.mjs`: passed in local Chromium with browser-only API fixtures. Covers populated categories/listings, empty and failure/retry states, real search input and clear/focus restoration, search query navigation, category navigation while already on the shop, guest save feedback, mobile menu focus/Escape/restoration, reduced motion and overflow at 320/390/768/1024/1440px.
- Desktop/mobile screenshots inspected. Local hero images loaded successfully. Live API failure states separately inspected without fixtures.

The standalone browser check needs the Vite server on port 8080 and Chromium with `--remote-debugging-port=9222`. It does not write fixture data to the application or server. Screenshots are written to `/tmp/phoenix-*.png`.

## Static audit and limitations

The strict premium UI audit reports 22 findings, so full application compliance is not claimed. Two Header findings are static false positives: Radix `asChild` triggers supply the interaction handlers; mobile trigger behavior was exercised in the browser. The other findings concern existing native-select ownership, inert legacy controls, legacy form validation declarations, and textarea literal markup. Global textarea resize behavior is defined in CSS. Full audit output is recorded in `docs/ui-audit.json`.

The API server was unavailable. Authenticated saves, seller operations and real inventory responses could not be verified end to end. Populated screenshot data is explicitly browser-test fixture data, never production fallback content. Existing shop filter/sort overlay behavior was preserved; a comprehensive accessibility retrofit of all legacy screens is outside this redesign.

Photography: existing Unsplash category imagery plus three locally downloaded Unsplash photos (1546435770-a3e426bf472b, 1542291026-7eec264c27ff, 1503602642458-232111445657). They illustrate categories, not advertised inventory.
