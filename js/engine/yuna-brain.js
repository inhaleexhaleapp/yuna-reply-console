// Yuna's brain: a web port of YunaPet's behaviour spec (PETBRAIN.md).
// Pure data and decisions only. js/ui/yuna-pet.js does the drawing.
//
// Differences from the desktop pet, on purpose:
// - Yuna only starts rituals while you are quiet. While you type, she just breathes.
// - The idle clock ticks slower and the thresholds are longer: this is a work tool.
// - No needs, sulking or bathroom loop. She reacts to the console instead.

const YUNA_FRAMES = [
  "welcome", "hover-1", "wave-1", "wave-2", "peek-1", "shy-1", "sleep-1", "lotus-1", "float-1",
  "walk-1", "walk-2", "walk-3", "walk-4", "dragging", "drag-1", "window-sit", "break-1",
  "coffee-0", "coffee-1", "coffee-2", "matcha-1", "matcha-2", "onigiri-1", "onigiri-2",
  "myth-reading-1", "myth-reading-2", "snack-lettuce-1", "snack-activist", "snack-crunch", "snack-foodcoma",
  "incense-disaster-1", "incense-disaster-2", "incense-disaster-3",
  "pilates-balance", "pilates-launch", "pilates-facedown",
  "rain-hopeful", "rain-caught", "rain-defeated", "rain-recovery"
];

const yunaMoodWords = {
  sleepy: ["getting sleepy", "soft quiet", "resting here"],
  dreamy: ["daydreaming", "little dream", "soft glow"],
  cozy: ["cozy here", "warm quiet", "all soft"],
  floating: ["floating softly", "tiny drift", "light as air"],
  meditating: ["breathing slowly", "still moment", "soft focus"],
  playful: ["hi hi", "tiny wave", "found you"],
  shy: ["peek", "just checking", "hiding softly"],
  activist: ["LEAF POWER", "go vegan", "salad supremacy", "kale yeah", "meat is meh", "veggies unite"],
  scholar: ["ancient wisdom...", "the gods knew", "epic tales 📚", "lore unlocked", "myths whisper", "stories breathe", "legends rise"],
  chaotic: ["too much ambiance", "air quality...", "wellness gone wrong", "incense critical", "spirituality.exe failed"],
  clumsy: ["pilates violence", "inner balance achieved", "worth it", "gravity hates me", "physics 1, yuna 0"],
  soggy: ["so wet...", "thermos saved me", "weather attacked", "drip drip", "should've stayed in"]
};

// Ambient pool: cozy counts twice, like the desktop pet.
const yunaAmbientMoods = ["sleepy", "dreamy", "cozy", "cozy", "floating", "meditating", "playful", "shy"];

const yunaLines = {
  peekaboo: ["peekabooo", "yuna boo", "boo"],
  perch: ["perched 🪟", "good view", "leg swing"],
  fall: ["gravity...", "AAA", "i trusted this", "too slippery"],
  recovery: ["blanket ☁️", "cozy now", "soft sleep"],
  late: ["it's late. one more, then rest?", "the timeline will still be there tomorrow 🌙", "sleepy rooms, sleepy replies"],
  generate: ["read it once more?", "one real detail is enough", "pick the one you'd say out loud", "slow words, good words"],
  used: ["♡ sent by you, not me", "a real reply. nice.", "small and human ✨"]
};

// Rituals: [frame, fade seconds, hold [min,max] seconds, optional words, chance, effect, pose].
// Timings follow PETBRAIN.md §2, trimmed a little for a browser tab.
function yunaStep(frame, fade, hold, say = null, chance = 1, effect = null, pose = null) {
  return { frame, fade, hold, say, chance, effect, pose };
}

