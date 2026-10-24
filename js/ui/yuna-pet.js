// YunaPet in the browser: a small companion who lives in the corner of the console.
// Drawing, timing and interaction live here; decisions come from js/engine/yuna-brain.js.
// Everything is local: frames are files in assets/yuna/, state is one localStorage key.

const yunaPetStorageKey = "yunaPetState";

const yunaPet = {
  root: null,
  body: null,
  frames: [],
  front: 0,
  fx: null,
  bubble: null,
  menu: null,
  menuButton: null,
  summon: null,
  generation: 0,
  activity: "idle",
  mood: "cozy",
  moodShiftedAt: Date.now(),
  lastUserActivity: Date.now(),
  activeMinutes: 0,
  speechAt: 0,
  tickTimer: null,
  breakTimer: null,
  reducedMotion: false,
  state: { hidden: false, x: null, y: null, lastAt: {}, lastBreakOfferAt: 0 }
};

function readYunaPetState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(yunaPetStorageKey) || "null");
    if (parsed && typeof parsed === "object") Object.assign(yunaPet.state, parsed);
  } catch (error) {
    // private windows can refuse storage; Yuna still lives in memory
  }
}

function writeYunaPetState() {
  try {
    localStorage.setItem(yunaPetStorageKey, JSON.stringify(yunaPet.state));
  } catch (error) {
    // ignore
  }
}

function yunaWait(seconds, generation) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generation === yunaPet.generation), Math.max(0, seconds) * 1000);
  });
}

function yunaFrameUrl(name) {
  return `assets/yuna/${name}.webp`;
}

function yunaSize() {
  const rect = yunaPet.root.getBoundingClientRect();
  return { w: rect.width || 140, h: rect.height || 210 };
}

function yunaIsCompact() {
  return window.innerWidth < 720;
}

// ---------- position ----------

function yunaHome() {
  const { w, h } = yunaSize();
  const x = yunaPet.state.x ?? window.innerWidth - w - 18;
  const y = yunaPet.state.y ?? window.innerHeight - h - 8;
  return yunaClamp(x, y);
}

function yunaClamp(x, y) {
  const { w, h } = yunaSize();
  return {
    x: Math.min(Math.max(4, x), Math.max(4, window.innerWidth - w - 4)),
    y: Math.min(Math.max(4, y), Math.max(4, window.innerHeight - h - 4))
  };
}

function yunaMoveTo(x, y, seconds = 0, easing = "ease-in-out") {
  const point = yunaClamp(x, y);
  yunaPet.root.style.transition = seconds > 0 ? `left ${seconds}s ${easing}, top ${seconds}s ${easing}` : "none";
  yunaPet.root.style.left = `${point.x}px`;
  yunaPet.root.style.top = `${point.y}px`;
  return point;
}

function yunaGoHome(seconds = 0) {
  const home = yunaHome();
  yunaMoveTo(home.x, home.y, seconds);
}

// ---------- drawing ----------

function yunaShow(frame, fade = 0.4) {
  const next = yunaPet.frames[1 - yunaPet.front];
  const current = yunaPet.frames[yunaPet.front];
  const url = yunaFrameUrl(frame);
  if (current.dataset.frame === frame) return;
  const duration = yunaPet.reducedMotion ? 0 : fade;
  next.style.transitionDuration = `${duration}s`;
  current.style.transitionDuration = `${duration}s`;
  next.src = url;
  next.dataset.frame = frame;
  next.classList.add("is-front");
  current.classList.remove("is-front");
  yunaPet.front = 1 - yunaPet.front;
}

function yunaPose(pose) {
  yunaPet.body.className = "yuna-pet-body";
  if (pose && !yunaPet.reducedMotion) yunaPet.body.classList.add(`pose-${pose}`);
}

function yunaFace(direction) {
  yunaPet.root.classList.toggle("is-flipped", direction < 0);
}

