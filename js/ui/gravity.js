// Gravity Map tab.

function ensureGravityLists() {
  suggestedGravityLists.forEach((listName) => {
    if (!gravityState.lists[listName]) {
      gravityState.lists[listName] = [];
    }
  });
}

function populateGravityControls() {
  ensureGravityLists();
  gravityModeSelect.innerHTML = gravityModes.map((mode) => (
    `<option value="${escapeHtml(mode)}">${escapeHtml(mode)}</option>`
  )).join("");
  gravityRelationshipSelect.innerHTML = relationshipModes.map((mode) => (
    `<option value="${escapeHtml(mode)}">${escapeHtml(mode)}</option>`
  )).join("");
  gravityTagGrid.innerHTML = gravityTags.map((tag, index) => `
    <label class="tag-item">
      <input type="checkbox" value="${escapeHtml(tag)}" ${index < 3 ? "checked" : ""}>
      ${escapeHtml(tag)}
    </label>
  `).join("");
  renderGravityListSelect();
  syncGravityRangeLabels();
}

function renderGravityListSelect() {
  const listNames = Object.keys(gravityState.lists).sort();
  gravityListSelect.innerHTML = listNames.map((listName) => (
    `<option value="${escapeHtml(listName)}">${escapeHtml(listName)}</option>`
  )).join("");
}

function setGravityStatus(message) {
  gravityStatus.textContent = message;
}

function syncGravityRangeLabels() {
  gravityFollowerMinValue.textContent = compactNumber(gravityFollowerMin.value);
  gravityFollowerMaxValue.textContent = compactNumber(gravityFollowerMax.value);
  gravityNicheValue.textContent = gravityNicheRange.value;
  gravityAestheticValue.textContent = gravityAestheticRange.value;
  gravityEmotionalDepthValue.textContent = gravityEmotionalDepthRange.value;
  gravityToneMatchValue.textContent = gravityToneMatchRange.value;
}

function numericValue(input, fallback = 0) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function checkedGravityTags() {
  return Array.from(gravityTagGrid.querySelectorAll("input:checked")).map((input) => input.value);
}

function readGravityCandidate() {
  const followerMin = Math.min(numericValue(gravityFollowerMin, 5000), numericValue(gravityFollowerMax, 50000));
  const followerMax = Math.max(numericValue(gravityFollowerMin, 5000), numericValue(gravityFollowerMax, 50000));
  return {
    id: window.crypto && typeof window.crypto.randomUUID === "function" ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    mode: gravityModeSelect.value,
    relationship: gravityRelationshipSelect.value,
    text: gravityThreadText.value.trim(),
    url: gravityUrlInput.value.trim(),
    handle: gravityHandleInput.value.trim() || "@unknown",
    followers: numericValue(gravityFollowersInput, 0),
    likes: numericValue(gravityLikesInput, 0),
    replies: numericValue(gravityRepliesInput, 0),
    hours: numericValue(gravityHoursInput, 24),
    recurringUsers: numericValue(gravityRecurringUsersInput, 0),
    followerMin,
    followerMax,
    niche: numericValue(gravityNicheRange, 0),
    aesthetic: numericValue(gravityAestheticRange, 0),
    emotionalDepth: numericValue(gravityEmotionalDepthRange, 0),
    toneMatch: numericValue(gravityToneMatchRange, 0),
    tags: checkedGravityTags(),
    authorReplies: gravityAuthorReplies.checked,
    backAndForth: gravityBackAndForth.checked,
    realHumans: gravityRealHumans.checked,
    lateNightActive: gravityLateNightActive.checked,
    originalMedia: gravityOriginalMedia.checked,
    nonPolitical: gravityNonPolitical.checked,
    noBotHeavy: gravityNoBotHeavy.checked,
    list: gravityListSelect.value,
    listType: gravityListTypeSelect.value,
    createdAt: new Date().toISOString()
  };
}

function breakdownRow(label, value) {
  const isRisk = /risk|cemetery/i.test(label);
  const tooltip = signatureTooltips[label] || "Yuna internal room signal.";
  return `
    <div class="breakdown-row ${isRisk ? "risk-row" : ""}" title="${escapeHtml(tooltip)}">
      <span>${escapeHtml(label)}</span>
      <span class="bar-shell"><span class="bar-fill" style="width: ${boundedScore(value)}%"></span></span>
      <span>${boundedScore(value)}</span>
    </div>
  `;
}

