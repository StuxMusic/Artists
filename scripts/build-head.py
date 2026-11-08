#!/usr/bin/env python3
"""Write the shared <head> block into every page of this static site.

Run from anywhere: python scripts/build-head.py   (re-run after build-sitemap.py)
Check only:        python scripts/build-head.py --check

The block sits between <!-- head:begin --> and <!-- head:end --> just before </head>:
  * the favicon set (favicon.ico, apple-touch-icon.png, site.webmanifest) on every page, and
  * a Discord component embed (<script id="discord:component-embed">) on every page except the
    404 page and the /changelog/ redirect stub. The Open Graph / description tags stay as the
    fallback. Left out (an HTML comment instead) when over 3,000 bytes.
    Spec: https://docs.discord.com/developers/link-previews/component-embeds

Copyright (c) 2026 Stux.Music. All Rights Reserved.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://" + (ROOT / "CNAME").read_text(encoding="utf-8").strip()
SITE_NAME = "Stux.Music Artists"
ACCENT = "#4752ff"
ICON_URL = "https://global.media.stux.music/icon-light.png"
MAX_BYTES = 3000
BEGIN, END = "<!-- head:begin -->", "<!-- head:end -->"
NO_EMBED = {"404.html", "changelog/index.html"}

FAVICON_TAGS = (
    '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
    '<link rel="manifest" href="/site.webmanifest">'
)


def md(s: str) -> str:
    """Escape Discord markdown so data shows as plain text."""
    s = re.sub(r"([\\*_~`|\[\]])", r"\\\1", s)
    return re.sub(r"(?m)^([#>-])", r"\\\1", s)


def text(markdown: str) -> dict:
    return {"type": 10, "content": markdown}


def buttons(links) -> dict:
    return {"type": 1, "components": [
        {"type": 2, "style": 5, "label": label[:80], "url": url} for label, url in links]}


def section(markdown: str) -> dict:
    return {"type": 9, "components": [text(markdown)],
            "accessory": {"type": 11, "media": {"url": ICON_URL}}}


def payload(components) -> str:
    data = {"component": {"type": 17, "accent_color": int(ACCENT.lstrip("#"), 16), "components": components}}
    return json.dumps(data, separators=(",", ":"), ensure_ascii=False).replace("</", "<\/")


def embed_tag(components) -> str:
    js = payload(components)
    if len(js.encode("utf-8")) > MAX_BYTES:
        return f"<!-- discord:component-embed left out: over {MAX_BYTES} bytes -->"
    return f'<script id="discord:component-embed" type="application/json">{js}</script>'


def site_label() -> str:
    return f"-# [{md(SITE_NAME)}]({BASE_URL}/)\n"


def home_components():
    return [
        section(f"# [{md(SITE_NAME)}]({BASE_URL}/)\n**Every Stux.Music artist, in one place**\n"
                "The directory of the artists on Stux.Music, each with their own site and releases, "
                "and live status where we check it.\n-# 1 artist listed · status checked regularly"),
        text("### Artists\n[Stux Sharp](https://stuxsharp.com) · [Claim your artist page](mailto:hello@stux.music)"
             .replace("(mailto:hello@stux.music)", f"({BASE_URL}/#contact)")),
        buttons([("Browse artists", f"{BASE_URL}/#artists"), ("Live status", "https://status.stux.music")]),
    ]


def page_components(title: str, desc: str, url: str):
    return [
        section(site_label() + f"## [{md(title)}]({url})\n{md(desc)}"),
        buttons([(SITE_NAME, f"{BASE_URL}/"), ("Boring Legal Stuff", f"{BASE_URL}/legal/")]
                if url != f"{BASE_URL}/legal/" else [(SITE_NAME, f"{BASE_URL}/")]),
    ]


def page_url(rel: str) -> str:
    return BASE_URL + "/" + (rel[: -len("index.html")] if rel.endswith("index.html") else rel)


def pages():
    return sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "node_modules" not in p.parts)


def head_block(rel: str, page: str) -> str:
    lines = [BEGIN, FAVICON_TAGS]
    if rel not in NO_EMBED:
        if rel == "index.html":
            comps = home_components()
        else:
            title = re.search(r"<title>(.*?)</title>", page, re.S)
            title = html.unescape(title.group(1)).rsplit(" — ", 1)[0].strip() if title else SITE_NAME
            desc = re.search(r'<meta name="description" content="([^"]*)"', page)
            desc = html.unescape(desc.group(1)) if desc else SITE_NAME
            comps = page_components(title, desc, page_url(rel))
        lines.append(embed_tag(comps))
    lines.append(END)
    return "\n".join(lines)


def render(rel: str, page: str) -> str:
    page = re.sub(r"[ \t]*" + re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?", "", page, flags=re.S)
    block = head_block(rel, page)
    if "</head>" not in page:
        raise SystemExit(f"{rel}: no </head>")
    return page.replace("</head>", block + "\n</head>", 1)


def main() -> int:
    check = "--check" in sys.argv
    stale = []
    for path in pages():
        rel = path.relative_to(ROOT).as_posix()
        old = path.read_text(encoding="utf-8")
        new = render(rel, old)
        if new != old:
            stale.append(rel)
            if not check:
                path.write_text(new, encoding="utf-8", newline="\n")
    if check:
        print("stale: " + ", ".join(stale) if stale else "head blocks up to date")
        return 1 if stale else 0
    print(f"Updated {len(stale)} of {len(pages())} pages")
    return 0


if __name__ == "__main__":
    sys.exit(main())
