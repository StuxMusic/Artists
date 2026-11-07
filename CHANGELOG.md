# Changelog

All notable changes to Stux.Music Artists (artists.stux.music) are documented here. This
project adheres to [Date Versioning](https://datevers.ing) since v26.10.23 (`YY.MM.DD`, the UTC release date, with `-1`, `-2`… for later releases the same day); earlier releases used [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v26.11.07-2

### Changed

- The copyright notice in the footer of every page (11 pages) credits Stux.Music rather than Stux.Group
- The disclaimer says the Stux.Music name, logo and branding are © Stux.Music (it said © Stux.Group)

## v26.11.07-1

### Changed

- The copyright holder is Stux.Music rather than Stux.Group, in `LICENSE`, `README.md`, `scripts/build-head.py` and `scripts/build-sitemap.py`

## v26.11.07

### Added

- The "Stux.Music" pill above the hero headline is now also a live status badge, linking to status.stux.music. Once
  the status loads it shows just the state (All operational, Degraded, Partial outage or Major outage) in the status
  badge colours, with a dot that pulses while everything is up (not with reduced motion). It reuses the cards'
  `summary.json` fetch, keeps the eyebrow's size and shape, and stays the plain "Stux.Music" pill if the status can't
  load. CONTRIBUTING documents it

## v26.11.06-1

### Added

- A `test` branch: work happens there (or on a branch off it), and changes reach `main` only through a pull request from `test`, reviewed and merged by Leo. CONTRIBUTING has a new Branches section, and the README's Versioning section says so

### Changed

- CI runs on pushes to `test` as well as `main`
- `commit.sh` and `commit.bat` say to push `test` with its tags and open a pull request into `main`, instead of pushing `main`

## v26.11.06

### Added

- `scripts/badge-icons.py` (from StuxGroup/Services, originally TheRidgwells/Projects, set to Stux.Music's colours) builds
  badge-style icons for cards without a logo of their own: Stux.Music's mark on a round avatar, with a badge in the
  bottom-right corner saying what the card is

### Changed

- **Every card uses its full name, with its own icon.** "Status" is Stux.Music Status again, with a heartbeat badge on the
  Stux.Music mark, and "Claim your artist page" is Stux.Music Artistpage (still inviting you to claim one), with a
  microphone badge instead of the plain Stux.Music icon. Each icon's alt text uses the same full name, and the README
  table and CONTRIBUTING match

### Removed

- `assets/img/artists/status.svg`, replaced by the Stux.Music Status badge icon

## v26.10.23

### Added

- A Discord link preview built from Discord components on every page except the 404 page: a card with the site's icon and colour, what the page is, and a couple of link buttons (the home page also lists the artists). The Open Graph fallback stays, and the preview is left out if it would be too big
- A favicon set: `favicon.ico`, `apple-touch-icon.png` and a `site.webmanifest` (with a maskable icon), linked from the `<head>` of every page, including the 404 page
- `scripts/build-head.py`, which writes those tags and the Discord preview into every page, and tests for them (`tests/embeds_test.py`) and for the changelog page reading Date Version headings (`tests/changelogs.test.js`)
- `tests/version.sh`, which checks that `VERSION.md` is a valid Date Version, a real calendar date not in the future, and the same as the newest entry in this changelog

### Changed

- Switched from Semantic Versioning to [Date Versioning](https://datevers.ing): releases are numbered by their UTC release date as `YY.MM.DD`, with `-1`, `-2`… for later releases the same day. This release follows v1.1.0
- `commit.sh` and `commit.bat` refuse a `VERSION.md` that isn't a valid Date Version or is dated in the future (UTC), and warn when it's dated before today
- `README.md` and `CONTRIBUTING.md` describe Date Versioning and the release steps
- CI accepts Date Versions in `VERSION.md` and runs the new tests; the dev server and the site build know about the web manifest

## v1.1.0

### Added

- A light/dark toggle at the end of the header on every page, like the brand pages': it shows the theme it switches to (a sun on dark, a moon on light). Until it's used the site follows the system theme; after that the choice is remembered in this browser

## v1.0.5

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

## v1.0.4

### Changed

- The status card is titled just "Status" (and its icon's alt text "Status icon") instead of repeating "Stux.Music Status"

## v1.0.3

### Fixed

- Card icons no longer sit in a bordered tile (1 icon)

### Removed

- The `.project-icon.on-tile` style, so icons can't be put in the bordered tile again

## v1.0.2

### Fixed

- The hero credits "SeasonalOverlaysLibrary from StuxAPIs" with a link to its site, like the other Stux.Group listing pages
- SeasonalOverlaysLibrary loads from https://seasonaloverlayslibrary.stuxapis.net instead of a vendored copy, so it stays up to date; the Privacy Policy lists it

## v1.0.1

### Fixed

- The Stux.Music Status card now has a live badge, showing that page's overall status (`data-monitor="stux-music:*"`)

## v1.0.0

### Added

- The Stux.Music Artists directory: every Stux.Music artist in one place, modelled on the Stux.Group listing sites and branded for Stux.Music, with dark and light themes
- Cards for Stux Sharp, the featured Stux.Music Status, and a "Claim your artist page" card pointing at the Artistpage template
- One badge per card by precedence (Discontinued, Template, Maintenance, Coming soon), otherwise a live Online / Degraded / Offline badge read from status.stux.music (the `stux-music` source in the status source map, the default for `data-monitor`)
- A status band with an animated dot, reading the overall status of Stux.Music Status
- Seasonal overlays from a vendored SeasonalOverlaysLibrary, with a hero button that replays today's preset
- Boring Legal Stuff hub with its six sub-pages, `/changelogs` (with a `/changelog` redirect), a sitemap page, `sitemap.xml` and `robots.txt`
- A footer with the muted Stux.Music logo, an auto-updating copyright year, a version link to the changelogs, and "Created with love, code and coffee by Stux.Music"
- `dev-server` (Node, `DEV_MODE` on by default with `--no-dev-mode` and the shared site-banner component), `scripts/check-repo-links.sh`, a GitHub Pages workflow, CI and release workflows
