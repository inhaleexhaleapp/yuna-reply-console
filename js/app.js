// Event wiring and startup. Loaded last.

suggestionsList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const reply = currentReplies[Number(button.dataset.index)];
  if (!reply) return;

  if (button.dataset.action === "copy") {
    await copyText(reply.text);
    setStatus("Copied reply.");
  }

  if (button.dataset.action === "favorite") {
    toggleFavorite(reply);
  }

  if (button.dataset.action === "used") {
    markUsed(reply);
  }
});

founderSuggestionsList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-founder-action]");
  if (!button) return;
  const reply = founderCurrentReplies[Number(button.dataset.index)];
  if (!reply) return;

  if (button.dataset.founderAction === "copy") {
    await copyText(reply.text);
    setFounderStatus("Copied founder reply.");
  }

  if (button.dataset.founderAction === "favorite") {
    toggleFounderFavorite(reply);
  }

  if (button.dataset.founderAction === "used") {
    markFounderUsed(reply);
  }
});

document.addEventListener("click", async (event) => {
  const gravityReplyButton = event.target.closest("button[data-gravity-reply-action]");
  if (gravityReplyButton) {
    const reply = gravityCurrentReplies[Number(gravityReplyButton.dataset.index)];
    if (!reply) return;
    await copyText(reply.text);
    setGravityStatus("Gravity reply copied.");
    return;
  }

  const radarButton = event.target.closest("button[data-radar-action]");
  if (radarButton) {
    const query = decodeURIComponent(radarButton.dataset.query || "");
    const scope = radarButton.dataset.radarScope || "wellness";
    if (!query) return;

    if (radarButton.dataset.radarAction === "copy") {
      await copyText(query);
      if (scope === "founder") {
        setFounderStatus("Founder search query copied.");
      } else if (scope === "music") {
        setMusicStatus("Search query copied.");
      } else {
        setStatus("Search query copied.");
      }
    }

    if (radarButton.dataset.radarAction === "open") {
      window.open(buildXSearchUrl(query), "_blank", "noopener,noreferrer");
      if (scope === "founder") {
        setFounderStatus("Opened founder X search in a new tab.");
      } else if (scope === "music") {
        setMusicStatus("Opened X search in a new tab.");
      } else {
        setStatus("Opened X search in a new tab.");
      }
    }
    return;
  }

  const founderMemoryButton = event.target.closest("button[data-founder-memory-action]");
  if (founderMemoryButton) {
    const type = founderMemoryButton.dataset.type;
    const index = Number(founderMemoryButton.dataset.index);
    const item = getFounderMemoryItem(type, index);
    if (!item) return;

    if (founderMemoryButton.dataset.founderMemoryAction === "copy") {
      await copyText(item.text);
      setFounderStatus("Copied founder reply.");
    }

    if (founderMemoryButton.dataset.founderMemoryAction === "favorite") {
      founderState.favorites.splice(index, 1);
      writeFounderStorage();
      renderFounderAll();
      setFounderStatus("Removed from Indie Founder favorites.");
    }

    if (founderMemoryButton.dataset.founderMemoryAction === "used") {
      markFounderUsed(item);
    }
    return;
  }

  const button = event.target.closest("button[data-memory-action]");
  if (!button) return;

  const type = button.dataset.type;
  const index = Number(button.dataset.index);
  const item = getMemoryItem(type, index);
  if (!item) return;

  if (button.dataset.memoryAction === "copy") {
    await copyText(item.text);
    setStatus("Copied reply.");
  }

  if (button.dataset.memoryAction === "favorite") {
    appState.favorites.splice(index, 1);
    writeStorage();
    renderAll();
    setStatus("Removed from favorites.");
  }

  if (button.dataset.memoryAction === "used") {
    markUsed(item);
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchToTab(button.dataset.tabTarget);
  });
});

sessionModal.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-session-intention]");
  if (!button) return;
  startSession(button.dataset.sessionIntention);
});

endSessionBtn.addEventListener("click", () => {
  endCurrentSession("ended");
});

