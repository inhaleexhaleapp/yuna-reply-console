// Backup and restore: moves all local Yuna data between browsers (iPad ⇄ Mac)
// as a single JSON file. Nothing leaves the device unless you move the file.

const BACKUP_APP_ID = "yuna-reply-console";
const BACKUP_VERSION = 1;

function isYunaStorageKey(key) {
  return typeof key === "string" && /^yuna/i.test(key);
}

function collectBackup(storage = localStorage, now = new Date()) {
  const data = {};
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (isYunaStorageKey(key)) data[key] = storage.getItem(key);
  }
  return { app: BACKUP_APP_ID, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error("That file is not valid JSON.");
  }
  if (!parsed || parsed.app !== BACKUP_APP_ID || typeof parsed.data !== "object" || parsed.data === null) {
    throw new Error("That file is not a Yuna backup.");
  }
  const entries = Object.entries(parsed.data).filter(([key, value]) => isYunaStorageKey(key) && typeof value === "string");
  if (!entries.length) throw new Error("The backup is empty.");
  return { exportedAt: parsed.exportedAt || "", entries };
}

function summarizeBackupData(data) {
  const read = (key, fallback) => {
    try {
      return data[key] ? JSON.parse(data[key]) : fallback;
    } catch (error) {
      return fallback;
    }
  };
  const music = read("yunaMusicState", {});
  const lists = read("yunaGravityLists", {});
  const used = read("yunaReplyUsed", []).length + read("yunaFounderReplyUsed", []).length + ((music && music.used) || []).length;
  const people = ((music && music.people) || []).length;
  const listCount = lists && typeof lists === "object" ? Object.keys(lists).length : 0;
  const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;
  return `${plural(people, "person", "people")} · ${plural(used, "used reply", "used replies")} · ${plural(listCount, "radar list", "radar lists")}`;
}

function mergeRadarLists(current, incoming) {
  const merged = { ...current };
  let added = 0;
  Object.entries(incoming || {}).forEach(([listName, items]) => {
    if (!Array.isArray(items)) return;
    const existing = Array.isArray(merged[listName]) ? merged[listName].slice() : [];
    const seen = new Set(existing.map((item) => `${(item.handle || "").toLowerCase()}|${item.url || ""}|${item.text || ""}`));
    items.forEach((item) => {
      const key = `${(item.handle || "").toLowerCase()}|${item.url || ""}|${item.text || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      existing.push(item);
      added += 1;
    });
    merged[listName] = existing.slice(0, 80);
  });
  return { lists: merged, added };
}
