// In-memory app state, hydrated from localStorage.

let currentReplies = [];
let currentVariant = "base";
let appState = {
  favorites: readStorage(storageKeys.favorites, []),
  used: readStorage(storageKeys.used, []),
  history: readStorage(storageKeys.history, [])
};
let founderCurrentReplies = [];
let founderCurrentVariant = "base";
let founderState = {
  favorites: readStorage(founderStorageKeys.favorites, []),
  used: readStorage(founderStorageKeys.used, []),
  history: readStorage(founderStorageKeys.history, []),
  settings: readStorage(founderStorageKeys.settings, { linkMode: "auto", format: "text" })
};
let activeLaunchMode = readShortcutLaunchMode();
let gravityCurrentScore = null;
let gravityCurrentReplies = [];
let gravityState = {
  lists: readStorage(gravityStorageKeys.lists, {}),
  sessions: readStorage(gravityStorageKeys.sessions, []),
  accountNotes: readStorage(gravityStorageKeys.accountNotes, [])
};
let sessionState = null;
let sessionHistory = [];

const musicState = readMusicState();
let musicCurrentReplies = [];