gravityScoreBtn.addEventListener("click", scoreGravityThread);
gravityGenerateRepliesBtn.addEventListener("click", generateGravityReplies);
gravityAddCandidateBtn.addEventListener("click", addGravityCandidateToList);
gravityAddListBtn.addEventListener("click", addGravityListGroup);
gravitySaveSessionBtn.addEventListener("click", saveGravitySession);
gravitySaveAccountNoteBtn.addEventListener("click", saveGravityAccountNote);
gravityOpenThreadBtn.addEventListener("click", () => {
  const snapshot = currentGravitySnapshot();
  if (!snapshot?.url) {
    setGravityStatus("Paste a thread URL first.");
    return;
  }
  window.open(snapshot.url, "_blank", "noopener,noreferrer");
  setGravityStatus("Opened thread in X.");
});
gravityOpenProfileBtn.addEventListener("click", () => {
  const profileUrl = gravityProfileUrl();
  if (!profileUrl) {
    setGravityStatus("Add a handle first.");
    return;
  }
  window.open(profileUrl, "_blank", "noopener,noreferrer");
  setGravityStatus("Opened profile in X.");
});
gravityCopyHandleBtn.addEventListener("click", async () => {
  const snapshot = currentGravitySnapshot();
  if (!snapshot?.handle) return;
  await copyText(snapshot.handle);
  setGravityStatus("Handle copied.");
});
gravitySaveCalmTechBtn.addEventListener("click", () => {
  saveGravitySnapshotToList("CalmTech", { quickSave: "calm-tech" });
});
gravitySaveFrequencyBtn.addEventListener("click", () => {
  saveGravitySnapshotToList("MantraFrequency", { quickSave: "mantra-frequency" });
});
gravityMarkRecurringBtn.addEventListener("click", markGravityRecurringAccount);
gravityClearSessionsBtn.addEventListener("click", () => {
  gravityState.sessions = [];
  writeGravityStorage();
  renderGravitySessions();
  setGravityStatus("Radar sessions cleared.");
});
gravityClearAccountNotesBtn.addEventListener("click", () => {
  gravityState.accountNotes = [];
  writeGravityStorage();
  renderGravityAccountNotes();
  setGravityStatus("Account notes cleared.");
});
gravityExportBtn.addEventListener("click", exportGravityLists);
gravityImportBtn.addEventListener("click", importGravityLists);
[
  gravityFollowerMin,
  gravityFollowerMax,
  gravityNicheRange,
  gravityAestheticRange,
  gravityEmotionalDepthRange,
  gravityToneMatchRange
].forEach((input) => input.addEventListener("input", syncGravityRangeLabels));

generateBtn.addEventListener("click", () => generateReplies("base"));
softerBtn.addEventListener("click", () => generateReplies("softer"));
humanBtn.addEventListener("click", () => generateReplies("human"));
shorterBtn.addEventListener("click", () => generateReplies("shorter"));

founderGenerateBtn.addEventListener("click", () => generateFounderReplies("base"));
founderShorterBtn.addEventListener("click", () => generateFounderReplies("shorter"));
founderHumanBtn.addEventListener("click", () => generateFounderReplies("human"));
founderCasualBtn.addEventListener("click", () => generateFounderReplies("casual"));
founderLinkModeSelect.addEventListener("change", saveFounderSettings);
founderFormatSelect.addEventListener("change", saveFounderSettings);

function syncClaudePromptButtons() {
  claudePromptBtn.disabled = !tweetInput.value.trim();
  founderClaudePromptBtn.disabled = !founderTweetInput.value.trim();
}

tweetInput.addEventListener("input", syncClaudePromptButtons);
founderTweetInput.addEventListener("input", syncClaudePromptButtons);
syncClaudePromptButtons();

claudePromptBtn.addEventListener("click", async () => {
  const tweetText = tweetInput.value.trim();
  if (!tweetText) return;
  await copyText(buildClaudePrompt(tweetText, "wellness", {
    category: categorySelect.value,
    tone: toneSelect.value
  }));
  setStatus("Claude prompt copied. Paste it into claude.ai, then pick one by hand.");
});

founderClaudePromptBtn.addEventListener("click", async () => {
  const tweetText = founderTweetInput.value.trim();
  if (!tweetText) return;
  const settings = currentFounderSettings();
  await copyText(buildClaudePrompt(tweetText, "founder", {
    category: founderCategorySelect.value,
    tone: founderToneSelect.value,
    linkMode: settings.linkMode,
    format: settings.format
  }));
  setFounderStatus("Claude prompt copied. Paste it into claude.ai, then pick one by hand.");
});

