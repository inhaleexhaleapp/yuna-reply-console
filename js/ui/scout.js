// Grok Scout tab: copy a prompt for Grok, paste its answer back, rank the rooms.
// The console never talks to Grok or X. It writes to the clipboard and opens links.

const scoutStorageKey = "yunaScoutState";
const scoutRoomSelect = document.getElementById("scoutRoomSelect");
const scoutWindowSelect = document.getElementById("scoutWindowSelect");
const scoutCountSelect = document.getElementById("scoutCountSelect");
const scoutFocusInput = document.getElementById("scoutFocusInput");
const scoutCopyPromptBtn = document.getElementById("scoutCopyPromptBtn");
const scoutOpenGrokBtn = document.getElementById("scoutOpenGrokBtn");
const scoutAnswerInput = document.getElementById("scoutAnswerInput");
const scoutAnswerCount = document.getElementById("scoutAnswerCount");
const scoutScoreBtn = document.getElementById("scoutScoreBtn");
const scoutClearBtn = document.getElementById("scoutClearBtn");
const scoutStatus = document.getElementById("scoutStatus");
const scoutBoard = document.getElementById("scoutBoard");

const scoutRoomInputs = {
  wellness: () => document.getElementById("tweetInput"),
  founder: () => document.getElementById("founderTweetInput"),
  music: () => document.getElementById("musicTweetInput")
};

const scoutState = readScoutState();