function yunaEffect(effect) {
  yunaPet.fx.innerHTML = "";
  if (!effect || yunaPet.reducedMotion) return;
  const glyphs = {
    hearts: ["♡", "♡", "♡"],
    sparkle: ["✦", "✧", "✦"],
    zz: ["z", "Z", "z"],
    steam: ["~", "~"],
    smoke: ["☁", "☁", "☁"],
    rain: ["⋮", "⋮", "⋮", "⋮"],
    glyph: ["ᚱ", "ᛟ", "ᚨ"],
    aura: ["◌"]
  }[effect] || [];
  glyphs.forEach((glyph, index) => {
    const span = document.createElement("span");
    span.className = `yuna-fx-bit fx-${effect}`;
    span.textContent = glyph;
    span.style.setProperty("--i", index);
    yunaPet.fx.appendChild(span);
  });
}

function yunaSay(text, seconds = 2.2, options = {}) {
  if (!text) return;
  const now = Date.now();
  if (!options.force && now - yunaPet.speechAt < 12000) return;
  yunaPet.speechAt = now;
  yunaPet.bubble.textContent = text;
  yunaPet.bubble.classList.add("is-visible");
  clearTimeout(yunaPet.bubbleTimer);
  yunaPet.bubbleTimer = setTimeout(() => {
    yunaPet.bubble.classList.remove("is-visible");
  }, seconds * 1000);
}

function yunaClearBubble() {
  clearTimeout(yunaPet.bubbleTimer);
  yunaPet.bubble.classList.remove("is-visible", "is-interactive");
  yunaPet.bubble.innerHTML = "";
}

// ---------- activities ----------

function yunaBegin(activity) {
  yunaPet.generation += 1;
  yunaPet.activity = activity;
  yunaPet.root.dataset.activity = activity;
  yunaPose(null);
  yunaEffect(null);
  return yunaPet.generation;
}

function yunaIdle(fade = 0.6) {
  yunaBegin("idle");
  yunaShow("welcome", fade);
  yunaPose("breathe");
  yunaScheduleTick();
}

function yunaMark(action) {
  yunaPet.state.lastAt[action] = Date.now();
  writeYunaPetState();
}

async function yunaRunRitual(name, options = {}) {
  const ritual = yunaRituals[name];
  if (!ritual || yunaPet.activity === "break") return;
  const generation = yunaBegin(`ritual:${name}`);
  yunaGoHome(0.6);
  yunaMark(name);
  if (ritual.mood) yunaPet.mood = ritual.mood;

  for (const step of ritual.steps) {
    if (step.rare !== undefined && Math.random() >= step.rare * (options.manual ? 1.5 : 1)) continue;
    yunaShow(step.frame, step.fade);
    yunaPose(step.pose);
    yunaEffect(step.effect);
    if (step.say && Math.random() < step.chance) {
      yunaSay(yunaResolveWords(step.say), Math.min(2.6, step.hold[1]), { force: true });
    }
    if (!(await yunaWait(step.fade + yunaBetween(step.hold), generation))) return;
  }

  if (ritual.then === "sleep") {
    yunaSleep();
    return;
  }
  yunaEffect("sparkle");
  if (!(await yunaWait(0.6, generation))) return;
  yunaIdle(0.7);
}

function yunaSleep() {
  yunaBegin("sleep");
  yunaGoHome(0.6);
  yunaMark("sleep");
  yunaShow("sleep-1", 0.45);
  yunaPose("breathe-slow");
  yunaEffect("zz");
}

async function yunaWave() {
  const generation = yunaBegin("wave");
  for (const frame of ["wave-1", "wave-2", "wave-1", "wave-2"]) {
    yunaShow(frame, 0);
    if (!(await yunaWait(yunaBetween([0.36, 0.52]), generation))) return;
  }
  yunaIdle(0.3);
}

async function yunaPeek() {
  const generation = yunaBegin("peek");
  yunaMark("peek");
  const { w } = yunaSize();
  const home = yunaHome();
  yunaShow("peek-1", 0.3);
  yunaMoveTo(window.innerWidth - w * 0.55, home.y, 1.35);
  if (!(await yunaWait(1.4, generation))) return;
  if (Math.random() < 0.42) yunaSay(yunaPick(yunaLines.peekaboo), 2, { force: true });
  if (!(await yunaWait(yunaBetween([3.2, 5.4]), generation))) return;
  yunaGoHome(0.85);
  if (!(await yunaWait(0.9, generation))) return;
  yunaIdle(0.4);
}