[[tweetInput, () => generateReplies()], [founderTweetInput, () => generateFounderReplies()]].forEach(([input, run]) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      run();
    }
  });
});

copyAllBtn.addEventListener("click", async () => {
  if (!currentReplies.length) return;
  await copyText(currentReplies.map((reply) => reply.text).join("\n\n"));
  setStatus("Copied all suggestions.");
});

founderCopyAllBtn.addEventListener("click", async () => {
  if (!founderCurrentReplies.length) return;
  await copyText(founderCurrentReplies.map((reply) => reply.text).join("\n\n"));
  setFounderStatus("Copied all founder suggestions.");
});

clearFavoritesBtn.addEventListener("click", () => {
  appState.favorites = [];
  writeStorage();
  renderAll();
  setStatus("Favorites cleared.");
});

clearHistoryBtn.addEventListener("click", () => {
  appState.used = [];
  appState.history = [];
  writeStorage();
  renderAll();
  setStatus("History cleared.");
});

founderClearFavoritesBtn.addEventListener("click", () => {
  founderState.favorites = [];
  writeFounderStorage();
  renderFounderAll();
  setFounderStatus("Indie Founder favorites cleared.");
});

founderClearHistoryBtn.addEventListener("click", () => {
  founderState.used = [];
  founderState.history = [];
  writeFounderStorage();
  renderFounderAll();
  setFounderStatus("Indie Founder history cleared.");
});

tweetInput.addEventListener("input", () => {
  updateTweetCount();
  renderWellnessWorthiness();
});
categorySelect.addEventListener("change", renderWellnessWorthiness);
toneSelect.addEventListener("change", renderWellnessWorthiness);
founderTweetInput.addEventListener("input", () => {
  updateFounderTweetCount();
  renderFounderWorthiness();
});
founderCategorySelect.addEventListener("change", renderFounderWorthiness);
founderToneSelect.addEventListener("change", renderFounderWorthiness);

// Gravity Map shortcuts only apply while that tab is open, so ⌘R still reloads
// and the reply boxes keep their own ⌘Enter.
document.addEventListener("keydown", (event) => {
  const meta = event.metaKey || event.ctrlKey;
  if (!meta || event.altKey) return;
  if (!document.getElementById("gravityPanel").classList.contains("is-active")) return;
  if (event.target && ["tweetInput", "founderTweetInput", "musicTweetInput"].includes(event.target.id)) return;
  if (event.key === "Enter" && event.shiftKey) {
    event.preventDefault();
    generateGravityReplies();
  } else if (event.key === "Enter") {
    event.preventDefault();
    scoreGravityThread();
  } else if (event.key.toLowerCase() === "s" && !event.shiftKey) {
    event.preventDefault();
    saveGravitySession();
  }
});

backupExportBtn.addEventListener("click", () => {
  const backup = collectBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `yuna-backup-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  backupStatus.textContent = `Backup saved · ${summarizeBackupData(backup.data)}.`;
});

backupImportInput.addEventListener("change", async () => {
  const file = backupImportInput.files && backupImportInput.files[0];
  backupImportInput.value = "";
  if (!file) return;
  try {
    const { exportedAt, entries } = parseBackup(await file.text());
    const data = Object.fromEntries(entries);
    const when = exportedAt ? formatDate(exportedAt) : "an unknown date";
    const confirmed = window.confirm(`Replace this browser's Yuna data with the backup from ${when}?\n\n${summarizeBackupData(data)}`);
    if (!confirmed) {
      backupStatus.textContent = "Restore cancelled. Nothing changed.";
      return;
    }
    Object.keys(localStorage).filter(isYunaStorageKey).forEach((key) => localStorage.removeItem(key));
    entries.forEach(([key, value]) => localStorage.setItem(key, value));
    window.location.reload();
  } catch (error) {
    backupStatus.textContent = `Restore failed: ${error.message}`;
  }
});

populateGravityControls();
populateSelectors();
populateFounderSelectors();
applyYunaSignatureLayer();
applyShortcutLaunchMode();
hydrateSessionState();
renderGravityAll();
updateTweetCount();
updateFounderTweetCount();
renderAll();
renderFounderAll();
initMusicTab();
