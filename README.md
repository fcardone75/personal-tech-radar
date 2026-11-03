# personal-tech-radar

My personal Technology Radar — technologies, architectural decisions and continuous learning.

Live: https://fcardone75.github.io/personal-tech-radar/

## Editing the radar

All content lives in two files. The build fails if they break the schema.

- `src/data/radar.json` — the entries and the edition.
- `src/data/projects.json` — the projects that entries point to with `usedIn`.

Each entry:

| Field          | Values                                                              |
| -------------- | ------------------------------------------------------------------- |
| `id`           | kebab-case, unique. Used in shareable links: `…/#gitops`            |
| `name`         | display name                                                        |
| `quadrant`     | `techniques`, `platforms`, `languages`, `data-ai`                   |
| `ring`         | `adopt`, `trial`, `assess`, `hold` — my recommendation, not my skill |
| `movement`     | `none`, `new`, `moved-in`, `moved-out` (since the last edition)     |
| `why`          | one short sentence, under 140 characters                            |
| `since`        | first year I used it, or `null`                                     |
| `usedIn`       | project ids from `projects.json` (can be empty)                     |
| `lastReviewed` | `YYYY-MM`                                                           |
| `edition`      | `YYYY.MM`                                                           |

Entries under `pending` are never published (Angular is there until its ring is decided).

Blip positions, numbers, counts and legends are all computed from the data.
Placement is deterministic: same data, same radar.

### New edition

1. Change `edition` in `radar.json`.
2. For every entry that changed ring, set `movement` to `moved-in` or `moved-out`; for new entries use `new`; reset the others to `none`.
3. Update `lastReviewed` and `edition` on the entries you reviewed.

## Development

```bash
npm install
npm run dev          # local server
npm run check        # lint + typecheck + unit tests + production build
npm run test:e2e     # Playwright smoke tests (run `npm run build` first)
```

CI runs the same gates on every pull request. A push to `main` deploys to GitHub Pages only if all of them pass.

## Design tokens

Colours, type and spacing are CSS custom properties at the top of `src/style.css`.
Ring colours: Adopt `#45e3b0`, Trial `#79a9ff`, Assess `#ffc579`, Hold `#f38ea2`.
Fonts (Space Grotesk, DM Sans) are self-hosted through `@fontsource`, so the page makes no third-party requests.
