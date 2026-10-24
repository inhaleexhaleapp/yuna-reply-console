// Grok Scout: an API-free round trip with Grok.
// Yuna writes a prompt, you paste it into Grok yourself (Grok can see live X),
// then you paste Grok's answer back and Yuna scores every room locally.
// Nothing is sent anywhere by the console: it only writes to your clipboard.

const scoutRooms = {
  wellness: {
    label: "Wellness / Yuna",
    tab: "wellnessPanel",
    category: "soft internet",
    scope: "wellness",
    hunt: "people talking honestly about sleep, overthinking, burnout, meditation, breathwork, ambient or rain sounds, or needing calm",
    defaultFocus: "sleep sounds, overthinking at night, ambient for focus"
  },
  founder: {
    label: "Indie Founder",
    tab: "founderPanel",
    category: "solo founder",
    scope: "founder",
    hunt: "solo and indie founders building in public: shipping updates, first users, app store pain, launch nerves, late-night building, honest lessons",
    defaultFocus: "solo founders, flutter / mobile apps, first users, app store review"
  },
  music: {
    label: "Music / Sound",
    tab: "musicPanel",
    category: "game dev wip",
    scope: "wellness",
    hunt: "indie game devs sharing WIPs (#ScreenshotSaturday, #gamedev), composers and ambient producers sharing work or looking for music",
    defaultFocus: "indie game wips that need atmosphere, composer calls, ambient / drone producers"
  }
};

const scoutWindows = { 6: "the last 6 hours", 24: "the last 24 hours", 48: "the last 48 hours" };

const SCOUT_LINE_FORMAT = "@handle | followers | likes | replies | hours ago | post link | post text";

function buildGrokScoutPrompt(roomKey, options = {}) {
  const room = scoutRooms[roomKey] || scoutRooms.wellness;
  const count = [5, 8, 12].includes(Number(options.count)) ? Number(options.count) : 8;
  const windowLabel = scoutWindows[options.hours] || scoutWindows[24];
  const focus = String(options.focus || "").trim() || room.defaultFocus;

  return [
    `find ${count} recent posts on X worth a thoughtful human reply.`,
    "",
    `who: ${room.hunt}.`,
    `focus: ${focus}.`,
    `when: posted in ${windowLabel}.`,
    "",
    "pick posts that are:",
    "- from real people with roughly 300 to 60k followers",
    "- still open: under ~40 replies, ideally the author is replying to people",
    "- personal, a real question, or a lesson, not an announcement",
    "",
    "skip: giveaways, engagement bait (\"drop your link\", \"follow for follow\"), ads, crypto, politics, rage bait, bot-looking accounts, and threads that are already huge.",
    "",
    "output format, one post per line, exactly this, nothing else:",
    SCOUT_LINE_FORMAT,
    "",
    "rules for the output:",
    "- followers, likes and replies as numbers (1.2k is fine)",
    "- hours ago as a number like 3h",
    "- the full https://x.com/.../status/... link",
    "- post text copied as written, max 280 characters, on one line",
    "- no intro, no numbering, no commentary, no markdown table"
  ].join("\n");
}

function parseScoutNumber(value) {
  const raw = String(value || "").toLowerCase().replace(/[~≈+*]/g, "").trim();
  const match = raw.match(/(\d[\d,]*(?:\.\d+)?)\s*([km])?/);
  if (!match) return null;
  const base = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(base)) return null;
  const multiplier = match[2] === "m" ? 1000000 : match[2] === "k" ? 1000 : 1;
  return Math.round(base * multiplier);
}

function parseScoutHours(value) {
  const raw = String(value || "").toLowerCase().trim();
  const match = raw.match(/(\d+(?:\.\d+)?)\s*(m|min|mins|minutes?|h|hr|hrs|hours?|d|days?)?\b/);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2] || "h";
  if (/^m/.test(unit)) return Math.round((amount / 60) * 10) / 10;
  if (/^d/.test(unit)) return amount * 24;
  return amount;
}

