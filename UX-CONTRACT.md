# Phoenix Mall interaction contract

Visual identity: [DESIGN.md](DESIGN.md). Existing API contracts and authentication rules remain authoritative.

| Capability | Canonical owner | Contract |
| --- | --- | --- |
| Navigation | React Router and layout/Header | Links navigate; current destination is exposed; mobile dialog uses shared Sheet. |
| Form | Existing form owners and ui/input | Search submits to /shop?search=; clear returns focus; no native validation bubbles on new forms. |
| Select/Listbox | components/ui/select | Radix authored dropdown for newly introduced selects. Existing shop selection remains unchanged. |
| Scrollbar | src/index.css | Globally visible neutral track/thumb with hover and forced-colors support. |
| Toast | hooks/use-toast and ui/toaster | Existing shared status feedback; inline errors for recoverable data failures. |
| CRUD | lib/api and existing page owners | Preserve seller/authentication rules and existing destinations. |

Homepage requests eight newest listings and provides a link to the paginated shop. A failed request has an inline retry; successful empty data invites listing an item. Category navigation uses maintained category slugs. Search and filters retain the existing shop URL contract. No fabricated data substitutes for failed requests.

Wishlist changes use favoritesApi, announce results through the shared toast, and prevent concurrent toggles for the same item. Favorites actions are separate from product links. Image failures use a local fallback. All new icon buttons have accessible names. Respect reduced motion and mobile safe areas.
