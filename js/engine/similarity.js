// Similarity guard: flags replies that look too much like recently used ones.

function similarityWords(text) {
  return new Set(normalizeEchoText(text).toLowerCase().replace(/[^a-z0-9\s']/g, " ").split(/\s+/).filter((word) => word.length > 2 && !echoStopWords.has(word)));
}

function replySimilarity(a, b) {
  const wordsA = similarityWords(a);
  const wordsB = similarityWords(b);
  if (!wordsA.size || !wordsB.size) return 0;
  let shared = 0;
  wordsA.forEach((word) => { if (wordsB.has(word)) shared += 1; });
  return shared / Math.min(wordsA.size, wordsB.size);
}

function recentlyPostedTexts() {
  const lists = [
    (typeof appState !== "undefined" && appState.used) || [],
    (typeof founderState !== "undefined" && founderState.used) || [],
    musicState.used || []
  ];
  return lists
    .flat()
    .slice()
    .sort((a, b) => String(b.usedAt || b.createdAt || "").localeCompare(String(a.usedAt || a.createdAt || "")))
    .slice(0, 30)
    .map((item) => item.text)
    .filter(Boolean);
}

function similarityWarning(text) {
  let best = 0;
  recentlyPostedTexts().forEach((posted) => {
    if (posted === text) return;
    best = Math.max(best, replySimilarity(text, posted));
  });
  return best >= 0.6 ? Math.round(best * 100) : 0;
}

function similarityPill(text) {
  const overlap = similarityWarning(text);
  return overlap
    ? `<span class="pill warn" title="Small accounts get filtered for repeated reply patterns. Rephrase before posting.">${overlap}% like a recent reply</span>`
    : "";
}