async function yunaWalk() {
  const generation = yunaBegin("walk");
  yunaMark("walk");
  const start = yunaHome();
  const direction = Math.random() < 0.5 ? -1 : 1;
  const target = yunaClamp(start.x + direction * yunaBetween([50, 130]), start.y);
  const distance = Math.abs(target.x - start.x);
  if (distance < 20) return yunaIdle();
  const seconds = Math.min(10, Math.max(2, distance / 38));
  yunaFace(target.x < start.x ? -1 : 1);
  yunaMoveTo(target.x, target.y, seconds, "linear");
  yunaPose("bounce");
  const endAt = Date.now() + seconds * 1000;
  let index = 0;
  while (Date.now() < endAt) {
    yunaShow(`walk-${(index % 4) + 1}`, 0);
    index += 1;
    if (!(await yunaWait(yunaBetween([0.36, 0.54]), generation))) return;
  }
  yunaFace(1);
  yunaPet.state.x = target.x;
  yunaPet.state.y = target.y;
  writeYunaPetState();
  yunaIdle(0.5);
}

async function yunaFloat() {
  const generation = yunaBegin("float");
  yunaMark("float");
  yunaShow("float-1", 0.75);
  yunaPose("float");
  if (Math.random() < 0.3) yunaSay(yunaPick(yunaMoodWords.floating), 2.4);
  if (!(await yunaWait(yunaBetween([13, 24]), generation))) return;
  yunaIdle(0.75);
}

function yunaPerchTarget() {
  const bar = document.querySelector(".top-tabs");
  if (!bar) return null;
  const rect = bar.getBoundingClientRect();
  const { h } = yunaSize();
  if (rect.top < h * 0.85 || rect.top > window.innerHeight - 40) return null;
  return { x: rect.right - 150, y: rect.top - h * 0.82 };
}

async function yunaPerch() {
  const target = yunaPerchTarget();
  if (!target) return yunaIdle();
  const generation = yunaBegin("perch");
  yunaMark("perch");
  yunaShow("window-sit", 0.5);
  yunaMoveTo(target.x, target.y, 1.4);
  if (!(await yunaWait(1.5, generation))) return;
  yunaPose("swing");
  if (Math.random() < 0.85) yunaSay(yunaPick(yunaLines.perch), 2.2, { force: true });
  if (!(await yunaWait(yunaBetween([4, 7]), generation))) return;
  yunaShow("drag-1", 0.2);
  yunaPose("flail");
  yunaSay(yunaPick(yunaLines.fall), 1.8, { force: true });
  const home = yunaHome();
  yunaMoveTo(home.x, home.y, 0.85, "cubic-bezier(.55,0,1,.45)");
  if (!(await yunaWait(yunaBetween([1.9, 2.3]), generation))) return;
  yunaIdle(0.5);
}

async function yunaReact(signal) {
  const reaction = yunaReaction(signal);
  if (!reaction || yunaPet.state.hidden || yunaPet.activity === "break") return;
  if (reaction.chance !== undefined && Math.random() >= reaction.chance) return;
  if (reaction.mood) {
    yunaPet.mood = reaction.mood;
    yunaPet.moodShiftedAt = Date.now();
  }
  if (reaction.wave) {
    yunaSay(reaction.say, 2.6, { force: true });
    await yunaWave();
    if (reaction.ritual) setTimeout(() => yunaPet.activity === "idle" && yunaRunRitual(reaction.ritual), 1500);
    return;
  }
  const generation = yunaBegin("react");
  yunaGoHome(0.5);
  yunaShow(reaction.frame, 0.35);
  yunaEffect(reaction.effect);
  yunaSay(reaction.say, Math.min(3, reaction.hold[1]), { force: true });
  if (!(await yunaWait(yunaBetween(reaction.hold), generation))) return;
  if (reaction.suggestBreak) {
    yunaOfferBreak(true);
    return;
  }
  yunaIdle(0.6);
}

// ---------- avocado break ----------

