<p align="center">
  <img src="https://global.media.stux.music/logo.png" height="100" alt="Stux.Music Logo">
</p>

# Stux.Music Artists

### *Every Stux.Music artist, in one place.*

[Stux.Music Artists](https://artists.stux.music) is a small, static, no-build-step website that
lists every artist on Stux.Music and links out to each one's own site and releases. It's built the
same way as the other Stux.Group listing sites, in Stux.Music blue.

- Plain HTML, CSS and JavaScript: no framework, no bundler, no dependencies to install
- Dark and light themes, following your system preference
- **Live status** on each card, read from [status.stux.music](https://status.stux.music)
  (`StuxMusic/Status`, powered by [GitHup](https://githup.stux.group))
- **Seasonal overlays** from [SeasonalOverlaysLibrary](https://seasonaloverlayslibrary.stuxapis.net)
  (StuxAPIs): today's preset plays once per visit (never with reduced motion), and the hero button replays it
- Deployed to [GitHub Pages](https://pages.github.com/) by `.github/workflows/pages.yml`
- No accounts, no ads, no cookies, no tracking scripts

---

## Artists listed here

| Artist | What it is | Site | Repo |
|---|---|---|---|
| Stux.Music Status | Live status and uptime history of Stux.Music and its artists' sites | [status.stux.music](https://status.stux.music) | [StuxMusic/Status](https://github.com/StuxMusic/Status) |
| Stux Sharp | Electronic music artist and producer, "Music that Sharply Hits" | [stuxsharp.com](https://stuxsharp.com), releases at [sharp.stux.music](https://sharp.stux.music) | private |
| Claim your artist page | Artistpage, the placeholder page a new artist starts with (Template) | [artistpage.stux.music](https://artistpage.stux.music) | [StuxMusic/artistpage](https://github.com/StuxMusic/artistpage) |

This table (and the matching cards on the site) is the source of truth for what's listed. Update
both together when an artist is added, retired or renamed. Each card shows one badge above its
description: Discontinued, Template, Maintenance or Coming soon (from `data-state`, in that order
of precedence), otherwise a live Online / Degraded / Offline badge when it has a `data-monitor`
(`stux-music:<slug>`) matching a monitor slug in `StuxMusic/Status`'s `.githup.yml`.

## Local development

```
./dev-server.sh          # http://127.0.0.1:8080, DEV_MODE forced on
./dev-server.sh 3000 --no-dev-mode
```

On Windows, use `dev-server.bat` instead. No `npm install` needed: the dev server is a single
dependency-free Node script (`dev-server.js`); Node just needs to be installed. See
[CONTRIBUTING.md](CONTRIBUTING.md) for more.

## Releasing

1. Update `CHANGELOG.md`
2. Bump `VERSION.md`
3. Update this README if relevant
4. Run `./commit.sh` (or `commit.bat`): it reads `VERSION.md`, commits, and tags `vX.Y.Z`
5. `git push origin main --tags`; the release workflow then publishes a GitHub Release from the
   matching `CHANGELOG.md` section

## License

&copy; 2026 Stux.Group. All rights reserved. This repository is not licensed for reuse or
redistribution. Lato and Poppins (`assets/fonts/`) are under the SIL Open Font License.

---

*Powering the Stux.Group Ecosystem | Part of the Stux.Group Brand of Companies.*

Stux.Music is operated by Stux Group Ltd, a company registered in England and Wales (company no. 13160574), registered office 82a James Carter Road, Mildenhall, England, IP28 7DE.
