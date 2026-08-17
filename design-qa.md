# Design QA — PAROLA500

**Source visual truth**

- User-provided reference: `/Users/alessandro.distefano/Downloads/Screenshot 2026-08-17 at 18.49.42.png`
- Live-source captures: `/Users/alessandro.distefano/Documents/ChatGPT/New project/reference/word500-desktop-clean.png`, `word500-mobile.png`, `word500-difficulty.png`, `word500-mode.png`, `word500-stats.png`
- Source dimensions: 1178 × 1404 px for the user reference. The live page was inspected at CSS viewports 1178 × 1404 and 390 × 844.

**Implementation evidence**

- Desktop: `/Users/alessandro.distefano/Documents/ChatGPT/New project/parola500/qa/implementation-desktop-final-viewport.png`
- Mobile: `/Users/alessandro.distefano/Documents/ChatGPT/New project/parola500/qa/implementation-mobile-play.png`
- Help: `/Users/alessandro.distefano/Documents/ChatGPT/New project/parola500/qa/implementation-desktop-help.png`
- Statistics: `/Users/alessandro.distefano/Documents/ChatGPT/New project/parola500/qa/implementation-mobile-stats.png`
- Side-by-side comparison: `/Users/alessandro.distefano/Documents/ChatGPT/New project/parola500/qa/full-comparison-final.png`
- Desktop CSS viewport: 1178 × 1404 at density 1. The in-app browser capped a normal viewport capture at 1178 × 1200; measured page extent was 1178 × 1404.
- Mobile CSS viewport and capture: 390 × 844 at density 1.
- Corrected state tested in browser: practice puzzle with one submitted guess (`ZAINO` → `113`), one manual red annotation, and a compatible suggested word (`TIMEO`).

**Full-view comparison evidence**

The combined comparison confirms the same dark page structure, 1000 px header, eight-column/eight-row board, persistent green-yellow-red score columns, centered game area, QWERTY keyboard, strong block display type, rounded tiles, and matching semantic feedback palette. The implementation uses an original PAROLA500 wordmark and text controls rather than copying the source logo or icon assets.

**Focused-region comparison evidence**

- Board measured at 762 × 762 CSS px on desktop, matching the target's dominant square board scale.
- Header measured at 1000 × 112 CSS px.
- Keyboard measured at 1000 × 361 CSS px and uses the same three letter rows plus an action row.
- Mobile board measured at 374 × 374 CSS px; keyboard measured at 374 × 209 CSS px. Total page width remained 390 px with no horizontal or vertical overflow at 390 × 844.
- Modal and statistics captures confirm readable type, clear hierarchy, correct focus targets, and no clipped controls.

**Primary interactions tested**

- Closed onboarding and started the game.
- Entered a five-letter word with the on-screen keyboard and submitted it.
- Verified that submitted letters stay neutral while only the three count tiles reveal `113`.
- Clicked a submitted letter and verified the manual cycle begins at red; used **Azzera** and verified it returns to neutral.
- Verified that the keyboard only marks used keys neutrally and never reveals semantic colors.
- Verified **Suggerisci** inserts a word compatible with every previous count without identifying a secret letter.
- Verified **Spazio** inserts `_` as an unknown-position placeholder.
- Submitted `ZAINO`, confirming acceptance by the expanded 9,246-word dictionary.
- Opened and closed Statistics.
- Opened the Mode menu and switched to Allenamento.
- Checked the browser console after each primary flow: no errors or warnings.

**Comparison history**

- Iteration 1 — P2: desktop board and keyboard were visibly smaller than the reference. Board was 612 px wide and keyboard 760 px wide.
- Fix: increased the desktop board to 762 px, matched row/column gaps, increased the header to 112 px, increased keyboard key height, and expanded the keyboard/game container to 1000 px.
- Post-fix evidence: desktop metrics show board 762 × 762, header 1000 × 112, and keyboard 1000 × 361. Mobile sizing remains unchanged under the 660 px breakpoint and still fits 390 × 844 without overflow.

**Findings**

- No actionable P0, P1, or P2 issues remain.
- Typography: Source Sans 3 is used for interface text; Archivo Black provides a close, legible display weight for the original PAROLA500 wordmark. Weight, wrapping, line height, and hierarchy remain stable on desktop and mobile.
- Spacing and layout: major dimensions, board rhythm, tile radii, header proportions, keyboard grouping, and responsive fit match the captured product structure.
- Colors and tokens: background, neutral surfaces, borders, green/yellow/red semantic states, text contrast, and focus outlines are consistent and accessible.
- Image/asset fidelity: no source assets are hotlinked or copied. The implementation deliberately uses an original text wordmark and no decorative image assets.
- Copy: all game-specific language, help, errors, modes, levels, statistics, and result messaging are in Italian.
- Rules: implementation was checked against the original Word500 help page; exact letter states remain hidden and user annotations are independent of the secret answer.

**Follow-up Polish**

- P3: the original uses icon-only header controls while PAROLA500 uses Italian text labels; this is an intentional clarity and originality choice.
- P3: the source screenshot contains five guesses while the final comparison capture contains one; the component state and scoring pattern are equivalent.

**Implementation Checklist**

- [x] Desktop and mobile layout verified.
- [x] Core play interaction verified.
- [x] Menus, modal, statistics, and practice mode verified.
- [x] Browser console checked.
- [x] No P0/P1/P2 visual findings remain.

final result: passed