function yunaOfferBreak(force = false) {
  if (yunaPet.state.hidden || yunaPet.activity === "break") return;
  const minutesSince = (Date.now() - (yunaPet.state.lastBreakOfferAt || 0)) / 60000;
  if (!force && !yunaShouldSuggestBreak(yunaPet.activeMinutes, minutesSince)) return;
  yunaPet.state.lastBreakOfferAt = Date.now();
  writeYunaPetState();
  yunaBegin("offer");
  yunaGoHome(0.5);
  yunaShow("coffee-0", 0.5);
  clearTimeout(yunaPet.bubbleTimer);
  yunaPet.bubble.innerHTML = `
    <span>avocado break? 🥑 ${YUNA_BREAK_LENGTH_MIN} min</span>
    <span class="yuna-bubble-actions">
      <button type="button" data-yuna-break="start">take ${YUNA_BREAK_LENGTH_MIN}</button>
      <button type="button" data-yuna-break="later">later</button>
    </span>`;
  yunaPet.bubble.classList.add("is-visible", "is-interactive");
  const generation = yunaPet.generation;
  setTimeout(() => {
    if (generation !== yunaPet.generation || yunaPet.activity !== "offer") return;
    yunaClearBubble();
    yunaIdle(0.5);
  }, 45000);
}

function yunaStartBreak() {
  const generation = yunaBegin("break");
  yunaPet.activeMinutes = 0;
  yunaGoHome(0.5);
  yunaShow("break-1", 0.45);
  yunaPose("breathe-slow");
  const endsAt = Date.now() + YUNA_BREAK_LENGTH_MIN * 60000;
  yunaPet.bubble.classList.add("is-visible", "is-interactive");
  const render = () => {
    if (generation !== yunaPet.generation) return;
    const left = (endsAt - Date.now()) / 1000;
    if (left <= 0) {
      yunaFinishBreak(generation);
      return;
    }
    yunaPet.bubble.innerHTML = `
      <span class="yuna-countdown">🥑 ${yunaFormatCountdown(left)}</span>
      <span>Breathe. Stretch. Look at something far.</span>
      <span class="yuna-bubble-actions"><button type="button" data-yuna-break="end">end break</button></span>`;
    yunaPet.breakTimer = setTimeout(render, 1000);
  };
  render();
}

async function yunaFinishBreak(generation) {
  clearTimeout(yunaPet.breakTimer);
  yunaPet.bubble.classList.remove("is-interactive");
  yunaClearBubble();
  yunaEffect("sparkle");
  yunaSay("break finished 🌙", 1.6, { force: true });
  if (!(await yunaWait(1.8, generation))) return;
  yunaSay("welcome back ☁️", 1.8, { force: true });
  if (!(await yunaWait(1.9, generation))) return;
  yunaPet.activity = "idle";
  yunaRunRitual("sip");
}

// ---------- idle clock ----------

function yunaScheduleTick() {
  clearTimeout(yunaPet.tickTimer);
  yunaPet.tickTimer = setTimeout(yunaTick, yunaBetween([6, 10]) * 1000);
}

function yunaTick() {
  if (yunaPet.state.hidden || yunaPet.activity !== "idle") return;
  if (document.hidden) return yunaScheduleTick();
  const now = Date.now();
  const quietSec = (now - yunaPet.lastUserActivity) / 1000;
  const hour = new Date().getHours();
  yunaPet.mood = yunaDriftMood(yunaPet.mood, quietSec, (now - yunaPet.moodShiftedAt) / 1000, hour);
  if (yunaPet.mood !== yunaPet.root.dataset.mood) {
    yunaPet.moodShiftedAt = now;
    yunaPet.root.dataset.mood = yunaPet.mood;
  }
  const lastAt = Object.fromEntries(Object.entries(yunaPet.state.lastAt || {}).map(([key, at]) => [key, now - at]));
  const action = yunaNextIdleAction({
    mood: yunaPet.mood,
    quietSec,
    hour,
    reducedMotion: yunaPet.reducedMotion,
    compact: yunaIsCompact(),
    canPerch: Boolean(yunaPerchTarget()),
    lastAt
  });

  if (action === "stay") return yunaScheduleTick();
  if (action === "whisper") {
    yunaSay(yunaPick(yunaMoodWords[yunaPet.mood] || yunaMoodWords.cozy), 2.2);
    return yunaScheduleTick();
  }
  if (action === "sleep") return yunaSleep();
  if (action === "peek") return yunaPeek();
  if (action === "walk") return yunaWalk();
  if (action === "float") return yunaFloat();
  if (action === "perch") return yunaPerch();
  return yunaRunRitual(action);
}

// ---------- menu ----------

