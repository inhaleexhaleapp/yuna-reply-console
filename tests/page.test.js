// Checks that index.html and the js/ folder stay in sync.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((match) => match[1]);

function listJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listJs(full) : entry.name.endsWith(".js") ? [full] : [];
  });
}

test("every script tag points to a real file", () => {
  assert.ok(scripts.length > 0);
  scripts.forEach((src) => assert.ok(fs.existsSync(path.join(root, src)), src));
});

test("every js file is loaded by the page", () => {
  const loaded = new Set(scripts.map((src) => path.join(root, src)));
  listJs(path.join(root, "js")).forEach((file) => assert.ok(loaded.has(file), `${path.relative(root, file)} is not in index.html`));
});

test("app.js loads last and the stylesheet exists", () => {
  assert.equal(scripts[scripts.length - 1], "js/app.js");
  assert.ok(html.includes('href="css/yuna.css"'));
  assert.ok(fs.existsSync(path.join(root, "css", "yuna.css")));
});

test("no network calls or external scripts sneak in", () => {
  const code = listJs(path.join(root, "js")).map((file) => fs.readFileSync(file, "utf8")).join("\n");
  assert.ok(!/\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon/.test(code), "the console must stay offline");
  assert.ok(!/<script src="https?:/.test(html), "no external scripts");
});