function readScoutState() {
  const fallback = { room: "wellness", hours: "24", count: "8", focus: "", board: [], drafted: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(scoutStorageKey) || "null");
    return parsed && typeof parsed === "object" ? { ...fallback, ...parsed } : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeScoutStorage() {
  try {
    scoutState.board = scoutState.board.slice(0, 30);
    scoutState.drafted = scoutState.drafted.slice(0, 120);
    localStorage.setItem(scoutStorageKey, JSON.stringify(scoutState));
  } catch (error) {
    // storage can be unavailable in private windows; the tab still works in memory
  }
}

function setScoutStatus(message) {
  scoutStatus.textContent = message;
}

function scoutDecisionPill(decision) {
  if (decision === "go") return '<span class="pill safe">🌙 go</span>';
  if (decision === "maybe") return '<span class="pill">👀 maybe</span>';
  return '<span class="pill warn">skip</span>';
}

function scoutFollowers(value) {
  if (value === null || value === undefined) return null;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
  if (value >= 10000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(value);
}

function scoutMetric(label, value) {
  return value === null || value === undefined ? "" : `<span class="pill">${escapeHtml(label)} ${escapeHtml(value)}</span>`;
}

function scoutCard(post, index) {
  const drafted = scoutState.drafted.includes(post.link);
  const age = post.hoursAgo === null ? null : post.hoursAgo < 1 ? `${Math.round(post.hoursAgo * 60)}m` : `${Math.round(post.hoursAgo)}h`;
  return `
    <article class="reply-card scout-card scout-${escapeHtml(post.decision)}">
      <div class="scout-card-head">
        <span class="scout-score" title="worthiness ${post.parts.worthiness} · freshness ${post.parts.freshness} · open room ${post.parts.openRoom} · reach ${post.parts.reach}">${post.score}</span>
        <div>
          <strong>${escapeHtml(post.handle)}</strong>
          <div class="reply-meta">
            ${scoutDecisionPill(post.decision)}
            ${scoutMetric("followers", scoutFollowers(post.followers))}
            ${scoutMetric("replies", post.replies)}
            ${scoutMetric("", age)}
          </div>
        </div>
      </div>
      <p class="reply-text">${escapeHtml(post.text)}</p>
      <div class="reply-meta">
        ${post.reasons.map((reason) => `<span class="pill${/promo|crowded|cold/.test(reason) ? " warn" : ""}">${escapeHtml(reason)}</span>`).join("")}
        ${post.anchors.length ? `<span class="pill" title="details Yuna will echo">anchors: ${escapeHtml(post.anchors.join(", "))}</span>` : ""}
        <span class="pill" title="suggested approach">${escapeHtml(post.approach)}</span>
        ${drafted ? '<span class="pill safe">drafted</span>' : ""}
      </div>
      <div class="reply-actions">
        <button class="small" type="button" data-scout-action="open" data-index="${index}">Open post</button>
        <button class="small" type="button" data-scout-action="draft" data-index="${index}">Draft here → ${escapeHtml(scoutRooms[post.room].label)}</button>
        <button class="small ghost" type="button" data-scout-action="dismiss" data-index="${index}">Dismiss</button>
      </div>
    </article>
  `;
}

function renderScoutBoard() {
  scoutBoard.innerHTML = scoutState.board.length
    ? scoutState.board.map(scoutCard).join("")
    : '<p class="empty">No rooms yet. Copy the prompt, ask Grok, paste the answer on the left. The best rooms land here, scored on your device.</p>';
}

function updateScoutAnswerCount() {
  const found = parseScoutLines(scoutAnswerInput.value).length;
  scoutAnswerCount.textContent = `${found} post${found === 1 ? "" : "s"} found`;
}

function scoreScoutAnswer() {
  const posts = parseScoutLines(scoutAnswerInput.value);
  if (!posts.length) {
    setScoutStatus("No posts found. Each line needs @handle | numbers | the x.com link | the post text.");
    return;
  }
  scoutState.board = rankScoutPosts(posts, scoutState.room);
  writeScoutStorage();
  renderScoutBoard();
  const go = scoutState.board.filter((post) => post.decision === "go").length;
  setScoutStatus(`${posts.length} rooms scored · ${go} worth entering. Skipping the rest is a valid choice.`);
  yunaSignal("scout-scored", { go, total: posts.length });
}

function draftScoutPost(post) {
  const input = scoutRoomInputs[post.room] && scoutRoomInputs[post.room]();
  if (!input) return;
  input.value = post.text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  if (!scoutState.drafted.includes(post.link)) scoutState.drafted.unshift(post.link);
  writeScoutStorage();
  renderScoutBoard();
  switchToTab(scoutRooms[post.room].tab);
  input.focus();
}

function initScoutTab() {
  scoutRoomSelect.innerHTML = Object.entries(scoutRooms)
    .map(([key, room]) => `<option value="${escapeHtml(key)}">${escapeHtml(room.label)}</option>`)
    .join("");
  scoutRoomSelect.value = scoutRooms[scoutState.room] ? scoutState.room : "wellness";
  scoutWindowSelect.value = String(scoutState.hours);
  scoutCountSelect.value = String(scoutState.count);
  scoutFocusInput.value = scoutState.focus || "";
  scoutFocusInput.placeholder = `e.g. ${scoutRooms[scoutRoomSelect.value].defaultFocus}`;

  scoutRoomSelect.addEventListener("change", () => {
    scoutState.room = scoutRoomSelect.value;
    scoutFocusInput.placeholder = `e.g. ${scoutRooms[scoutState.room].defaultFocus}`;
    writeScoutStorage();
  });
  scoutWindowSelect.addEventListener("change", () => {
    scoutState.hours = scoutWindowSelect.value;
    writeScoutStorage();
  });
  scoutCountSelect.addEventListener("change", () => {
    scoutState.count = scoutCountSelect.value;
    writeScoutStorage();
  });
  scoutFocusInput.addEventListener("change", () => {
    scoutState.focus = scoutFocusInput.value.trim();
    writeScoutStorage();
  });

  scoutCopyPromptBtn.addEventListener("click", async () => {
    await copyText(buildGrokScoutPrompt(scoutState.room, {
      count: scoutState.count,
      hours: scoutState.hours,
      focus: scoutFocusInput.value
    }));
    setScoutStatus("Grok prompt copied. Open Grok, paste it, then bring the answer back here.");
    yunaSignal("scout-copy");
  });
  scoutOpenGrokBtn.addEventListener("click", () => {
    window.open("https://x.com/i/grok", "_blank", "noopener,noreferrer");
    setScoutStatus("Opened Grok in a new tab. Paste the prompt there yourself.");
  });

  scoutAnswerInput.addEventListener("input", updateScoutAnswerCount);
  scoutAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      scoreScoutAnswer();
    }
  });
  scoutScoreBtn.addEventListener("click", scoreScoutAnswer);
  scoutClearBtn.addEventListener("click", () => {
    scoutState.board = [];
    scoutAnswerInput.value = "";
    updateScoutAnswerCount();
    writeScoutStorage();
    renderScoutBoard();
    setScoutStatus("Board cleared.");
  });

  scoutBoard.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-scout-action]");
    if (!button) return;
    const index = Number(button.dataset.index);
    const post = scoutState.board[index];
    if (!post) return;

    if (button.dataset.scoutAction === "open") {
      if (/^https:\/\/(x|twitter)\.com\//i.test(post.link)) {
        window.open(post.link, "_blank", "noopener,noreferrer");
      } else {
        setScoutStatus("That link isn't an x.com link, so Yuna won't open it. Check it in Grok first.");
      }
    }
    if (button.dataset.scoutAction === "draft") {
      draftScoutPost(post);
    }
    if (button.dataset.scoutAction === "dismiss") {
      scoutState.board.splice(index, 1);
      writeScoutStorage();
      renderScoutBoard();
    }
  });

  renderScoutBoard();
}
