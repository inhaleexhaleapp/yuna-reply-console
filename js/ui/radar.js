// Search Radar: manual X search URLs, nothing is fetched.

function formatSearchDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resolveSearchQuery(query) {
  return query
    .replaceAll("{since2}", formatSearchDate(2))
    .replaceAll("{since7}", formatSearchDate(7))
    .replaceAll("{since14}", formatSearchDate(14));
}

function prioritizePresets(presets, priorityNames) {
  const priorities = new Map(priorityNames.map((name, index) => [name.toLowerCase(), index]));
  return [...presets].sort((a, b) => {
    const aRank = priorities.has(a.category.toLowerCase()) ? priorities.get(a.category.toLowerCase()) : 100;
    const bRank = priorities.has(b.category.toLowerCase()) ? priorities.get(b.category.toLowerCase()) : 100;
    return aRank - bRank;
  });
}

function wellnessPresetsForLaunchMode() {
  if (activeLaunchMode === "tonight") {
    return prioritizePresets(searchPresets, ["Late Night Calm", "Ambient Sleep Culture", "Calm Tech Radar", "Emotionally Alive Rooms", "432Hz / Frequency Culture"]);
  }
  if (activeLaunchMode === "wellness") {
    return prioritizePresets(searchPresets, ["Emotionally Alive Rooms", "Mantra Culture", "Ambient Sleep Culture", "432Hz / Frequency Culture", "Myth + Calm"]);
  }
  return searchPresets;
}

function founderPresetsForLaunchMode() {
  if (activeLaunchMode === "tonight") {
    return prioritizePresets(founderSearchPresets, ["builder prompts", "build in public", "shipping", "mobile app founder"]);
  }
  if (activeLaunchMode === "founder") {
    return prioritizePresets(founderSearchPresets, ["builder prompts", "solo founder", "build in public", "shipping", "SaaS / revenue"]);
  }
  return founderSearchPresets;
}

function isShortcutHighlight(category, scope = "wellness") {
  if (!activeLaunchMode) return false;
  const lower = category.toLowerCase();
  if (activeLaunchMode === "tonight") {
    return containsAny(lower, ["tonight", "late night", "ambient", "calm tech", "builder prompts", "night shift", "founder"]);
  }
  if (activeLaunchMode === "founder") return scope === "founder";
  if (activeLaunchMode === "wellness") return scope === "wellness" && containsAny(lower, ["wellness", "emotionally", "mantra", "ambient", "calm", "432hz", "myth"]);
  return false;
}

function buildXSearchUrl(query) {
  const resolvedQuery = resolveSearchQuery(query);
  return `https://x.com/search?q=${encodeURIComponent(resolvedQuery)}&f=live`;
}

function queryCard(query, category, scope = "wellness") {
  const resolvedQuery = resolveSearchQuery(query);
  const encodedQuery = encodeURIComponent(resolvedQuery);
  return `
    <article class="query-card">
      <p class="query-text">${escapeHtml(resolvedQuery)}</p>
      <div class="query-actions">
        <button class="small" type="button" data-radar-action="copy" data-radar-scope="${scope}" data-query="${encodedQuery}" aria-label="Copy ${escapeHtml(category)} search query" title="Copies the search text only. Nothing is sent anywhere.">Copy query</button>
        <button class="small" type="button" data-radar-action="open" data-radar-scope="${scope}" data-query="${encodedQuery}" aria-label="Open ${escapeHtml(category)} search on X" title="Opens an X search URL in a new tab. Yuna does not connect to X or read results.">Open in X</button>
      </div>
    </article>
  `;
}

function renderSearchRadar() {
  searchRadarList.innerHTML = wellnessPresetsForLaunchMode().map((preset) => `
    <section class="radar-category ${isShortcutHighlight(preset.category) ? "shortcut-highlight" : ""}" aria-label="${escapeHtml(preset.category)} search presets">
      <h3>${escapeHtml(preset.category)}</h3>
      <div class="query-list">
        ${preset.queries.map((query) => queryCard(query, preset.category)).join("")}
      </div>
    </section>
  `).join("");

  tonightSearchList.innerHTML = tonightSearches
    .map((query) => queryCard(query, "Tonight mode"))
    .join("");
}

function renderFounderSearchRadar() {
  founderSearchRadarList.innerHTML = founderPresetsForLaunchMode().map((preset) => `
    <section class="radar-category ${isShortcutHighlight(preset.category, "founder") ? "shortcut-highlight" : ""}" aria-label="${escapeHtml(preset.category)} founder search presets">
      <h3>${escapeHtml(preset.category)}</h3>
      <div class="query-list">
        ${preset.queries.map((query) => queryCard(query, preset.category, "founder")).join("")}
      </div>
    </section>
  `).join("");

  founderNightSearchList.innerHTML = founderNightSearches
    .map((query) => queryCard(query, "Indie Night Shift", "founder"))
    .join("");
}
