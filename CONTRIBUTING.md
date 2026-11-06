<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.music/logo-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.music/logo-dark.png"><img src="https://global.media.stux.music/logo-dark.png" height="80" alt="Stux.Music Logo"></picture>
</p>

# Contributing to Stux.Music Artists

Stux.Music Artists is a Stux.Music project, part of the Stux.Group Brand of Companies. The repository isn't open to public pull requests,
and per the [License](README.md#license) section it isn't licensed for redistribution or reuse.
This document exists for anyone with write access working on it consistently.

Questions: [hello@stux.music](mailto:hello@stux.music).

## Local setup

```
git clone https://github.com/StuxMusic/Artists.git
cd Artists
./dev-server.sh
```

No install step: there's no `package.json`, no dependencies, nothing to build. `dev-server.js` is
a single dependency-free Node script; the only requirement is having Node itself installed. Pass
`--no-dev-mode` to test the site as it behaves in production (no dev banner).

## Project conventions

- **Plain HTML/CSS/JS, no framework, no build step.** Every page is a real `.html` file: no
  templating engine, no client-side router. The layout follows
  the other Stux.Group listing sites, recoloured in Stux.Music blue. Colours are CSS custom
  properties in `assets/css/style.css`: dark (`--bg #121214`, `--surface`/`--bg-card #1b1b1f`,
  `--accent #4752ff`) by default, and light (`--bg #f5f5fa`, `--bg-card #fff`, `--accent #000ccc`)
  from the system preference or `<html data-theme="light">`.
- The sitemap (`sitemap.xml`, `sitemap/index.html`, `robots.txt`) is generated: after adding or removing a page, edit the `PAGES` list in `scripts/build-sitemap.py` and run `python scripts/build-sitemap.py`, then run `python scripts/build-head.py` (it writes the favicon tags and Discord embed into every page's `<head>` between `<!-- head:begin -->` and `<!-- head:end -->`; edit that script, not the blocks), then commit the result. Add new root files to the copy step in `.github/workflows/pages.yml`.
- Clean URLs use a folder-per-page layout (`legal/privacy/index.html` → `/legal/privacy/`).
- Shared styles live in `assets/css/style.css`; shared behaviour in `assets/js/main.js`. Copy the
  existing header/footer block when adding a page rather than introducing a templating system.
- `assets/js/dev-mode.js` is the production default (`DEV_MODE = false`), committed as-is.
  `dev-server.js` intercepts that one path locally and serves a generated version instead.
- **Artist icons** go in `assets/img/artists/` (resized to 128 × 128), or use the artist's own
  hosted icon (Stux Sharp's comes from `sharp.media.stux.music/icon.png`) when one exists.
- Give every card its full name, in its heading and its icon's alt text ("Stux.Music Status", not "Status";
  alt="Stux Sharp icon"), and its own icon, never a shared or generic one. A card without a logo of its own gets a
  badge-style icon (Stux.Music's mark on a round avatar, with a badge saying what it is) from
  `python -I scripts/badge-icons.py stux-music <icon-light.png> assets/img/artists --size=128`, where `<icon-light.png>` is a
  download of `https://global.media.stux.music/icon-light.png`; add a glyph and file name there for a new one.
- **Only a few things load from elsewhere**, all Stux.Music's own: live status from
  `raw.githubusercontent.com/StuxMusic/Status`, and the logo and artist icons from the
  `*.media.stux.music` hosts. SeasonalOverlaysLibrary loads from
  `https://seasonaloverlayslibrary.stuxapis.net` (StuxAPIs), and the hero credits it. If you add another external
  load, update the Privacy Policy.

## Adding or retiring an artist card

The list has two sections, in this order: **Featured** and **Artists**; add a **Discontinued**
section after them when an artist is retired. A placeholder-page template (such as the "Claim your
artist page" card) sits under Artists with `data-state="template"`.

1. Add/update the entry in the README's artists table
2. Add/update the matching `<article class="project-card">` block in `index.html`. For an artist
   that belongs to another brand, add `<div class="owner">Brand</div>` above the name
3. **One badge per card**, above the description (`<span class="badge-status ...">` before
   `<p class="desc">`). Declare the state on the `<article>` with `data-state="discontinued"`,
   `"template"`, `"maintenance"` or `"soon"` and render the matching badge in the HTML (e.g.
   `<span class="badge-status soon"><i class="badge-ico" aria-hidden="true"></i>Coming soon</span>`;
   Maintenance uses the `maintenance` class and the same icon element). If several states are
   listed, the first that applies wins: Discontinued, Template, Maintenance, Coming soon
4. **Live status:** with no `data-state`, a card with `data-monitor="<slug>"` (`stux-music:<slug>`, a slug monitored by
   `StuxMusic/Status`; the bare form defaults to the `stux-music` source) gets one live badge from `main.js`: Online, Degraded or Offline. Add
   `<span class="badge-status live" hidden></span>` above the description; don't hard-code a
   "Live" badge, because it can't be kept accurate. No monitor, or status unavailable: no badge
5. When an artist is discontinued, move its card into "Discontinued", add the `discontinued`
   class and `data-state="discontinued"`, drop any dead Website link, and add a one-line `<p class="discontinued-note">` saying why
6. Update the hero's artist count if it changed

## Seasonal overlays

`main.js` asks SeasonalOverlaysLibrary for today's preset from its calendar. It plays once per
browser session (a `sessionStorage` flag), never on its own for people with
`prefers-reduced-motion`, and the hero button (labelled with today's preset) replays it. If the
library can't load, the button stays hidden and nothing else changes.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`),
each its own folder with an `index.html`, linked from the **Boring Legal Stuff** hub at
`legal/index.html`. Keep them in sync with what the site actually does.

## Branches

- Work on `test`, or on a feature branch off it. Never push to `main`
- Changes reach `main` only through a pull request from `test` into `main`, which needs CI to pass and is reviewed and merged by Leo
- Merging into `main` deploys the site to GitHub Pages; release commits and tags are made on `test` (`git push origin test --tags`) and go live when the pull request is merged

## Versioning

This project uses [Date Versioning](https://datevers.ing). To release:

1. Add a `## vYY.MM.DD` entry at the top of `CHANGELOG.md`, with its sections in this order: Added, Changed, Fixed, Removed, Security, Deprecated.
2. Set `VERSION.md` to the same bare version (no `v`): today's **UTC** date as `YY.MM.DD`, or `YY.MM.DD-1`, `-2`… for later releases the same UTC day. Never a future date. Use UTC, not local time: just after midnight in the UK it is still the previous day in UTC.
3. Run `bash tests/version.sh`.
4. Run `./commit.sh` (or `commit.bat` on Windows). It checks the version, commits and tags `vYY.MM.DD`, and never pushes.

## Before committing

- Open changed pages via `./dev-server.sh` and click through: CI checks files and local links,
  but a live look is the only real check of how it renders
- Check both the dev-mode banner (default) and `--no-dev-mode` if you touched `dev-server.js` or
  `assets/js/dev-mode.js`
- Only link a repository if it is public: no "Repository" link on a card for a private or missing repo. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public
