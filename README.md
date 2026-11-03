# Personal Technology Radar

**English** · [Italiano](README.it.md)

**See it live: [fcardone75.github.io/personal-tech-radar](https://fcardone75.github.io/personal-tech-radar/)**

My personal technology radar: the techniques, platforms, languages and data/AI tools I use or have evaluated, where I place each one, and why. It is a record of engineering judgement, not a list of skills.

Technology is a choice. Not a checklist.

The site is available in English and Italian: use the flags in the header to switch.

## What it is

The radar is inspired by the [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar), applied to one engineer instead of a company. Every entry comes from real work: each one links to the projects where I used it.

The page has four parts:

1. **The radar.** Every technology is a numbered blip. Select one to see why it sits where it does, since when I use it and in which projects. You can filter by quadrant or ring, search, or switch to a sortable list.
2. **Moves.** What is new and what changed ring since the last edition.
3. **Projects.** The projects behind the radar, and what each one put on it.
4. **Principles.** How I make these choices.

Each entry has its own link, so you can share a single technology: [`…/#gitops`](https://fcardone75.github.io/personal-tech-radar/#gitops).

## How to read it

**Quadrants** group entries by kind:

| Quadrant                   | Contents                                     |
| -------------------------- | -------------------------------------------- |
| Techniques & Architecture  | Practices and architectural patterns         |
| Platforms & Infrastructure | Runtimes, cloud services, infrastructure     |
| Languages & Frameworks     | Programming languages, libraries, frameworks |
| Data & AI                  | Databases, data tooling, AI models and tools |

**Rings** are my recommendation, not my proficiency. Closer to the centre means I trust it more:

| Ring   | Meaning                                                  |
| ------ | -------------------------------------------------------- |
| Adopt  | My default. I use it in production and recommend it.     |
| Trial  | Used on real work. Still proving its fit.                |
| Assess | Promising. I study it before I bet on it.                |
| Hold   | I would not start something new with it.                 |

**Shapes** show movement since the previous edition: a circle means no change, a circle with a halo means new, a triangle pointing up means it moved towards the centre, a triangle pointing down means it moved out.

## How it works

It is a static single-page app, built with React, TypeScript and Vite, and hosted on GitHub Pages. There is no backend: all content lives in JSON files in the repository.

- **Data.** Entries and projects are plain JSON in `src/data/`. A schema check runs at build time, so invalid data fails the build and never reaches the site.
- **Layout.** Blip positions, numbers, counts and legends are all computed from the data. Placement is deterministic: each blip gets a starting point derived from its id, then nearby blips are pushed apart. The same data always produces the same radar.
- **Languages.** Interface text lives in `src/i18n/strings.ts`, typed so that a missing translation fails the type check. Data text (the reasons and project descriptions) is in English in the main JSON files, with the Italian version in `src/data/radar.it.json`. The site opens in the visitor's last chosen language, or else in their browser language.
- **Release.** Every push to `main` runs lint, type check, unit tests, the production build and Playwright end-to-end tests on desktop and mobile. The site is deployed to GitHub Pages only if all of them pass.
- **Privacy.** Fonts are self-hosted, so the page makes no third-party requests. There is no tracking.

## Editing the radar

All content lives in these files. The build fails if they break the schema.

- `src/data/radar.json`: the entries and the edition.
- `src/data/projects.json`: the projects that entries point to with `usedIn`.
- `src/data/radar.it.json`: the Italian `why` of every entry and the Italian description of every project. Every entry and project must have one.

Each entry:

| Field          | Values                                                               |
| -------------- | -------------------------------------------------------------------- |
| `id`           | kebab-case, unique. Used in shareable links: `…/#gitops`             |
| `name`         | display name (not translated)                                        |
| `quadrant`     | `techniques`, `platforms`, `languages`, `data-ai`                    |
| `ring`         | `adopt`, `trial`, `assess`, `hold`: my recommendation, not my skill  |
| `movement`     | `none`, `new`, `moved-in`, `moved-out` (since the last edition)      |
| `why`          | one short sentence, under 140 characters                             |
| `since`        | first year I used it, or `null`                                      |
| `usedIn`       | project ids from `projects.json` (can be empty)                      |
| `lastReviewed` | `YYYY-MM`                                                            |
| `edition`      | `YYYY.MM`                                                            |

Entries under `pending` are never published (Angular is there until its ring is decided).

### Adding an entry

1. Add it to `entries` in `radar.json`.
2. Add its Italian `why` under the same `id` in `radar.it.json`.
3. Run `npm run check`.

### New edition

1. Change `edition` in `radar.json`.
2. For every entry that changed ring, set `movement` to `moved-in` or `moved-out`; for new entries use `new`; reset the others to `none`.
3. Update `lastReviewed` and `edition` on the entries you reviewed.

## Development

Requires Node.js 24.

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
Fonts (Space Grotesk, DM Sans) are self-hosted through `@fontsource`.

## Author

Flaviano Cardone, Senior Cloud & AI Solution Architect and Technical Lead.
