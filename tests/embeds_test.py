"""Checks the shared <head> block on every page: Discord component embed rules and favicon tags.
Run with: python tests/embeds_test.py"""
import json
import re
import struct
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import importlib.util
spec = importlib.util.spec_from_file_location("build_head", ROOT / "scripts" / "build-head.py")
bh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bh)

ALLOWED = {1, 2, 9, 10, 11, 12, 14, 17}
BUTTON_KEYS = {"id", "type", "url", "style", "label", "emoji", "disabled"}
EMBED = re.compile(r'<script id="discord:component-embed" type="application/json">(.*?)</script>', re.S)


def walk(node, depth=0):
    yield node, depth
    for c in node.get("components", []):
        yield from walk(c, depth + 1)


class HeadTests(unittest.TestCase):
    def pages(self):
        return [(p.relative_to(ROOT).as_posix(), p.read_text(encoding="utf-8")) for p in bh.pages()]

    def test_blocks_up_to_date(self):
        self.assertEqual(subprocess.run([sys.executable, str(ROOT / "scripts" / "build-head.py"), "--check"]).returncode, 0)

    def test_favicon_tags_on_every_head(self):
        for rel, page in self.pages():
            for needle in ('href="/favicon.ico" sizes="48x48"', 'rel="apple-touch-icon" href="/apple-touch-icon.png"', 'rel="manifest" href="/site.webmanifest"'):
                self.assertIn(needle, page, rel)

    def test_embed_on_pages_but_not_404_or_redirect(self):
        for rel, page in self.pages():
            if rel in bh.NO_EMBED:
                self.assertNotIn("discord:component-embed", page, rel)
            else:
                self.assertTrue(EMBED.search(page), rel)

    def test_embed_rules(self):
        for rel, page in self.pages():
            m = EMBED.search(page)
            if not m:
                continue
            raw = m.group(1)
            self.assertLess(len(raw.encode("utf-8")), 3000, rel)
            self.assertNotIn("</", raw, rel)
            self.assertNotIn("$1", raw, rel)
            root = json.loads(raw)["component"]
            self.assertEqual(root["type"], 17)
            nodes = list(walk(root))
            self.assertLessEqual(len(nodes), 40, rel)
            self.assertEqual([n for n, d in nodes if n["type"] == 17 and d > 0], [], rel)
            for n, _ in nodes:
                self.assertIn(n["type"], ALLOWED, rel)
                if n["type"] == 2:
                    self.assertEqual(n["style"], 5)
                    self.assertTrue(set(n) <= BUTTON_KEYS, rel)
                    self.assertRegex(n["url"], r"^https?://")

    def test_markdown_escaped_and_script_safe(self):
        self.assertEqual(bh.md(r"a*b_c [x] `y` | ~z \\"), r"a\*b\_c \[x\] \`y\` \| \~z \\\\")
        self.assertEqual(bh.md("# h\n> q\n- l"), r"\# h"+"\n"+r"\> q"+"\n"+r"\- l")
        self.assertNotIn("$1", bh.md("*x*"))
        self.assertNotIn("</script>", bh.payload([bh.text("</script><b>")]))

    def test_oversize_embed_is_left_out(self):
        self.assertTrue(bh.embed_tag([bh.text("x" * 3100)]).startswith("<!-- discord:component-embed left out"))

    def test_favicon_files(self):
        ico = (ROOT / "favicon.ico").read_bytes()
        n = struct.unpack("<H", ico[4:6])[0]
        sizes = sorted(ico[6 + 16 * i] or 256 for i in range(n))
        self.assertEqual(sizes, [16, 32, 48])
        self.assertEqual((ROOT / "apple-touch-icon.png").read_bytes()[16:24], struct.pack(">II", 180, 180))
        man = json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual((man["start_url"], man["display"]), ("/", "browser"))
        self.assertTrue(any(i.get("purpose") == "maskable" and i["sizes"] == "512x512" for i in man["icons"]))
        for i in man["icons"]:
            self.assertTrue((ROOT / i["src"].lstrip("/")).is_file(), i["src"])


if __name__ == "__main__":
    unittest.main()
