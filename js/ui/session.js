// Session intentions, launch modes and tab switching.

function sessionStartedAtMs(session) {
  const started = Date.parse(session?.startedAt || "");
  return Number.isFinite(started) ? started : 0;
}

function isSessionExpired(session) {
  return !session || Date.now() - sessionStartedAtMs(session) > sessionMaxAgeMs;
}

function archiveSession(session, reason) {
  if (!session) return;
  sessionHistory.unshift({
    ...session,
    archivedAt: new Date().toISOString(),
    endReason: reason
  });
  sessionHistory = sessionHistory.slice(0, 30);
}

function renderSessionBadge() {
  if (!sessionState) {
    sessionBadge.hidden = true;
    sessionBadgeText.textContent = "";
    return;
  }

  const intention = sessionIntentions[sessionState.intention] || sessionIntentions["looking"];
  const count = `${sessionState.replyCount || 0}/${sessionState.replyLimit}`;
  const bypass = sessionState.bypassedLimit ? " · bypassed" : "";
  sessionBadge.hidden = false;
  sessionBadgeText.innerHTML = `${escapeHtml(intention.emoji)} ${escapeHtml(intention.label)} · ${escapeHtml(count)}${escapeHtml(bypass)}`;
}

function showSessionModal() {
  sessionModal.hidden = false;
}

function hideSessionModal() {
  sessionModal.hidden = true;
}

function hydrateSessionState() {
  sessionHistory = readStorage(sessionStorageKeys.history, []);
  const savedSession = readStorage(sessionStorageKeys.current, null);

  if (savedSession && isSessionExpired(savedSession)) {
    archiveSession(savedSession, "expired");
    sessionState = null;
    writeSessionStorage();
  } else {
    sessionState = savedSession;
  }

  renderSessionBadge();
  if (!sessionState) {
    showSessionModal();
  }
}

function startSession(intentionKey) {
  const intention = sessionIntentions[intentionKey] || sessionIntentions["looking"];
  sessionState = {
    id: window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    intention: intentionKey,
    replyLimit: intention.replyLimit,
    replyCount: 0,
    bypassedLimit: false,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  hideSessionModal();
  writeSessionStorage();
  renderSessionBadge();
}

function endCurrentSession(reason = "ended") {
  if (sessionState) {
    archiveSession(sessionState, reason);
  }
  sessionState = null;
  writeSessionStorage();
  renderSessionBadge();
  showSessionModal();
}

function ensureActiveSessionForReply(statusSetter) {
  if (sessionState && isSessionExpired(sessionState)) {
    endCurrentSession("expired");
  }

  if (!sessionState) {
    showSessionModal();
    statusSetter("Choose a session intention before generating replies.");
    return false;
  }

  if ((sessionState.replyCount || 0) >= sessionState.replyLimit) {
    const intention = sessionIntentions[sessionState.intention] || sessionIntentions["looking"];
    const confirmed = window.confirm(
      `${intention.label} is at ${sessionState.replyCount || 0}/${sessionState.replyLimit}. Generate replies anyway?`
    );
    if (!confirmed) {
      statusSetter("Reply generation paused by session intention.");
      return false;
    }
    sessionState.bypassedLimit = true;
  }

  return true;
}

function recordReplyGeneration() {
  if (!sessionState) return;
  sessionState.replyCount = (sessionState.replyCount || 0) + 1;
  sessionState.updatedAt = new Date().toISOString();
  writeSessionStorage();
  renderSessionBadge();
}

function applyYunaSignatureLayer() {
  const hour = new Date().getHours();
  const isTonight = activeLaunchMode === "tonight" || hour < 5 || hour >= 23;
  if (isTonight) {
    document.body.classList.add("yuna-night-mode");
    yunaWhisper.textContent = activeLaunchMode === "tonight"
      ? "open a few doors, choose gently."
      : tonightWhispers[hour % tonightWhispers.length];
    yunaWhisper.title = "Tonight Mode · shortcut-safe local UI";
    return;
  }
  yunaWhisper.textContent = signatureWhispers[hour % signatureWhispers.length];
  yunaWhisper.title = "Yuna signature layer";
}

function switchToTab(targetId) {
  tabButtons.forEach((tabButton) => {
    tabButton.setAttribute("aria-selected", String(tabButton.dataset.tabTarget === targetId));
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === targetId);
  });
}

function applyShortcutLaunchMode() {
  if (!activeLaunchMode) return;
  const modeConfig = {
    tonight: {
      label: "Tonight Mode · opened by shortcut",
      tab: "gravityPanel",
      whisper: "late-night rooms are probably awake."
    },
    founder: {
      label: "Founder Mode · opened by shortcut",
      tab: "founderPanel",
      whisper: "look for small threads with real replies."
    },
    wellness: {
      label: "Wellness / Yuna · opened by shortcut",
      tab: "wellnessPanel",
      whisper: "open a few doors, choose gently."
    },
    music: {
      label: "Music / Sound · opened by shortcut",
      tab: "musicPanel",
      whisper: new Date().getDay() === 6 ? "saturday. the screenshots are out." : "find one scene you can already hear."
    },
    gravity: {
      label: "Gravity Map · opened by shortcut",
      tab: "gravityPanel",
      whisper: "not every thread deserves your energy."
    }
  }[activeLaunchMode];
  if (!modeConfig) return;
  launchModePill.hidden = false;
  launchModePill.textContent = modeConfig.label;
  launchModePill.title = "Shortcut launch mode. No API, no auto-search, no posting.";
  switchToTab(modeConfig.tab);
  yunaWhisper.textContent = modeConfig.whisper;
  yunaWhisper.title = "Shortcut launch microcopy";
}