function yunaRenderMenu() {
  const items = yunaMenuRituals.map((name) => `<button type="button" role="menuitem" data-yuna-menu="${name}">${escapeHtml(yunaRituals[name].label)}</button>`);
  items.push('<button type="button" role="menuitem" data-yuna-menu="break">Avocado break 🥑</button>');
  items.push('<button type="button" role="menuitem" data-yuna-menu="hide">Hide Yuna</button>');
  yunaPet.menu.innerHTML = items.join("");
}

function yunaToggleMenu(open) {
  const show = open ?? yunaPet.menu.hidden;
  yunaPet.menu.hidden = !show;
  yunaPet.menuButton.setAttribute("aria-expanded", String(show));
  if (show) {
    const rect = yunaPet.root.getBoundingClientRect();
    yunaPet.menu.classList.toggle("opens-right", rect.left < 220);
    yunaPet.menu.classList.toggle("opens-down", rect.top < 360);
    yunaPet.menu.querySelector("button")?.focus();
  }
}

function yunaSetHidden(hidden) {
  yunaPet.state.hidden = hidden;
  writeYunaPetState();
  yunaPet.root.hidden = hidden;
  yunaPet.summon.hidden = !hidden;
  if (hidden) {
    yunaBegin("hidden");
    clearTimeout(yunaPet.tickTimer);
    clearTimeout(yunaPet.breakTimer);
  } else {
    yunaGoHome();
    yunaSay("hi hi", 1.8, { force: true });
    yunaWave();
  }
}

// ---------- interaction ----------

function yunaBindPointer() {
  let start = null;
  let dragging = false;
  let offset = { x: 0, y: 0 };

  yunaPet.body.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const rect = yunaPet.root.getBoundingClientRect();
    start = { x: event.clientX, y: event.clientY };
    offset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    dragging = false;
    yunaPet.body.setPointerCapture(event.pointerId);
  });

  yunaPet.body.addEventListener("pointermove", (event) => {
    if (!start || yunaPet.activity === "break") return;
    if (!dragging && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4) {
      dragging = true;
      yunaBegin("drag");
      yunaClearBubble();
      yunaPet.mood = "shy";
      yunaShow("dragging", 0.15);
      yunaPose("dangle");
    }
    if (dragging) yunaMoveTo(event.clientX - offset.x, event.clientY - offset.y);
  });

  yunaPet.body.addEventListener("pointerup", () => {
    if (!start) return;
    start = null;
    if (dragging) {
      dragging = false;
      const rect = yunaPet.root.getBoundingClientRect();
      yunaPet.state.x = rect.left;
      yunaPet.state.y = rect.top;
      writeYunaPetState();
      yunaPet.mood = "cozy";
      yunaIdle(0.4);
      return;
    }
    if (yunaPet.activity === "break") return;
    if (yunaPet.activity === "sleep") {
      yunaIdle(0.5);
      return;
    }
    yunaPet.mood = "playful";
    if (Math.random() < 0.46) yunaSay(yunaPick(yunaMoodWords.playful), 1.8, { force: true });
    yunaGoHome(0.4);
    yunaWave();
  });

  yunaPet.body.addEventListener("dblclick", () => {
    if (yunaPet.activity === "break") return;
    yunaSay("♡", 2, { force: true });
    yunaEffect("hearts");
  });

  yunaPet.body.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" || yunaPet.activity !== "idle") return;
    yunaBegin("hover");
    yunaShow("hover-1", 0.25);
    if (Math.random() < 0.28) yunaSay(yunaPick(yunaMoodWords[yunaPet.mood] || yunaMoodWords.cozy), 1.8);
  });

  yunaPet.body.addEventListener("pointerleave", () => {
    if (yunaPet.activity === "hover") yunaIdle(0.4);
  });

  yunaPet.body.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    yunaToggleMenu(true);
  });
}

