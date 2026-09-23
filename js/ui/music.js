// Music / Sound tab.

function generateMusicReplies() {
  const tweetText = musicTweetInput.value.trim();
  const category = musicCategorySelect.value;
  const tone = musicToneSelect.value;
  if (!tweetText) {
    setMusicStatus("Paste a post first, then generate replies.");
    musicTweetInput.focus();
    return;
  }
  if (!ensureActiveSessionForReply(setMusicStatus)) return;

  const { candidates, anchors, composerWanted } = buildMusicCandidates(tweetText, category, tone);
  const recent = new Set([...musicState.used.slice(0, 30).map((item) => item.text), ...musicCurrentReplies.map((item) => item.text)]);
  const seen = new Set();
  const unique = candidates
    .map((candidate) => ({ ...candidate, score: candidate.score - (recent.has(candidate.text) ? 6 : 0) - similarityWarning(candidate.text) / 20 }))
    .filter((candidate) => {
      const key = candidate.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.score - a.score);

  const picked = capEchoReplies(unique, 5, 3);
  const modes = tone === "ultra short"
    ? ["ultra-short", "ultra-short", "safest", "ultra-short", "warmer"]
    : replyEngineRules.replyOrder;
  const firstAnchor = anchors[0] && anchors[0].phrase;
  const shapedSeen = new Set();
  musicCurrentReplies = picked.map((item, index) => {
    const mode = modes[index] || "safest";
    return {
      ...item,
      mode,
      text: item.tone === "portfolio" ? item.text : musicShape(item.text, mode, item.tone === "composer offer" ? "composer offer" : tone, mode === "ultra-short" ? (item.anchor || firstAnchor) : null)
    };
  }).filter((item) => {
    const key = item.text.toLowerCase();
    if (shapedSeen.has(key)) return false;
    shapedSeen.add(key);
    return true;
  });

  recordReplyGeneration();
  musicState.history.unshift({
    tweet: tweetText.slice(0, 280),
    category,
    tone,
    replies: musicCurrentReplies.map((reply) => reply.text),
    createdAt: new Date().toISOString()
  });
  musicState.history = musicState.history.slice(0, 40);
  writeMusicStorage();
  renderMusicAll();
  setMusicStatus(composerWanted
    ? "Composer call detected. Keep it human, link only if you set a portfolio."
    : `${musicCurrentReplies.length} replies ready.${anchors.length ? ` picked up: ${anchors.map((anchor) => anchor.phrase).join(", ")}` : ""}`);
}

function renderMusicPeople() {
  if (!musicState.people.length) {
    musicPeopleList.innerHTML = '<p class="empty">Paste lines like <code>@handle | game dev | 1.2k | Sep 20 | https://x.com/... | foggy mythic forest</code>. Accounts you have not replied to in a while float to the top.</p>';
    return;
  }
  const waitDays = (person) => {
    const days = daysSince(person.lastReplied);
    return days === null ? 9999 : days;
  };
  const sorted = musicState.people.slice().sort((a, b) => waitDays(b) - waitDays(a));
  musicPeopleList.innerHTML = sorted.map((person) => {
    const days = daysSince(person.lastReplied);
    const handleSlug = person.handle.replace(/^@/, "");
    return `
      <article class="memory-card music-person">
        <p class="memory-text"><strong>${escapeHtml(person.handle)}</strong> ${person.category ? `· ${escapeHtml(person.category)}` : ""} ${person.followers ? `· ${escapeHtml(person.followers)}` : ""}</p>
        ${person.mood ? `<p class="music-person-mood">${escapeHtml(person.mood)}</p>` : ""}
        <div class="reply-meta">
          <span class="pill ${days === null ? "warn" : days >= 5 ? "warn" : "safe"}">${days === null ? "not replied yet" : days === 0 ? "replied today" : `replied ${days}d ago`}</span>
          ${person.postDate ? `<span class="pill">post ${escapeHtml(person.postDate)}</span>` : ""}
        </div>
        <div class="reply-actions">
          <button class="small" type="button" data-music-person="profile" data-handle="${escapeHtml(handleSlug)}">Open profile</button>
          ${person.link ? `<button class="small" type="button" data-music-person="post" data-handle="${escapeHtml(handleSlug)}">Open post</button>` : ""}
          <button class="small" type="button" data-music-person="replied" data-handle="${escapeHtml(handleSlug)}">Replied today</button>
          <button class="small danger" type="button" data-music-person="remove" data-handle="${escapeHtml(handleSlug)}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

// Rendering
function setMusicStatus(message) {
  musicStatus.textContent = message;
}

function musicReplyCard(reply, index) {
  const used = musicState.used.some((item) => item.text === reply.text);
  return `
    <article class="reply-card">
      <p class="reply-text">${escapeHtml(reply.text)}</p>
      <div class="reply-meta">
        <span class="pill">${reply.text.length}/220</span>
        ${reply.mode ? `<span class="pill">${escapeHtml(reply.mode)}</span>` : ""}
        <span class="pill">${escapeHtml(reply.tone || reply.category)}</span>
        ${similarityPill(reply.text)}
        ${soundsPromotional(reply.text) || /https?:\/\//.test(reply.text) ? '<span class="pill warn">link / promo, post sparingly</span>' : ""}
        ${used ? '<span class="pill safe">Used</span>' : ""}
      </div>
      <div class="reply-actions">
        <button class="small" type="button" data-music-action="copy" data-index="${index}">Copy</button>
        <button class="small" type="button" data-music-action="used" data-index="${index}">${used ? "Used" : "Mark as Used"}</button>
      </div>
    </article>
  `;
}

function renderMusicSuggestions() {
  musicSuggestionsList.innerHTML = musicCurrentReplies.length
    ? musicCurrentReplies.map(musicReplyCard).join("")
    : '<p class="empty">Paste a WIP, a composer call, or a track post. Replies pick up the mood and never repeat your recent ones.</p>';
  musicCopyAllBtn.disabled = !musicCurrentReplies.length;
}

function renderMusicHistory() {
  musicUsedList.innerHTML = musicState.used.length
    ? musicState.used.slice(0, 12).map((item) => `
      <article class="memory-card">
        <p class="memory-text">${escapeHtml(item.text)}</p>
        <div class="reply-meta"><span class="pill">${escapeHtml(item.category || "music")}</span><span class="pill">${escapeHtml(formatDate(item.usedAt))}</span></div>
      </article>
    `).join("")
    : '<p class="empty">Replies you mark as used show up here and feed the similarity guard.</p>';
}

function renderMusicSearchRadar() {
  musicSearchRadarList.innerHTML = musicSearchPresets.map((preset) => `
    <section class="radar-category" aria-label="${escapeHtml(preset.category)} music search presets">
      <h3>${escapeHtml(preset.category)}</h3>
      <div class="query-list">
        ${preset.queries.map((query) => queryCard(query, preset.category, "music")).join("")}
      </div>
    </section>
  `).join("");
  musicSaturdayList.innerHTML = musicSaturdaySearches.map((query) => queryCard(query, "Saturday shift", "music")).join("");
}

function renderMusicAll() {
  renderMusicSuggestions();
  renderMusicHistory();
  renderMusicPeople();
  renderMusicSearchRadar();
  musicClaudePromptBtn.disabled = !musicTweetInput.value.trim();
}

function initMusicTab() {
  musicCategorySelect.innerHTML = musicCategories.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  musicToneSelect.innerHTML = musicTones.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  musicPortfolioInput.value = musicState.portfolioUrl || "";
  musicLinkModeSelect.value = musicState.linkMode || "none";

  musicTweetInput.addEventListener("input", () => {
    musicTweetCount.textContent = `${musicTweetInput.value.length} characters`;
    musicClaudePromptBtn.disabled = !musicTweetInput.value.trim();
  });
  musicTweetInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      generateMusicReplies();
    }
  });
  musicGenerateBtn.addEventListener("click", generateMusicReplies);
  musicPortfolioInput.addEventListener("change", () => {
    musicState.portfolioUrl = musicPortfolioInput.value.trim();
    writeMusicStorage();
  });
  musicLinkModeSelect.addEventListener("change", () => {
    musicState.linkMode = musicLinkModeSelect.value;
    writeMusicStorage();
  });
  musicCopyAllBtn.addEventListener("click", async () => {
    await copyText(musicCurrentReplies.map((reply, index) => `${index + 1}. ${reply.text}`).join("\n"));
    setMusicStatus("Copied all replies.");
  });
  musicClaudePromptBtn.addEventListener("click", async () => {
    const tweetText = musicTweetInput.value.trim();
    if (!tweetText) return;
    await copyText(buildClaudePrompt(tweetText, "music", {
      category: musicCategorySelect.value,
      tone: musicToneSelect.value,
      linkMode: musicState.linkMode,
      portfolioUrl: musicState.portfolioUrl
    }));
    setMusicStatus("Claude prompt copied. Paste it into claude.ai, then pick one by hand.");
  });

  musicSuggestionsList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-music-action]");
    if (!button) return;
    const reply = musicCurrentReplies[Number(button.dataset.index)];
    if (!reply) return;
    if (button.dataset.musicAction === "copy") {
      await copyText(reply.text);
      setMusicStatus("Copied. Reply like you actually watched it.");
    }
    if (button.dataset.musicAction === "used" && !musicState.used.some((item) => item.text === reply.text)) {
      musicState.used.unshift({ text: reply.text, category: reply.category, usedAt: new Date().toISOString() });
      musicState.used = musicState.used.slice(0, 80);
      writeMusicStorage();
      renderMusicAll();
    }
  });

  musicPeopleImportBtn.addEventListener("click", () => {
    const people = parsePeopleLines(musicPeopleInput.value);
    if (!people.length) {
      setMusicStatus("No @handles found. One account per line, like Grok's list.");
      return;
    }
    const added = mergePeople(people);
    musicPeopleInput.value = "";
    writeMusicStorage();
    renderMusicPeople();
    setMusicStatus(`${added} new, ${people.length - added} updated. Existing people were kept.`);
  });

  musicPeopleExportBtn.addEventListener("click", async () => {
    await copyText(musicState.people.map((person) => [person.handle, person.category, person.followers, person.postDate, person.link, person.mood].join(" | ")).join("\n"));
    setMusicStatus("People list copied as text.");
  });

  musicPeopleList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-music-person]");
    if (!button) return;
    const handle = `@${button.dataset.handle}`.toLowerCase();
    const person = musicState.people.find((item) => item.handle.toLowerCase() === handle);
    if (!person) return;
    const action = button.dataset.musicPerson;
    if (action === "profile") window.open(`https://x.com/${button.dataset.handle}`, "_blank", "noopener,noreferrer");
    if (action === "post" && person.link) window.open(person.link, "_blank", "noopener,noreferrer");
    if (action === "replied") person.lastReplied = new Date().toISOString();
    if (action === "remove") musicState.people = musicState.people.filter((item) => item !== person);
    if (["replied", "remove"].includes(action)) {
      writeMusicStorage();
      renderMusicPeople();
    }
  });

  renderMusicAll();
}
