// Reply Worthiness: a local heuristic for whether a post deserves a reply.

const replyWorthinessTopics = [
  {
    label: "indie founder",
    categories: ["solo founder", "indie hacker", "build in public", "builder prompts", "no users yet", "launch day", "product hunt", "app store launch", "coding burnout", "vibe coding", "no-code", "founder loneliness", "revenue anxiety", "saas building", "mobile app founder", "shipping update"],
    words: ["founder", "builder", "startup", "indie", "saas", "mvp", "launch", "launched", "ship", "shipping", "shipped", "product", "app", "users", "customer", "revenue", "mrr", "no-code", "nocode", "build in public", "product hunt", "stripe"]
  },
  {
    label: "wellness",
    categories: ["can't sleep", "overthinking", "burnout", "sadness", "soft internet", "need calm", "loneliness", "founder fatigue", "meditation"],
    words: ["wellness", "sleep", "rest", "burnout", "anxiety", "calm", "soft", "healing", "nervous system", "breath", "breathe", "meditation", "mindful", "mindfulness", "journal", "lonely", "overthinking"]
  },
  {
    label: "creator economy",
    categories: ["creator monetization"],
    words: ["creator", "newsletter", "content", "audience", "community", "course", "membership", "paid community", "sponsor", "monetization", "subscribers"]
  },
  {
    label: "AI",
    categories: ["app discovery", "vibe coding", "calm-tech builder"],
    words: ["ai", "llm", "agent", "chatgpt", "model", "prompt", "automation", "cursor", "claude", "openai", "local-first", "no api"]
  },
  {
    label: "mindfulness",
    categories: ["meditation", "need calm", "soft internet"],
    words: ["mindfulness", "mindful", "meditate", "meditation", "breathwork", "presence", "stillness", "slow", "grounding", "ritual", "mantra"]
  }
];