const yunaRituals = {
  coffee: {
    label: "Coffee break ☕",
    mood: "sleepy",
    steps: [
      yunaStep("coffee-0", 0.75, [3, 4.5], "...", 0.75, null, "sway"),
      yunaStep("coffee-1", 0.85, [3.5, 5], "warm coffee", 0.34, "steam"),
      yunaStep("coffee-2", 0.6, [1.8, 2.8], null, 1, "sparkle")
    ]
  },
  sip: {
    label: "One sip",
    mood: "cozy",
    steps: [
      yunaStep("coffee-1", 0.6, [1.8, 2.8], null, 1, "steam"),
      yunaStep("coffee-2", 0.5, [1.7, 2.4], null, 1, "sparkle")
    ]
  },
  matcha: {
    label: "Matcha 🍵",
    mood: "cozy",
    steps: [
      yunaStep("matcha-1", 0.6, [2, 2.8], "matcha time 🍵", 0.9, "steam"),
      yunaStep("matcha-2", 0.55, [2.4, 3.2], "warm and calm", 0.7)
    ]
  },
  onigiri: {
    label: "Feed onigiri 🍙",
    mood: "cozy",
    steps: [
      yunaStep("onigiri-1", 0.5, [1.6, 2.2], "onigiri! ♡", 0.9),
      yunaStep("onigiri-2", 0.4, [1.6, 2.2], "om nom", 0.8),
      yunaStep("onigiri-1", 0.4, [1.6, 2.2], "so good ♡", 0.9, "hearts")
    ]
  },
  snack: {
    label: "Snack time 🥬",
    mood: "cozy",
    steps: [
      yunaStep("snack-lettuce-1", 0.6, [2.5, 3.5], "crunch?", 0.85),
      { ...yunaStep("snack-activist", 0.4, [2.2, 2.8], "@activist", 1, null, "sway"), rare: 0.18 },
      yunaStep("snack-crunch", 0.5, [1.8, 2.4], "crunch crunch", 0.7),
      yunaStep("snack-foodcoma", 0.7, [3.5, 5], "so full ♡", 0.6, "zz")
    ]
  },
  mythology: {
    label: "Story time 📚",
    mood: "scholar",
    steps: [
      yunaStep("myth-reading-1", 0.6, [4, 5.5], "@scholar", 0.85, "glyph"),
      yunaStep("myth-reading-2", 0.55, [2.4, 3.2], "oh! 📖", 0.95, "sparkle"),
      yunaStep("myth-reading-1", 0.55, [2.5, 3.5])
    ]
  },
  incense: {
    label: "Light incense 🕯️",
    mood: "chaotic",
    steps: [
      yunaStep("incense-disaster-1", 0.5, [1.5, 2], "ready for inner peace 🕯️", 0.9),
      yunaStep("incense-disaster-1", 0, [2.8, 3.4], "too much... *cough*!!", 1, "smoke", "cough"),
      yunaStep("incense-disaster-2", 0.7, [1.5, 2], "Sniff...", 1),
      yunaStep("incense-disaster-3", 0.6, [2.5, 3], "all good now! ✨", 1, "sparkle")
    ]
  },
  pilates: {
    label: "Try pilates 🤸",
    mood: "clumsy",
    steps: [
      yunaStep("pilates-balance", 0.5, [2, 2.8], "i got this 🤸", 0.95, null, "wobble"),
      yunaStep("pilates-launch", 0.25, [0.7, 0.9], "AAAA", 1, null, "launch"),
      yunaStep("pilates-facedown", 0.35, [2.5, 3], "...did i fly?", 1),
      yunaStep("pilates-facedown", 0, [1.8, 2.2], "@clumsy", 1, "sparkle")
    ]
  },
  rain: {
    label: "Rain walk 🌧️",
    mood: "soggy",
    then: "sleep",
    steps: [
      yunaStep("rain-hopeful", 0.6, [2.5, 3], "rainwalk time 🌂", 0.95, "rain"),
      yunaStep("rain-caught", 0.5, [2.2, 2.8], "wait... AY", 1, "rain", "shiver"),
      yunaStep("rain-defeated", 0.7, [2, 2.6], "drip drip...", 1, "rain"),
      yunaStep("rain-defeated", 0, [2, 2.4], "@soggy", 1),
      yunaStep("rain-recovery", 0.9, [2.5, 3], "warm again...", 1),
      yunaStep("rain-recovery", 0, [2.2, 2.6], "@recovery", 1)
    ]
  },
  meditate: {
    label: "Meditate 🪷",
    mood: "meditating",
    steps: [yunaStep("lotus-1", 0.7, [20, 40], "@meditating", 0.6, "aura", "breathe-slow")]
  },
  nap: {
    label: "Nap 💤",
    mood: "sleepy",
    then: "sleep",
    steps: []
  }
};

