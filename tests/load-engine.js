// Loads Yuna's browser scripts into a Node vm context so the engine can be
// tested without a browser. Scripts share one global scope, exactly like
// classic <script> tags on the page.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ENGINE_FILES = [
  "data/wellness-data.js",
  "data/founder-data.js",
  "data/music-data.js",
  "core/utils.js",
  "core/backup.js",
  "engine/text.js",
  "engine/worthiness.js",
  "engine/echo.js",
  "engine/similarity.js",
  "engine/claude-prompt.js",
  "engine/wellness-engine.js",
  "engine/founder-engine.js",
  "engine/music-engine.js"
];

function loadEngine() {
  const context = vm.createContext({ console });
  // Minimal stand-ins for the in-memory state the pickers read.
  vm.runInContext(`
    var appState = { favorites: [], used: [], history: [] };
    var founderState = { favorites: [], used: [], history: [], settings: { linkMode: "auto", format: "text" } };
    var musicState = { used: [], history: [], people: [], portfolioUrl: "", linkMode: "none" };
    var currentReplies = [];
    var founderCurrentReplies = [];
  `, context);
  for (const file of ENGINE_FILES) {
    const code = fs.readFileSync(path.join(__dirname, "..", "js", file), "utf8");
    vm.runInContext(code, context, { filename: file });
  }
  // Expose top-level const/let/functions through one lookup helper.
  return new Proxy({}, {
    get: (_, name) => vm.runInContext(String(name), context)
  });
}

module.exports = { loadEngine };