function yunaBindControls() {
  yunaPet.menuButton.addEventListener("click", () => yunaToggleMenu());
  yunaPet.menu.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-yuna-menu]");
    if (!button) return;
    const action = button.dataset.yunaMenu;
    yunaToggleMenu(false);
    if (action === "hide") return yunaSetHidden(true);
    if (action === "break") return yunaStartBreak();
    if (action === "nap") return yunaSleep();
    yunaRunRitual(action, { manual: true });
  });
  yunaPet.menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      yunaToggleMenu(false);
      yunaPet.menuButton.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!yunaPet.menu.hidden && !yunaPet.root.contains(event.target)) yunaToggleMenu(false);
  });
  yunaPet.bubble.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-yuna-break]");
    if (!button) return;
    const action = button.dataset.yunaBreak;
    yunaPet.bubble.classList.remove("is-interactive");
    if (action === "start") return yunaStartBreak();
    if (action === "end") return yunaFinishBreak(yunaPet.generation);
    yunaClearBubble();
    yunaSay("okay. i'll ask again later ☁️", 2, { force: true });
    yunaIdle(0.5);
  });
  yunaPet.summon.addEventListener("click", () => yunaSetHidden(false));
}

function yunaTrackActivity() {
  const mark = (event) => {
    if (yunaPet.root.contains(event.target)) return;
    yunaPet.lastUserActivity = Date.now();
    if (yunaPet.activity === "sleep" || yunaPet.activity === "float" || yunaPet.activity === "peek") return;
    // Yuna steps out of the way when you start working.
    if (yunaPet.activity.startsWith("ritual:") && event.type === "keydown") yunaIdle(0.6);
  };
  ["pointerdown", "keydown", "wheel"].forEach((type) => document.addEventListener(type, mark, { passive: true }));

  setInterval(() => {
    if (document.hidden) return;
    if (Date.now() - yunaPet.lastUserActivity < 120000) yunaPet.activeMinutes += 1;
    yunaOfferBreak();
  }, 60000);

  window.addEventListener("resize", () => {
    if (["idle", "sleep", "hover"].includes(yunaPet.activity)) yunaGoHome();
    yunaPet.root.classList.toggle("is-compact", yunaIsCompact());
  });

  document.addEventListener("yuna:signal", (event) => yunaReact(event.detail || {}));
}

// ---------- startup ----------

function initYunaPet() {
  readYunaPetState();
  const motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  yunaPet.reducedMotion = Boolean(motionQuery && motionQuery.matches);

  const root = document.createElement("div");
  root.className = "yuna-pet";
  root.id = "yunaPet";
  root.innerHTML = `
    <p class="yuna-bubble" aria-live="polite"></p>
    <div class="yuna-pet-body" title="Yuna · click to wave, drag to move, right-click for her menu">
      <img class="yuna-frame is-front" alt="" draggable="false" />
      <img class="yuna-frame" alt="" draggable="false" />
      <div class="yuna-fx" aria-hidden="true"></div>
    </div>
    <button class="yuna-menu-button" type="button" aria-label="Yuna's menu" aria-haspopup="menu" aria-expanded="false">⋯</button>
    <div class="yuna-menu" role="menu" aria-label="Yuna" hidden></div>
  `;
  const summon = document.createElement("button");
  summon.className = "yuna-summon";
  summon.type = "button";
  summon.textContent = "🌸 Yuna";
  summon.title = "Bring Yuna back";
  document.body.append(root, summon);

  Object.assign(yunaPet, {
    root,
    summon,
    body: root.querySelector(".yuna-pet-body"),
    frames: [...root.querySelectorAll(".yuna-frame")],
    fx: root.querySelector(".yuna-fx"),
    bubble: root.querySelector(".yuna-bubble"),
    menu: root.querySelector(".yuna-menu"),
    menuButton: root.querySelector(".yuna-menu-button")
  });
  root.classList.toggle("is-compact", yunaIsCompact());
  root.classList.toggle("is-still", yunaPet.reducedMotion);

  yunaRenderMenu();
  yunaBindPointer();
  yunaBindControls();
  yunaTrackActivity();

  const hour = new Date().getHours();
  yunaPet.mood = yunaIsLateNight(hour) ? "sleepy" : "cozy";
  yunaPet.frames[0].src = yunaFrameUrl("welcome");
  yunaPet.frames[0].dataset.frame = "welcome";
  yunaGoHome();

  if (yunaPet.state.hidden) {
    root.hidden = true;
    summon.hidden = false;
    return;
  }
  summon.hidden = true;
  yunaIdle(0);
  if (yunaIsLateNight(hour)) setTimeout(() => yunaReact({ type: "late-night" }), 15000);
}