function setSoftRoomsMeta(lines) {
  softRoomsMeta.innerHTML = lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function renderSoftRoomsMeta(candidate, result) {
  if (!candidate || !result) {
    setSoftRoomsMeta([
      "some rooms feel alive immediately.",
      "score a thread to reveal the softer signals."
    ]);
    return;
  }

  const aliveSignals = result.cultureSignals?.aliveSignals || [];
  const deadSignals = result.cultureSignals?.deadSignals || [];
  const lines = [
    `Quiet Gravity: ${result.score}/100 · ${result.decision}`,
    `Alive Room Index: ${result.aliveRoom} · Familiar Faces: ${candidate.recurringUsers || 0}`,
    `Emotional Echo: ${result.emotionalDepth} · Quote Cemetery Risk: ${result.quoteCemeteryRisk}`,
    aliveSignals.length ? `soft signal: ${aliveSignals.slice(0, 4).join(", ")}` : "soft signal: waiting for human warmth",
    deadSignals.length ? `cemetery dust: ${deadSignals.slice(0, 3).join(", ")}` : "cemetery dust: low",
    candidate.lateNightActive || containsAny(`${candidate.text} ${(candidate.tags || []).join(" ")}`.toLowerCase(), ["late night", "2am", "3am", "tonight"])
      ? "window rain mode: late-night gravity detected."
      : "window rain mode: quiet, not active yet."
  ];
  setSoftRoomsMeta(lines);
}

function renderGravityScore() {
  if (!gravityCurrentScore) {
    gravityScoreValue.textContent = "--";
    gravityScoreLabel.textContent = "Score a thread to decide whether to skip, watch, or reply.";
    gravityBreakdown.innerHTML = "";
    gravityWhy.textContent = "The console is now a map first, reply tool second.";
    gravityQuoteWarning.hidden = true;
    gravityQuoteWarning.textContent = "";
    renderSoftRoomsMeta(null, null);
    gravityGenerateRepliesBtn.disabled = true;
    gravityAddCandidateBtn.disabled = true;
    gravitySaveSessionBtn.disabled = true;
    setGravityQuickActionsDisabled(true);
    return;
  }

  const { candidate, result } = gravityCurrentScore;
  gravityScoreValue.textContent = result.score;
  gravityScoreLabel.textContent = result.decision === "recommended"
    ? "quiet gravity well"
    : result.decision === "watch"
      ? "watch the room first"
      : "skip this thread";
  gravityBreakdown.innerHTML = Object.entries(result.breakdown).map(([label, value]) => breakdownRow(label, value)).join("");
  gravityWhy.textContent = gravityWhyText(candidate, result);
  const deadSignals = result.cultureSignals?.deadSignals || [];
  gravityQuoteWarning.hidden = result.quoteCemeteryRisk < 45 && deadSignals.length === 0;
  gravityQuoteWarning.textContent = gravityQuoteWarning.hidden
    ? ""
    : `Quote cemetery warning: ${deadSignals.slice(0, 4).join(", ") || "passive quote-farm pattern"}. Look for real back-and-forth before replying.`;
  renderSoftRoomsMeta(candidate, result);
  gravityGenerateRepliesBtn.disabled = result.score < 50;
  gravityAddCandidateBtn.disabled = false;
  gravitySaveSessionBtn.disabled = false;
  setGravityQuickActionsDisabled(false);
}

function setGravityQuickActionsDisabled(disabled) {
  [
    gravityOpenThreadBtn,
    gravityOpenProfileBtn,
    gravityCopyHandleBtn,
    gravitySaveCalmTechBtn,
    gravitySaveFrequencyBtn,
    gravityMarkRecurringBtn
  ].forEach((button) => {
    button.disabled = disabled;
  });
}

function renderGravityReplies() {
  gravityRepliesList.innerHTML = gravityCurrentReplies.length
    ? gravityCurrentReplies.map((reply, index) => `
      <article class="reply-card">
        <p class="reply-text">${escapeHtml(reply.text)}</p>
        <div class="reply-meta">
          <span class="pill">${reply.text.length}/220</span>
          <span class="pill">${escapeHtml(reply.mode)}</span>
          <span class="pill">${escapeHtml(reply.relationship)}</span>
        </div>
        <div class="reply-actions">
          <button class="small" type="button" data-gravity-reply-action="copy" data-index="${index}">Copy</button>
        </div>
      </article>
    `).join("")
    : '<p class="empty">Score a thread first. Replies stay locked for skipped threads.</p>';
}

function renderGravityLists() {
  renderGravityListSelect();
  const listNames = Object.keys(gravityState.lists).sort();
  gravityListsView.innerHTML = listNames.length
    ? listNames.map((listName) => {
      const items = gravityState.lists[listName] || [];
      const preview = items.slice(0, 4).map((item) => `
        <div class="gravity-item">
          <h3>${escapeHtml(item.handle)} <span class="pill">${item.score}</span></h3>
          <p>${escapeHtml(item.decision)} · ${escapeHtml(item.listType)} · ${escapeHtml((item.tags || []).slice(0, 3).join(", ") || "no tags")}</p>
          <p>${item.inactive ? "inactive risk" : "active enough"} · ${escapeHtml(item.url || "no url saved")}</p>
        </div>
      `).join("");
      return `
        <section class="gravity-item">
          <h3>${escapeHtml(listName)} <span class="pill">${items.length}</span></h3>
          ${preview || "<p>No candidates yet.</p>"}
        </section>
      `;
    }).join("")
    : '<p class="empty">Create a radar list or add a scored candidate.</p>';
}

function renderGravitySessions() {
  gravitySessionsView.innerHTML = gravityState.sessions.length
    ? gravityState.sessions.slice(0, 8).map((session) => `
      <article class="gravity-item">
        <h3>${escapeHtml(session.handle)} <span class="pill">${session.score}</span></h3>
        <p>${escapeHtml(session.mode)} · ${escapeHtml(session.decision)} · ${formatDate(session.createdAt)}</p>
        <p>${escapeHtml(session.why)}</p>
      </article>
    `).join("")
    : '<p class="empty">Saved radar sessions will appear here.</p>';
}

function renderGravityAccountNotes() {
  gravityClearAccountNotesBtn.disabled = gravityState.accountNotes.length === 0;
  gravityAccountNotesView.innerHTML = gravityState.accountNotes.length
    ? gravityState.accountNotes.slice(0, 12).map((note) => `
      <article class="gravity-item">
        <h3>${escapeHtml(note.handle)} ${note.score !== null && note.score !== undefined ? `<span class="pill">${note.score}</span>` : ""}</h3>
        <p>${escapeHtml(note.status)} · ${escapeHtml(note.vibe || "no cluster")} · ${formatDate(note.createdAt)}</p>
        <p>${escapeHtml(note.text || "No private note yet.")}</p>
        ${note.replyCulture !== null && note.replyCulture !== undefined ? `<p>Human Warmth ${escapeHtml(String(note.replyCulture))} · ${escapeHtml(note.list || "no list")}</p>` : ""}
        ${note.aliveRoom !== null && note.aliveRoom !== undefined ? `<p>Alive Room Index ${escapeHtml(String(note.aliveRoom))} · Quote Cemetery Risk ${escapeHtml(String(note.quoteCemeteryRisk ?? 0))} · Familiar Faces ${escapeHtml(String(note.recurringUsers ?? 0))}</p>` : ""}
      </article>
    `).join("")
    : '<p class="empty">Account notes stay local on this browser.</p>';
}

function renderGravityAll() {
  syncGravityRangeLabels();
  renderGravityScore();
  renderGravityReplies();
  renderGravityLists();
  renderGravitySessions();
  renderGravityAccountNotes();
}

function gravityStatusLine(result) {
  if (result.quoteCemeteryRisk >= 55) return "Quote Cemetery Risk high. not every thread deserves your energy.";
  if (result.score >= 70 && result.cultureSignals?.aliveSignals?.includes("recurring familiar people")) return "Familiar people detected.";
  if (result.score >= 70 && result.cultureSignals?.aliveSignals?.includes("late-night active room")) return "Late-night gravity detected.";
  if (result.score >= 70 && result.aliveRoom >= 76) return "Some rooms feel alive immediately.";
  if (result.score >= 70) return "Quiet Gravity is strong here.";
  if (result.score >= 50) return "Watch the room first. Soft Signal is forming.";
  return "Not every thread deserves your energy.";
}

function scoreGravityThread() {
  const candidate = readGravityCandidate();
  const result = scoreGravityCandidate(candidate);
  gravityCurrentScore = { candidate, result };
  gravityCurrentReplies = [];
  if (!gravityAccountNoteHandleInput.value.trim()) {
    gravityAccountNoteHandleInput.value = candidate.handle;
  }
  if (!gravityAccountNoteVibeInput.value.trim() && candidate.tags.length) {
    gravityAccountNoteVibeInput.value = candidate.tags.slice(0, 3).join(", ");
  }
  renderGravityAll();
  setGravityStatus(gravityStatusLine(result));
}

function generateGravityReplies() {
  if (!gravityCurrentScore || gravityCurrentScore.result.score < 50) return;
  if (!ensureActiveSessionForReply(setGravityStatus)) return;
  const { candidate } = gravityCurrentScore;
  const baseContext = `${candidate.text} ${candidate.mode} ${candidate.tags.join(" ")}`.toLowerCase();
  const founderish = containsAny(baseContext, ["founder", "builder", "app", "shipping", "saas", "startup"]);
  const rawReplies = [
    founderish ? "fair honestly. this is the part most people do not see." : "fair honestly. one real reply can change the whole feeling here.",
    candidate.relationship === "lonely builder" ? "yeah this part. building around silence can make every small reply feel bigger." : "felt this honestly. the right small thread can make the internet feel less random.",
    founderish ? "honestly, tiny internet rooms are weirdly powerful when people are actually talking." : "yeah. quiet threads like this are why the internet still feels human sometimes.",
    candidate.relationship === "mentor" || candidate.relationship === "admired creator" ? "respect this. you are naming the quieter part without turning it into a performance." : "i’ve learned this the slow way too. the replies matter more when the room is small.",
    "yeah this part."
  ];
  const gravityEcho = buildEchoCandidates(candidate.text, founderish ? "founder" : "wellness");
  const bestEcho = gravityEcho.candidates.sort((a, b) => b.score - a.score)[0];
  if (bestEcho) rawReplies[1] = bestEcho.text;
  gravityCurrentReplies = replyEngineRules.replyOrder.map((mode, index) => ({
    text: humanizeReply(rawReplies[index], mode, founderish ? "founder" : "wellness", candidate.text),
    mode,
    relationship: candidate.relationship
  }));
  recordReplyGeneration();
  renderGravityReplies();
  setGravityStatus("Secondary replies ready.");
}

function currentGravitySnapshot() {
  if (!gravityCurrentScore) return null;
  const { candidate, result } = gravityCurrentScore;
  return {
    ...candidate,
    score: result.score,
    decision: result.decision,
    why: gravityWhyText(candidate, result),
    cultureSignals: result.cultureSignals,
    aliveRoom: result.aliveRoom,
    emotionalDepth: result.emotionalDepth,
    quoteCemeteryRisk: result.quoteCemeteryRisk,
    inactive: candidate.hours > 24 || candidate.replies < 5 || !candidate.authorReplies
  };
}

function normalizedHandle(handle) {
  return (handle || "").trim().replace(/^@/, "");
}

function gravityProfileUrl(candidate = readGravityCandidate()) {
  const handle = normalizedHandle(candidate.handle);
  return handle ? `https://x.com/${encodeURIComponent(handle)}` : "";
}

function saveGravitySnapshotToList(listName, extra = {}) {
  const snapshot = currentGravitySnapshot();
  if (!snapshot) return;
  if (!gravityState.lists[listName]) gravityState.lists[listName] = [];
  gravityState.lists[listName].unshift({
    ...snapshot,
    ...extra
  });
  gravityState.lists[listName] = gravityState.lists[listName].slice(0, 80);
  writeGravityStorage();
  renderGravityLists();
  setGravityStatus(`Saved to ${listName}.`);
}

function addGravityCandidateToList() {
  const snapshot = currentGravitySnapshot();
  if (!snapshot) return;
  const listName = gravityListSelect.value || "CalmTech";
  if (!gravityState.lists[listName]) gravityState.lists[listName] = [];
  gravityState.lists[listName].unshift(snapshot);
  gravityState.lists[listName] = gravityState.lists[listName].slice(0, 80);
  writeGravityStorage();
  renderGravityLists();
  setGravityStatus(`Added to ${listName}.`);
}

function saveGravitySession() {
  const snapshot = currentGravitySnapshot();
  if (!snapshot) return;
  gravityState.sessions.unshift(snapshot);
  writeGravityStorage();
  renderGravitySessions();
  setGravityStatus("Radar session saved.");
}

function saveGravityAccountNote() {
  const snapshot = currentGravitySnapshot();
  const handle = gravityAccountNoteHandleInput.value.trim() || snapshot?.handle || gravityHandleInput.value.trim();
  if (!handle) {
    setGravityStatus("Add a handle before saving an account note.");
    gravityAccountNoteHandleInput.focus();
    return;
  }

  const note = {
    id: window.crypto && typeof window.crypto.randomUUID === "function" ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    handle,
    status: gravityAccountNoteStatusSelect.value || "watch again",
    vibe: gravityAccountNoteVibeInput.value.trim() || (snapshot?.tags || checkedGravityTags()).slice(0, 3).join(", "),
    text: gravityAccountNoteText.value.trim(),
    score: snapshot?.score ?? null,
    replyCulture: gravityCurrentScore?.result.breakdown["Human Warmth"] ?? null,
    aliveRoom: gravityCurrentScore?.result.aliveRoom ?? null,
    quoteCemeteryRisk: gravityCurrentScore?.result.quoteCemeteryRisk ?? null,
    recurringUsers: Math.max(snapshot?.recurringUsers ?? 0, numericValue(gravityRecurringUsersInput, 0)),
    list: gravityListSelect.value || "",
    url: snapshot?.url || gravityUrlInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  gravityState.accountNotes = gravityState.accountNotes.filter((item) => item.handle.toLowerCase() !== handle.toLowerCase());
  gravityState.accountNotes.unshift(note);
  writeGravityStorage();
  renderGravityAccountNotes();
  setGravityStatus(`Saved account note for ${handle}.`);
}

function markGravityRecurringAccount() {
  const snapshot = currentGravitySnapshot();
  if (!snapshot) return;
  gravityRecurringUsersInput.value = String(Math.max(numericValue(gravityRecurringUsersInput, 0), 2));
  gravityLateNightActive.checked = snapshot.lateNightActive || containsAny(`${snapshot.text} ${(snapshot.tags || []).join(" ")}`.toLowerCase(), ["late night", "2am", "3am", "tonight"]);
  gravityAccountNoteHandleInput.value = snapshot.handle;
  gravityAccountNoteStatusSelect.value = "good small room";
  gravityAccountNoteVibeInput.value = [...new Set([...(snapshot.tags || []), ...(snapshot.cultureSignals?.boosts || [])])]
    .slice(0, 5)
    .join(", ");
  const noteText = gravityAccountNoteText.value.trim();
  gravityAccountNoteText.value = noteText
    ? `${noteText}\nrecurring familiar account. people seem to actually talk here.`
    : "recurring familiar account. people seem to actually talk here.";
  saveGravityAccountNote();
}

function addGravityListGroup() {
  const listName = gravityNewListInput.value.trim();
  if (!listName) return;
  if (!gravityState.lists[listName]) gravityState.lists[listName] = [];
  gravityNewListInput.value = "";
  writeGravityStorage();
  renderGravityLists();
  gravityListSelect.value = listName;
  setGravityStatus("List group added.");
}

function exportGravityLists() {
  gravityImportExport.value = JSON.stringify({ lists: gravityState.lists, exportedAt: new Date().toISOString() }, null, 2);
  setGravityStatus("Radar lists exported.");
}

function importGravityLists() {
  try {
    const parsed = JSON.parse(gravityImportExport.value);
    if (!parsed.lists || typeof parsed.lists !== "object") throw new Error("Missing lists");
    gravityState.lists = parsed.lists;
    ensureGravityLists();
    writeGravityStorage();
    renderGravityLists();
    setGravityStatus("Radar lists imported.");
  } catch (error) {
    setGravityStatus("Import failed. Paste exported radar JSON.");
  }
}