function cleanScoutCell(value) {
  return String(value || "").replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function parseScoutLines(raw) {
  const posts = [];
  const seen = new Set();

  String(raw || "").split(/\n+/).forEach((sourceLine) => {
    // Accept bullets, numbering and markdown-table pipes around the line.
    const line = sourceLine.trim().replace(/^(\d+[.)]|[-*•])\s+/, "").replace(/^\|/, "").replace(/\|$/, "").trim();
    if (!/@[A-Za-z0-9_]{1,15}/.test(line) || !line.includes("|")) return;
    if (/^@?handle\s*\|/i.test(line) || /^[-:| ]+$/.test(line)) return;

    const cells = line.split("|").map(cleanScoutCell);
    if (cells.length < 6) return;

    const handleMatch = cells[0].match(/@([A-Za-z0-9_]{1,15})/);
    const linkIndex = cells.findIndex((cell) => /https?:\/\/\S+/.test(cell));
    if (!handleMatch || linkIndex < 1) return;

    const link = cells[linkIndex].match(/https?:\/\/[^\s)\]]+/)[0].replace(/[.,]+$/, "");
    const text = cells.slice(linkIndex + 1).join(" | ").replace(/^["“]|["”]$/g, "").trim();
    const numbers = cells.slice(1, linkIndex);
    const key = link.toLowerCase();
    if (!text || seen.has(key)) return;
    seen.add(key);

    posts.push({
      handle: `@${handleMatch[1]}`,
      followers: parseScoutNumber(numbers[0]),
      likes: parseScoutNumber(numbers[1]),
      replies: parseScoutNumber(numbers[2]),
      hoursAgo: parseScoutHours(numbers[3]),
      link,
      text: text.slice(0, 400)
    });
  });

  return posts;
}

function scoreScoutPost(post, roomKey) {
  const room = scoutRooms[roomKey] || scoutRooms.wellness;
  const worthiness = calculateReplyWorthiness(post.text, room.category, "", room.scope);
  const freshness = post.hoursAgo === null ? 50 : freshnessScore(post.hoursAgo);
  const openRoom = post.replies === null ? 55 : metricBandScore(post.replies, 2, 30, 0, 60);
  const reach = post.followers === null ? 55 : sweetSpotScore(post.followers, 300, 60000, 100, 150000);
  const intent = analyzeTweetIntent(post.text);
  const promo = soundsPromotional(post.text) || /\b(giveaway|follow for follow|drop your link|airdrop|presale)\b/i.test(post.text);
  const crowded = post.replies !== null && post.replies > 60;

  const score = boundedScore(
    worthiness.overall * 0.45 +
    freshness * 0.2 +
    openRoom * 0.2 +
    reach * 0.15 -
    (promo ? 25 : 0) -
    (crowded ? 10 : 0)
  );

  const reasons = [];
  if (promo) reasons.push("smells like promo");
  if (crowded) reasons.push("already crowded");
  if (post.hoursAgo !== null && post.hoursAgo > 36) reasons.push("going cold");
  if (intent.question) reasons.push("asks a real question");
  if (intent.invitation) reasons.push("invites answers");
  if (intent.struggle) reasons.push("honest struggle, go gently");
  if (intent.celebration) reasons.push("a win worth celebrating");
  if (post.hoursAgo !== null && post.hoursAgo <= 6) reasons.push("still fresh");
  if (post.replies !== null && post.replies <= 12) reasons.push("few replies, you'll be seen");

  return {
    ...post,
    room: roomKey,
    score,
    decision: score >= 70 ? "go" : score >= 50 ? "maybe" : "skip",
    worthiness: worthiness.overall,
    parts: { worthiness: worthiness.overall, freshness, openRoom, reach },
    intent: intent.primary,
    anchors: extractTweetAnchors(post.text).map((anchor) => anchor.phrase),
    approach: worthiness.approach,
    reasons: reasons.slice(0, 4)
  };
}

function rankScoutPosts(posts, roomKey) {
  return posts
    .map((post) => scoreScoutPost(post, roomKey))
    .sort((a, b) => b.score - a.score);
}
