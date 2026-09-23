// localStorage keys, session intentions and read/write helpers.

const storageKeys = {
  favorites: "yunaReplyFavorites",
  used: "yunaReplyUsed",
  history: "yunaReplyHistory"
};

const founderStorageKeys = {
  favorites: "yunaFounderReplyFavorites",
  used: "yunaFounderReplyUsed",
  history: "yunaFounderReplyHistory",
  settings: "yunaFounderReplySettings"
};

const gravityStorageKeys = {
  lists: "yunaGravityLists",
  sessions: "yunaGravitySessions",
  accountNotes: "yunaGravityAccountNotes"
};

const sessionStorageKeys = {
  current: "yuna_session_current",
  history: "yuna_session_history"
};

const sessionIntentions = {
  "map-only": {
    emoji: "🗺",
    label: "Map only",
    replyLimit: 0,
    description: "Map and score only."
  },
  "reply-soft": {
    emoji: "🕯",
    label: "Reply soft",
    replyLimit: 3,
    description: "A small reply session."
  },
  "full": {
    emoji: "🌊",
    label: "Full",
    replyLimit: 5,
    description: "A full intentional session."
  },
  "looking": {
    emoji: "👀",
    label: "Looking",
    replyLimit: 0,
    description: "Browse memory only."
  }
};

const sessionMaxAgeMs = 6 * 60 * 60 * 1000;

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function readShortcutLaunchMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = (params.get("mode") || "").toLowerCase().trim();
    return ["tonight", "founder", "wellness", "gravity", "music"].includes(mode) ? mode : "";
  } catch (error) {
    return "";
  }
}

function writeStorage() {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(appState.favorites.slice(0, 80)));
  localStorage.setItem(storageKeys.used, JSON.stringify(appState.used.slice(0, 120)));
  localStorage.setItem(storageKeys.history, JSON.stringify(appState.history.slice(0, 40)));
}

function writeFounderStorage() {
  localStorage.setItem(founderStorageKeys.favorites, JSON.stringify(founderState.favorites.slice(0, 80)));
  localStorage.setItem(founderStorageKeys.used, JSON.stringify(founderState.used.slice(0, 120)));
  localStorage.setItem(founderStorageKeys.history, JSON.stringify(founderState.history.slice(0, 40)));
  localStorage.setItem(founderStorageKeys.settings, JSON.stringify(founderState.settings));
}

function writeGravityStorage() {
  localStorage.setItem(gravityStorageKeys.lists, JSON.stringify(gravityState.lists));
  localStorage.setItem(gravityStorageKeys.sessions, JSON.stringify(gravityState.sessions.slice(0, 40)));
  localStorage.setItem(gravityStorageKeys.accountNotes, JSON.stringify(gravityState.accountNotes.slice(0, 120)));
}

function writeSessionStorage() {
  if (sessionState) {
    localStorage.setItem(sessionStorageKeys.current, JSON.stringify(sessionState));
  } else {
    localStorage.removeItem(sessionStorageKeys.current);
  }
  localStorage.setItem(sessionStorageKeys.history, JSON.stringify(sessionHistory.slice(0, 30)));
}

function readMusicState() {
  const fallback = { used: [], history: [], people: [], portfolioUrl: "", linkMode: "none" };
  try {
    const parsed = JSON.parse(localStorage.getItem(musicStorageKey) || "null");
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeMusicStorage() {
  try {
    localStorage.setItem(musicStorageKey, JSON.stringify(musicState));
  } catch (error) {
    // storage can be unavailable in private windows; the tab still works in memory
  }
}
