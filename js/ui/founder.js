// Indie Founder tab.

function populateFounderSelectors() {
  founderCategorySelect.innerHTML = founderCategories.map((category) => (
    `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
  )).join("");

  founderToneSelect.innerHTML = founderTones.map((tone) => (
    `<option value="${escapeHtml(tone)}">${escapeHtml(tone)}</option>`
  )).join("");

  founderCategorySelect.value = "solo founder";
  founderToneSelect.value = "peer-to-peer";
  founderLinkModeSelect.value = founderState.settings.linkMode || "auto";
  founderFormatSelect.value = founderState.settings.format || "text";
}

function updateFounderTweetCount() {
  const count = founderTweetInput.value.length;
  founderTweetCount.textContent = `${count} ${count === 1 ? "character" : "characters"}`;
}

function setFounderStatus(message) {
  founderStatusEl.textContent = message;
}

function currentFounderSettings() {
  return {
    linkMode: founderLinkModeSelect.value || "auto",
    format: founderFormatSelect.value || "text"
  };
}

function saveFounderSettings() {
  founderState.settings = currentFounderSettings();
  writeFounderStorage();
}

function generateFounderReplies(variant = "base") {
  const tweetText = founderTweetInput.value.trim();
  const category = founderCategorySelect.value;
  const tone = founderToneSelect.value;

  if (!tweetText) {
    setFounderStatus("Paste a builder tweet first, then generate replies.");
    founderTweetInput.focus();
    return;
  }

  if (!ensureActiveSessionForReply(setFounderStatus)) return;

  founderCurrentVariant = variant;
  const settings = currentFounderSettings();
  founderState.settings = settings;
  const threadGravity = analyzeFounderThreadGravity(tweetText, category);
  if (threadGravity.skip) {
    founderCurrentReplies = [];
    writeFounderStorage();
    renderFounderAll();
    setFounderStatus(`SKIP THREAD · ${threadGravity.reason}. signal ${threadGravity.score}/100.`);
    return;
  }
  const candidates = buildFounderCandidateReplies(tweetText, category, tone, variant, settings);
  founderCurrentReplies = pickFounderReplies(candidates, variant, tweetText);
  recordReplyGeneration();

  founderState.history.unshift({
    id: window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    tweet: tweetText.slice(0, 280),
    category,
    tone,
    variant,
    linkMode: settings.linkMode,
    format: settings.format,
    threadGravity,
    replies: founderCurrentReplies.map((reply) => reply.text),
    createdAt: new Date().toISOString()
  });

  writeFounderStorage();
  renderFounderAll();
  setFounderStatus(`${variant === "base" ? "5 founder replies ready" : "Founder reply set refreshed"} · signal ${threadGravity.score}/100 · ${threadGravity.reason}.`);
}

function isFounderFavorite(text) {
  return founderState.favorites.some((item) => item.text === text);
}

function isFounderUsed(text) {
  return founderState.used.some((item) => item.text === text);
}

function toggleFounderFavorite(reply) {
  if (isFounderFavorite(reply.text)) {
    founderState.favorites = founderState.favorites.filter((item) => item.text !== reply.text);
    setFounderStatus("Removed from Indie Founder favorites.");
  } else {
    founderState.favorites.unshift({
      ...reply,
      sourceTweet: founderTweetInput.value.trim().slice(0, 280),
      createdAt: new Date().toISOString()
    });
    setFounderStatus("Saved to Indie Founder favorites.");
  }
  writeFounderStorage();
  renderFounderAll();
}

function markFounderUsed(reply) {
  if (!isFounderUsed(reply.text)) {
    founderState.used.unshift({
      ...reply,
      sourceTweet: founderTweetInput.value.trim().slice(0, 280),
      createdAt: new Date().toISOString()
    });
  }
  writeFounderStorage();
  renderFounderAll();
  setFounderStatus("Marked as used.");
}

function founderReplyCard(reply, index) {
  const promo = soundsPromotional(reply.text);
  const favorited = isFounderFavorite(reply.text);
  const used = isFounderUsed(reply.text);
  const safetyLabel = promo ? "Check salesy tone" : "No sales signal";

  return `
    <article class="reply-card">
      <p class="reply-text">${escapeHtml(reply.text)}</p>
      <div class="reply-meta">
        <span class="pill">${reply.text.length}/220</span>
        ${reply.mode ? `<span class="pill">${escapeHtml(reply.mode)}</span>` : ""}
        <span class="pill">${escapeHtml(reply.category)}</span>
        <span class="pill">${escapeHtml(reply.tone)}</span>
        <span class="pill ${promo ? "warn" : "safe"}">${safetyLabel}</span>
        ${used ? '<span class="pill safe">Used</span>' : ''}
      </div>
      <div class="reply-actions">
        <button class="small" type="button" data-founder-action="copy" data-index="${index}">Copy</button>
        <button class="small" type="button" data-founder-action="favorite" data-index="${index}">${favorited ? "Favorited" : "Favorite"}</button>
        <button class="small" type="button" data-founder-action="used" data-index="${index}">${used ? "Used" : "Mark as Used"}</button>
      </div>
    </article>
  `;
}

function founderMemoryCard(item, type, index) {
  return `
    <article class="memory-card">
      <p class="memory-text">${escapeHtml(item.text)}</p>
      <div class="memory-meta">
        <span class="pill">${escapeHtml(item.category || "saved")}</span>
        <span class="pill">${escapeHtml(item.tone || "tone")}</span>
        <span class="pill">${formatDate(item.createdAt)}</span>
      </div>
      <div class="memory-actions">
        <button class="small" type="button" data-founder-memory-action="copy" data-type="${type}" data-index="${index}">Copy</button>
        ${type === "favorites" ? `<button class="small" type="button" data-founder-memory-action="favorite" data-type="${type}" data-index="${index}">Remove</button>` : ""}
        ${type === "favorites" ? `<button class="small" type="button" data-founder-memory-action="used" data-type="${type}" data-index="${index}">Mark as Used</button>` : ""}
      </div>
    </article>
  `;
}

function renderFounderSuggestions() {
  if (!founderCurrentReplies.length) {
    founderSuggestionsList.innerHTML = '<p class="empty">Paste a builder tweet, choose a category and tone, then generate a founder-native reply set.</p>';
  } else {
    founderSuggestionsList.innerHTML = founderCurrentReplies.map(founderReplyCard).join("");
  }

  const hasReplies = founderCurrentReplies.length > 0;
  founderCopyAllBtn.disabled = !hasReplies;
  founderShorterBtn.disabled = !hasReplies;
  founderHumanBtn.disabled = !hasReplies;
  founderCasualBtn.disabled = !hasReplies;
}

function renderFounderFavorites() {
  founderClearFavoritesBtn.disabled = founderState.favorites.length === 0;
  founderFavoritesList.innerHTML = founderState.favorites.length
    ? founderState.favorites.slice(0, 12).map((item, index) => founderMemoryCard(item, "favorites", index)).join("")
    : '<p class="empty">Indie Founder favorites will stay separate on this browser.</p>';
}

function renderFounderHistory() {
  founderClearHistoryBtn.disabled = founderState.used.length === 0 && founderState.history.length === 0;

  const usedCards = founderState.used.slice(0, 8).map((item, index) => founderMemoryCard(item, "used", index));
  const runCards = founderState.history.slice(0, 5).map((run) => {
    const replies = (run.replies || []).slice(0, 2).map((reply) => `<span class="muted">${escapeHtml(reply)}</span>`).join("<br>");
    return `
      <article class="memory-card">
        <p class="memory-text">${escapeHtml(run.tweet || "Recent founder generation")}</p>
        <div class="memory-meta">
          <span class="pill">${escapeHtml(run.category || "category")}</span>
          <span class="pill">${escapeHtml(run.tone || "tone")}</span>
          <span class="pill">${formatDate(run.createdAt)}</span>
        </div>
        <div class="history-run">${replies}</div>
      </article>
    `;
  });

  founderHistoryList.innerHTML = usedCards.length || runCards.length
    ? [...usedCards, ...runCards].join("")
    : '<p class="empty">Indie Founder used replies and recent generations will appear here.</p>';
}

function renderFounderAll() {
  renderFounderWorthiness();
  renderFounderSuggestions();
  renderFounderFavorites();
  renderFounderHistory();
  renderFounderSearchRadar();
}

function getFounderMemoryItem(type, index) {
  return type === "favorites" ? founderState.favorites[index] : founderState.used[index];
}