// Order of the menu the person sees.
const yunaMenuRituals = ["matcha", "onigiri", "snack", "mythology", "pilates", "incense", "rain", "meditate", "nap"];

function yunaPick(list, random = Math.random) {
  return list[Math.floor(random() * list.length) % list.length];
}

function yunaBetween(range, random = Math.random) {
  const [min, max] = range;
  return min + (max - min) * random();
}

// Resolves "@mood" or "@lines" placeholders to one line.
function yunaResolveWords(say, random = Math.random) {
  if (!say) return null;
  if (Array.isArray(say)) return yunaPick(say, random);
  if (say.startsWith("@")) {
    const key = say.slice(1);
    return yunaPick(yunaMoodWords[key] || yunaLines[key] || ["..."], random);
  }
  return say;
}

function yunaIsLateNight(hour) {
  return hour >= 23 || hour < 5;
}

// The idle ladder (PETBRAIN.md §3), calmer for a web page.
// ctx: { mood, quietSec, hour, reducedMotion, compact, canPerch, lastAt: {name: msAgo} }
// Returns one of: "stay", "whisper", "sleep", "peek", "perch", "float", "walk", or a ritual name.
const yunaLadder = [
  { action: "coffee", quiet: 20, cooldownMin: 90, when: (ctx) => ctx.hour >= 6 && ctx.hour < 11, chance: { sleepy: 0.3, default: 0.12 } },
  { action: "snack", quiet: 36, cooldownMin: 45, chance: { playful: 0.14, cozy: 0.08, sleepy: 0.08, default: 0.05 } },
  { action: "pilates", quiet: 40, cooldownMin: 60, motion: true, chance: { playful: 0.1, floating: 0.05, cozy: 0.05, default: 0.03 } },
  { action: "mythology", quiet: 50, cooldownMin: 70, chance: { meditating: 0.12, dreamy: 0.12, cozy: 0.06, default: 0.03 } },
  { action: "incense", quiet: 44, cooldownMin: 80, chance: { dreamy: 0.1, meditating: 0.1, cozy: 0.05, default: 0.03 } },
  { action: "rain", quiet: 50, cooldownMin: 75, chance: { sleepy: 0.08, dreamy: 0.06, cozy: 0.06, default: 0.03 } },
  { action: "sleep", quiet: 60, cooldownMin: 10, chance: { sleepy: 0.42, default: 0.16 }, lateBoost: 0.2 },
  { action: "peek", quiet: 18, cooldownMin: 4, motion: true, roomy: true, chance: { shy: 0.46, dreamy: 0.3, playful: 0.3, default: 0.18 } },
  { action: "perch", quiet: 60, cooldownMin: 90, motion: true, roomy: true, needsPerch: true, chance: { playful: 0.1, shy: 0.1, cozy: 0.06, dreamy: 0.06, default: 0.03 } },
  { action: "float", quiet: 24, cooldownMin: 6, motion: true, chance: { floating: 0.3, dreamy: 0.18, default: 0.08 } },
  { action: "meditate", quiet: 44, cooldownMin: 12, chance: { meditating: 0.28, dreamy: 0.1, cozy: 0.1, default: 0.06 } },
  { action: "walk", quiet: 16, cooldownMin: 2, motion: true, roomy: true, chance: { playful: 0.22, default: 0.12 } }
];

