# Changelog

All notable changes to Stux.Music Artists (artists.stux.music) are documented here. This
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
