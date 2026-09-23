// Wellness / Yuna tab.

function populateSelectors() {
  categorySelect.innerHTML = categories.map((category) => (
    `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
  )).join("");

  toneSelect.innerHTML = tones.map((tone) => (
    `<option value="${escapeHtml(tone)}">${escapeHtml(tone)}</option>`
  )).join("");

  categorySelect.value = "need calm";
  toneSelect.value = "warm human";
}

function updateTweetCount() {
  const count = tweetInput.value.length;
  tweetCount.textContent = `${count} ${count === 1 ? "character" : "characters"}`;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function generateReplies(variant = "base") {
  const tweetText = tweetInput.value.trim();
  const category = categorySelect.value;
  const tone = toneSelect.value;

  if (!tweetText) {
    setStatus("Paste a tweet first, then generate replies.");
    tweetInput.focus();
    return;
  }

  if (!ensureActiveSessionForReply(setStatus)) return;

  currentVariant = variant;
  const candidates = buildCandidateReplies(tweetText, category, tone, variant);
  currentReplies = pickReplies(candidates, variant, tweetText);
  recordReplyGeneration();

  appState.history.unshift({
    id: window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    tweet: tweetText.slice(0, 280),
    category,
    tone,
    variant,
    replies: currentReplies.map((reply) => reply.text),
    createdAt: new Date().toISOString()
  });

  writeStorage();
  renderAll();
  setStatus(variant === "base" ? "5 replies ready." : "Reply set refreshed.");
}

function isFavorite(text) {
  return appState.favorites.some((item) => item.text === text);
}

function isUsed(text) {
  return appState.used.some((item) => item.text === text);
}

function toggleFavorite(reply) {
  if (isFavorite(reply.text)) {
    appState.favorites = appState.favorites.filter((item) => item.text !== reply.text);
    setStatus("Removed from favorites.");
  } else {
    appState.favorites.unshift({
      ...reply,
      sourceTweet: tweetInput.value.trim().slice(0, 280),
      createdAt: new Date().toISOString()
    });
    setStatus("Saved to favorites.");
  }
  writeStorage();
  renderAll();
}

function markUsed(reply) {
  if (!isUsed(reply.text)) {
    appState.used.unshift({
      ...reply,
      sourceTweet: tweetInput.value.trim().slice(0, 280),
      createdAt: new Date().toISOString()
    });
  }
  writeStorage();
  renderAll();
  setStatus("Marked as used.");
}

function replyCard(reply, index) {
  const promo = soundsPromotional(reply.text);
  const favorited = isFavorite(reply.text);
  const used = isUsed(reply.text);
  const safetyLabel = promo ? "Check promo tone" : "No promo signal";

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
        <button class="small" type="button" data-action="copy" data-index="${index}">Copy</button>
        <button class="small" type="button" data-action="favorite" data-index="${index}">${favorited ? "Favorited" : "Favorite"}</button>
        <button class="small" type="button" data-action="used" data-index="${index}">${used ? "Used" : "Mark as Used"}</button>
      </div>
    </article>
  `;
}

function memoryCard(item, type, index) {
  return `
    <article class="memory-card">
      <p class="memory-text">${escapeHtml(item.text)}</p>
      <div class="memory-meta">
        <span class="pill">${escapeHtml(item.category || "saved")}</span>
        <span class="pill">${escapeHtml(item.tone || "tone")}</span>
        <span class="pill">${formatDate(item.createdAt)}</span>
      </div>
      <div class="memory-actions">
        <button class="small" type="button" data-memory-action="copy" data-type="${type}" data-index="${index}">Copy</button>
        ${type === "favorites" ? `<button class="small" type="button" data-memory-action="favorite" data-type="${type}" data-index="${index}">Remove</button>` : ""}
        ${type === "favorites" ? `<button class="small" type="button" data-memory-action="used" data-type="${type}" data-index="${index}">Mark as Used</button>` : ""}
      </div>
    </article>
  `;
}

function renderSuggestions() {
  if (!currentReplies.length) {
    suggestionsList.innerHTML = '<p class="empty">Paste a tweet, choose a category and tone, then generate a soft reply set.</p>';
  } else {
    suggestionsList.innerHTML = currentReplies.map(replyCard).join("");
  }

  const hasReplies = currentReplies.length > 0;
  copyAllBtn.disabled = !hasReplies;
  softerBtn.disabled = !hasReplies;
  humanBtn.disabled = !hasReplies;
  shorterBtn.disabled = !hasReplies;
}

function renderFavorites() {
  clearFavoritesBtn.disabled = appState.favorites.length === 0;
  favoritesList.innerHTML = appState.favorites.length
    ? appState.favorites.slice(0, 12).map((item, index) => memoryCard(item, "favorites", index)).join("")
    : '<p class="empty">Favorite replies will stay here on this browser.</p>';
}

function renderHistory() {
  clearHistoryBtn.disabled = appState.used.length === 0 && appState.history.length === 0;

  const usedCards = appState.used.slice(0, 8).map((item, index) => memoryCard(item, "used", index));
  const runCards = appState.history.slice(0, 5).map((run) => {
    const replies = (run.replies || []).slice(0, 2).map((reply) => `<span class="muted">${escapeHtml(reply)}</span>`).join("<br>");
    return `
      <article class="memory-card">
        <p class="memory-text">${escapeHtml(run.tweet || "Recent generation")}</p>
        <div class="memory-meta">
          <span class="pill">${escapeHtml(run.category || "category")}</span>
          <span class="pill">${escapeHtml(run.tone || "tone")}</span>
          <span class="pill">${formatDate(run.createdAt)}</span>
        </div>
        <div class="history-run">${replies}</div>
      </article>
    `;
  });

  historyList.innerHTML = usedCards.length || runCards.length
    ? [...usedCards, ...runCards].join("")
    : '<p class="empty">Used replies and recent generations will appear here.</p>';
}

function renderAll() {
  renderWellnessWorthiness();
  renderSuggestions();
  renderFavorites();
  renderHistory();
  renderSearchRadar();
}

function getMemoryItem(type, index) {
  return type === "favorites" ? appState.favorites[index] : appState.used[index];
}