function yunaNextIdleAction(ctx, random = Math.random) {
  const quiet = Number(ctx.quietSec) || 0;
  const lastAt = ctx.lastAt || {};
  if (quiet < 8) return "stay";

  for (const rung of yunaLadder) {
    if (quiet < rung.quiet) continue;
    if (rung.motion && ctx.reducedMotion) continue;
    if (rung.roomy && ctx.compact) continue;
    if (rung.needsPerch && !ctx.canPerch) continue;
    if (rung.when && !rung.when(ctx)) continue;
    const since = lastAt[rung.action];
    if (since !== undefined && since < rung.cooldownMin * 60000) continue;
    let chance = rung.chance[ctx.mood] ?? rung.chance.default;
    if (rung.lateBoost && yunaIsLateNight(ctx.hour)) chance += rung.lateBoost;
    if (random() < chance) return rung.action;
  }

  return random() < 0.05 ? "whisper" : "stay";
}

// Mood drift (PETBRAIN.md §5): after 10 s of quiet and 16 s since the last shift, 58% chance.
function yunaDriftMood(mood, quietSec, sinceShiftSec, hour, random = Math.random) {
  if (quietSec < 10 || sinceShiftSec < 16 || random() >= 0.58) return mood;
  if (yunaIsLateNight(hour) && random() < 0.4) return "sleepy";
  return yunaPick(yunaAmbientMoods, random);
}

// How Yuna answers the console. Returns { frame, hold, say, effect, ritual, mood } or null.
function yunaReaction(signal, random = Math.random) {
  const type = signal && signal.type;
  if (type === "session-start") {
    const intention = signal.intention;
    if (intention === "map-only" || intention === "looking") {
      return { wave: true, say: "just looking tonight. good.", mood: "meditating", ritual: "meditate" };
    }
    if (intention === "reply-soft") return { wave: true, say: "a small, careful night 🕯", mood: "cozy" };
    return { wave: true, say: "full night. i'll keep you honest ♡", mood: "playful" };
  }
  if (type === "generate") {
    if (signal.limit && signal.count >= signal.limit) {
      return { frame: "sleep-1", hold: [3, 4], say: "that's the limit you chose 🌙", effect: "zz", mood: "sleepy", suggestBreak: true };
    }
    return { frame: "coffee-1", hold: [2, 2.8], say: yunaPick(yunaLines.generate, random), effect: "steam", chance: 0.6 };
  }
  if (type === "limit-pause") {
    return { frame: "lotus-1", hold: [3, 4], say: "pausing is a choice too", mood: "meditating" };
  }
  if (type === "used") {
    return { frame: "hover-1", hold: [1.8, 2.4], say: yunaPick(yunaLines.used, random), effect: "hearts", mood: "cozy" };
  }
  if (type === "scout-copy") {
    return { frame: "peek-1", hold: [1.8, 2.4], say: "carry it to grok 🔭", mood: "playful" };
  }
  if (type === "scout-scored") {
    if (signal.go > 0) {
      return { frame: "myth-reading-2", hold: [2.6, 3.2], say: `oh! 📖 ${signal.go} living room${signal.go === 1 ? "" : "s"}`, effect: "sparkle", mood: "scholar" };
    }
    return { frame: "rain-defeated", hold: [2.6, 3.2], say: "drip drip... no living rooms. skipping is fine", effect: "rain", mood: "soggy" };
  }
  if (type === "late-night") {
    return { frame: "sleep-1", hold: [3, 4], say: yunaPick(yunaLines.late, random), effect: "zz", mood: "sleepy" };
  }
  return null;
}

// Avocado Break: suggest a pause after a stretch of real work.
const YUNA_BREAK_AFTER_MIN = 25;
const YUNA_BREAK_LENGTH_MIN = 5;

function yunaShouldSuggestBreak(activeMinutes, minutesSinceLastSuggestion) {
  return activeMinutes >= YUNA_BREAK_AFTER_MIN && minutesSinceLastSuggestion >= YUNA_BREAK_AFTER_MIN;
}

function yunaFormatCountdown(seconds) {
  const safe = Math.max(0, Math.ceil(Number(seconds) || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}
