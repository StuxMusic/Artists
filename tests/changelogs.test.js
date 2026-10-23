// Runs assets/js/changelogs.js against a stub DOM: Date Version headings render, and the
// ### sections come out in the global order. Run with: node tests/changelogs.test.js
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const md = [
  "# Changelog", "", "## v26.10.23-1", "", "### Fixed", "", "- b", "", "### Added", "", "- a", "",
  "### Deprecated", "", "- d", "", "### Security", "", "- s", "",
  "## v26.10.23", "", "### Changed", "", "- c", "",
].join("\n");
const body = { innerHTML: "" };
const badge = { textContent: "" };
global.document = { getElementById: (id) => (id === "cl-body" ? body : badge) };
global.fetch = (url) => Promise.resolve({ ok: true, text: () => Promise.resolve(url.endsWith("VERSION.md") ? "26.10.23-1\n" : md) });
eval(fs.readFileSync(path.join(__dirname, "..", "assets", "js", "changelogs.js"), "utf8"));

setTimeout(() => {
  assert.ok(body.innerHTML.includes("<h2>v26.10.23-1</h2>"), "dated-with-suffix heading renders");
  assert.ok(body.innerHTML.includes("<h2>v26.10.23</h2>"), "date heading renders");
  const order = ["added", "fixed", "security", "deprecated"].map((t) => body.innerHTML.indexOf("cl-label-" + t));
  assert.ok(order.every((n) => n >= 0) && order.every((n, i) => !i || n > order[i - 1]), "sections sorted Added, Fixed, Security, Deprecated");
  assert.strictEqual(badge.textContent, "v26.10.23-1");
  console.log("ok   - changelog renderer handles Date Version headings");
}, 50);