function normalizeWorthinessText(value) {
  return String(value || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
}

function keywordHitCount(text, words) {
  return words.reduce((count, word) => {
    const keyword = normalizeWorthinessText(word).trim();
    if (!keyword) return count;
    if (/^[a-z0-9]+$/.test(keyword) && keyword.length <= 3) {
      return count + (new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(text) ? 1 : 0);
    }
    return count + (text.includes(keyword) ? 1 : 0);
  }, 0);
}

function firstReplyCountMention(text) {
  const match = text.match(/\b(\d{1,4})\s+(reply|replies|comments?)\b/i);
  return match ? Number(match[1]) : null;
}

function detectWorthinessSignals(tweetText, category, scope) {
  const lower = normalizeWorthinessText(tweetText);
  const categoryLower = normalizeWorthinessText(category);
  const words = compactWordCount(tweetText);
  const linkCount = countPattern(tweetText, /(https?:\/\/|www\.|t\.co\/)/gi);
  const replyCount = firstReplyCountMention(tweetText);
  const question = /[?？]/.test(tweetText) || containsAny(lower, ["what do you think", "any advice", "how do you", "how would you", "curious if", "thoughts?"]);
  const recent = containsAny(lower, ["today", "tonight", "right now", "just shipped", "just launched", "just posted", "this morning", "this week", "fresh", "day one", "launched today", "shipped today", "now live"]);
  const activeDiscussion = question || containsAny(lower, ["thoughts", "discussion", "debate", "anyone else", "reply with", "what are you", "what did you", "share your", "tell me"]);
  const crowded = containsAny(lower, ["viral", "blew up", "thousands of replies", "hundreds of replies", "too many replies", "ratio", "everyone is arguing", "hot take"]) || (replyCount !== null && replyCount > 80);
  const lowReplyCount = replyCount !== null && replyCount <= 12;
  const personal = /\b(i|i'm|i’ve|i've|we|we're|my|our)\b/i.test(lower) || containsAny(lower, ["my story", "learned this", "i learned", "i tried", "i built", "i shipped", "i felt", "been struggling"]);
  const lesson = containsAny(lower, ["lesson learned", "learned this", "what i learned", "mistake", "takeaway", "realized", "changed my mind"]);
  const discussionStarter = activeDiscussion || containsAny(lower, ["here's the question", "open question", "what worked", "what would you do"]);
  const announcement = containsAny(lower, ["we're excited to announce", "big announcement", "now available", "launching our", "check out", "read more", "press release"]);
  const linkDump = linkCount >= 2 || (linkCount >= 1 && words < 28);
  const oneLineUpdate = words > 0 && words < 16 && !question && !personal;
  const authentic = containsAny(lower, ["honestly", "real talk", "felt", "struggled", "hard", "messy", "personal", "vulnerable", "behind the scenes"]);
  const reflective = containsAny(lower, ["i think", "i learned", "realized", "noticed", "reminded me", "been thinking", "reflection", "in hindsight"]);
  const hostile = containsAny(lower, ["hate", "stupid", "idiot", "moron", "trash", "scam", "bullshit", "shut up", "destroyed", "clown"]);
  const outrage = containsAny(lower, ["outrage", "rage bait", "engagement bait", "argument", "fight me", "cancel", "exposed", "ratio", "hot take"]);
  const promo = containsAny(lower, ["limited time", "buy now", "sale", "discount", "download now", "sign up", "dm me", "book a call"]);
  const categoryWords = categoryLower.split(/[^a-z0-9+.-]+/).filter((word) => word.length > 2);
  const categoryHits = keywordHitCount(lower, categoryWords);
  const topicMatches = replyWorthinessTopics
    .map((topic) => {
      const categoryMatch = topic.categories.some((topicCategory) => categoryLower.includes(topicCategory));
      const wordHits = keywordHitCount(lower, topic.words);
      const scopeBoost = scope === "founder" && topic.label === "indie founder" ? 1 : 0;
      return { ...topic, categoryMatch, wordHits, total: wordHits + (categoryMatch ? 2 : 0) + scopeBoost };
    })
    .filter((topic) => topic.total > 0)
    .sort((a, b) => b.total - a.total);

  return {
    lower,
    words,
    linkCount,
    replyCount,
    question,
    recent,
    activeDiscussion,
    crowded,
    lowReplyCount,
    personal,
    lesson,
    discussionStarter,
    announcement,
    linkDump,
    oneLineUpdate,
    authentic,
    reflective,
    hostile,
    outrage,
    promo,
    categoryHits,
    bestTopic: topicMatches[0] || null
  };
}

function scoreReplyWorthinessSignals(signals, scope) {
  const visibility = boundedScore(
    52 +
    (signals.recent ? 18 : 0) +
    (signals.lowReplyCount ? 14 : 0) +
    (signals.activeDiscussion ? 12 : 0) -
    (signals.crowded ? 28 : 0) -
    (signals.linkDump ? 6 : 0) -
    (signals.words < 12 && !signals.question ? 8 : 0)
  );
  const relevance = boundedScore(
    38 +
    Math.min(signals.categoryHits * 18, 34) +
    Math.min((signals.bestTopic?.wordHits || 0) * 10, 36) +
    (signals.bestTopic?.categoryMatch ? 12 : 0) +
    (scope === "founder" && signals.bestTopic?.label === "indie founder" ? 8 : 0)
  );
  const conversationPotential = boundedScore(
    44 +
    (signals.question ? 22 : 0) +
    (signals.personal ? 16 : 0) +
    (signals.lesson ? 12 : 0) +
    (signals.discussionStarter ? 12 : 0) -
    (signals.announcement ? 14 : 0) -
    (signals.linkDump ? 18 : 0) -
    (signals.oneLineUpdate ? 12 : 0) -
    (signals.promo ? 8 : 0)
  );
  const warmthFit = boundedScore(
    58 +
    (signals.authentic ? 13 : 0) +
    (signals.reflective ? 12 : 0) +
    (signals.personal ? 9 : 0) -
    (signals.hostile ? 32 : 0) -
    (signals.outrage ? 24 : 0) -
    (signals.promo ? 10 : 0)
  );

  return {
    visibility,
    relevance,
    conversationPotential,
    warmthFit
  };
}

function replyWorthinessStatus(score) {
  if (score >= 90) return { icon: "🌙", label: "Exceptional" };
  if (score >= 75) return { icon: "🌙", label: "Strong Opportunity" };
  if (score >= 60) return { icon: "🌙", label: "Worth Considering" };
  if (score >= 40) return { icon: "⚠", label: "Low Signal" };
  return { icon: "❌", label: "Skip" };
}

function replyWorthinessReasons(signals, scores, overall) {
  const reasons = [];

  function add(text, type = "positive") {
    if (!reasons.some((reason) => reason.text === text)) {
      reasons.push({ text, type });
    }
  }

  if (signals.personal) add("✓ Personal or lived-experience signal");
  if (signals.question) add("✓ Clear question or discussion starter");
  if (signals.lesson) add("✓ Lesson learned or reflective context");
  if (signals.bestTopic?.label) add(`✓ Relevant to ${signals.bestTopic.label}`);
  if (signals.recent) add("✓ Feels recent enough to join");
  if (signals.activeDiscussion) add("✓ Active discussion cue present");
  if (signals.lowReplyCount) add("✓ Reply count appears low enough to be seen");
  if (signals.crowded) add("⚠ Thread may already be crowded", "warning");
  if (signals.linkDump) add("⚠ Link-heavy post with less room to respond", "warning");
  if (signals.announcement) add("⚠ Announcement-like post may invite less conversation", "warning");
  if (signals.hostile || signals.outrage) add("⚠ Hostile or outrage-bait language detected", "warning");
  if (scores.warmthFit >= 70 && !signals.hostile && !signals.outrage) add("✓ Natural fit for a warm human reply");
  if (scores.conversationPotential >= 70) add("✓ Enough room for a meaningful reply");
  if (overall < 40) add("❌ Better to save attention for a calmer thread", "warning");

  while (reasons.length < 3 && overall >= 40) {
    if (!reasons.some((reason) => reason.text.includes("human reply"))) add("✓ Enough context for a human reply");
    else if (!reasons.some((reason) => reason.text.includes("selected radar"))) add("✓ Close enough to the selected radar");
    else add("✓ Worth a slower read before drafting");
  }

  while (reasons.length < 3) {
    add("⚠ Not enough strong signals yet", "warning");
    add("⚠ Reply only if you have a specific human angle", "warning");
    add("❌ Skipping is a valid attention choice", "warning");
  }

  return reasons.slice(0, 5);
}

function suggestedReplyApproach(signals, scores, overall, category, tone, scope) {
  const context = `${category} ${tone}`.toLowerCase();
  if (overall < 40) return "Skip for now";
  if (signals.hostile || signals.outrage || overall < 60) return "Ultra Short";
  if (scope === "founder" || containsAny(context, ["founder", "builder", "indie", "saas"])) {
    if (containsAny(context, ["mentor", "practical"])) return "Mentor Aware";
    return scores.conversationPotential >= 74 ? "Warm Founder" : "Supportive";
  }
  if (signals.question) return "Curious Question";
  if (signals.personal || signals.reflective) return "Personal Experience";
  if (containsAny(context, ["mentor", "helpful", "practical"])) return "Mentor Aware";
  return "Supportive";
}

function calculateReplyWorthiness(tweetText, category, tone, scope = "wellness") {
  const trimmed = tweetText.trim();
  if (!trimmed) {
    return {
      hasText: false,
      overall: null,
      status: { icon: "🌙", label: "Local attention check" },
      subScores: {
        visibility: null,
        relevance: null,
        conversationPotential: null,
        warmthFit: null
      },
      reasons: [],
      approach: "Paste a post first"
    };
  }

  const signals = detectWorthinessSignals(trimmed, category, scope);
  const scores = scoreReplyWorthinessSignals(signals, scope);
  const overall = boundedScore(
    scores.visibility * 0.25 +
    scores.relevance * 0.25 +
    scores.conversationPotential * 0.3 +
    scores.warmthFit * 0.2
  );

  return {
    hasText: true,
    overall,
    status: replyWorthinessStatus(overall),
    subScores: scores,
    reasons: replyWorthinessReasons(signals, scores, overall),
    approach: suggestedReplyApproach(signals, scores, overall, category, tone, scope)
  };
}
