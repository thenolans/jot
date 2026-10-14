# Design

Prototypes Jot is built from. They're design references, not app code: build from their layout and behavior with the app's components and tokens (see `CLAUDE.md`), not their inline styles. Open a file in a browser to try it; it needs `support.js` and `assets/` beside it.

- `Jot Prototype.dc.html` — the app: landing page, notes grid, note editor (read and edit), folders (desktop sidebar, phone bottom sheet and tab bar), ⌘K search, sharing, settings. Its links to other apps' prototypes aren't included.
- `Login and Registration.dc.html` — sign-in and account creation, shared by all the apps: a split card with a brand panel on wide screens, a banner header on narrow ones. Avocado's `AuthLayout` is built from it.
