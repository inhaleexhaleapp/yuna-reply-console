// Indie Founder thread gravity, candidate building and picking.

function detectFounderKeywordCategories(tweetText) {
  const lower = tweetText.toLowerCase();
  const matches = new Set();

  founderContextualReplies.forEach((entry) => {
    if (containsAny(lower, entry.words)) {
      matches.add(entry.category);
    }
  });

  if (containsAny(lower, ["build in public", "building in public", "public update"])) {
    matches.add("build in public");
  }

  if (containsAny(lower, ["product hunt", "ph launch", "upvote"])) {
    matches.add("Product Hunt");
  }

  if (containsAny(lower, ["no-code", "nocode", "bubble", "framer"])) {
    matches.add("no-code");
  }

  if (containsAny(lower, ["saas", "subscription", "churn", "retention"])) {
    matches.add("SaaS building");
  }

  if (containsAny(lower, ["creator", "newsletter", "course", "paid community"])) {
    matches.add("creator monetization");
  }

  if (containsAny(lower, ["ship", "shipped", "shipping", "update", "changelog"])) {
    matches.add("shipping update");
  }

  return Array.from(matches);
}

function shouldIncludeFounderProjectLink(tweetText, linkMode) {
  if (linkMode === "none") return false;
  if (linkMode === "include") return true;
  return containsAny(tweetText.toLowerCase(), projectLinkPromptWords);
}

function detectFounderThreadArchetypes(tweetText) {
  const lower = tweetText.toLowerCase();
  const matches = new Set();
  if (containsAny(lower, ["drop your startup", "drop your project", "drop your link", "share your saas", "promote your project"])) matches.add("drop prompt");
  if (containsAny(lower, ["what are you building", "what are you working on", "building today"])) matches.add("what building");
  if (containsAny(lower, ["what did you ship", "what are you shipping", "finally shipped", "shipped today", "shipping right now"])) matches.add("shipping");
  if (containsAny(lower, ["build in public", "building in public", "weekend build thread"])) matches.add("build public");
  if (containsAny(lower, ["who is still awake coding", "who's still awake coding", "3am", "2am", "debugging at night", "late night"])) matches.add("late coding");
  if (containsAny(lower, ["promote your project", "drive some traffic", "hype each other", "support each other"])) matches.add("promo");
  return Array.from(matches);
}

function analyzeFounderThreadGravity(tweetText, category) {
  const lower = tweetText.toLowerCase();
  const archetypes = detectFounderThreadArchetypes(tweetText);
  const broadPrompt = containsAny(lower, ["drop your startup", "drop your project", "drop your link", "promote your project", "drive some traffic", "hype each other"]);
  const noisyBait = containsAny(lower, ["drive some traffic", "hype each other", "everyone drop", "promote yourself", "boost your", "follow everyone", "repost"]);
  const founderRelevant = containsAny(lower, ["founder", "builder", "startup", "indie", "saas", "app", "product", "ship", "launched", "no-code", "cursor", "stripe", "mrr"]);
  const ecosystemAligned = containsAny(lower, ["mobile app", "calm", "sleep", "ambient", "ai companion", "wellness", "meditation", "audio", "creator"]);
  const reciprocal = containsAny(lower, ["i'll check", "i will check", "feedback", "small founders", "weekend builders", "what did you ship", "what are you building", "replying to", "support each other"]);
  const specificAsk = containsAny(lower, ["what did you ship", "what are you building", "what are you working on", "who is still awake coding", "weekend build thread"]);
  const followerSize = containsAny(lower, ["small accounts", "under 1k", "under 5k", "tiny accounts"]) ? 72 : containsAny(lower, ["100k", "viral", "big accounts"]) ? 26 : 50;
  const replyDensity = reciprocal ? 72 : broadPrompt ? 38 : 55;
  const founderRelevance = founderRelevant ? 74 : category === "builder prompts" ? 56 : 34;
  const ecosystem = ecosystemAligned ? 70 : 42;
  const threadQuality = specificAsk ? 76 : broadPrompt ? 36 : 54;
  const signalNoise = boundedScore(70 - (noisyBait ? 36 : 0) - (broadPrompt ? 14 : 0) + (specificAsk ? 18 : 0) + (ecosystemAligned ? 8 : 0));
  const reciprocalPotential = boundedScore((replyDensity * 0.55) + (followerSize * 0.2) + (threadQuality * 0.25));
  const score = boundedScore(
    followerSize * 0.1 +
    replyDensity * 0.18 +
    founderRelevance * 0.24 +
    ecosystem * 0.12 +
    reciprocalPotential * 0.18 +
    threadQuality * 0.1 +
    signalNoise * 0.08
  );
  const skip = score < 38 || (noisyBait && broadPrompt && !specificAsk);
  const reason = skip
    ? "too broad/noisy for a small account to be seen"
    : score >= 62
      ? "good enough founder signal"
      : "watch for reciprocal replies before spending energy";
  return {
    score,
    skip,
    reason,
    archetypes,
    followerSize,
    replyDensity,
    founderRelevance,
    ecosystem,
    reciprocalPotential,
    threadQuality,
    signalNoise
  };
}

function addFounderArchetypeCandidates(candidates, tweetText, settings) {
  detectFounderThreadArchetypes(tweetText).forEach((archetype) => {
    (founderArchetypeReplies[archetype] || []).forEach((text) => {
      candidates.push({
        text,
        category: "builder prompts",
        tone: archetype,
        score: archetype === "late coding" ? 25 : archetype === "shipping" ? 23 : archetype === "promo" ? 17 : 22
      });
    });
  });

  if (shouldIncludeFounderProjectLink(tweetText, settings.linkMode)) {
    [
      "building a small calm audio thing.",
      "trying to make sleep sounds less artificial.",
      "late night ambient experiments today.",
      "not another productivity app."
    ].forEach((text) => {
      candidates.push({
        text,
        category: "builder prompts",
        tone: "subtle self-promo",
        score: 16
      });
    });
  }
}

function addFounderTextureCandidates(candidates, tweetText, category, settings) {
  const lower = tweetText.toLowerCase();
  const isBuilderPrompt = category === "builder prompts" || containsAny(lower, builderPromptWords);
  if (!isBuilderPrompt) return;

  if (settings.format !== "text" && founderFormatReplies[settings.format]) {
    founderFormatReplies[settings.format].forEach((text) => {
      candidates.push({
        text,
        category: "builder prompts",
        tone: settings.format,
        score: 20
      });
    });
  }

  if (shouldIncludeFounderProjectLink(tweetText, settings.linkMode)) {
  founderProjectLinkReplies.forEach((text) => {
      candidates.push({
        text,
        category: "builder prompts",
        tone: "project link",
        score: settings.linkMode === "include" ? 19 : 18
      });
    });
  }
}

function buildFounderCandidateReplies(tweetText, category, tone, variant, settings = currentFounderSettings()) {
  const lower = tweetText.toLowerCase();
  const keywordCategories = detectFounderKeywordCategories(tweetText);
  const effectiveTone = variant === "human"
    ? "same-boat reciprocity mode"
    : variant === "casual"
      ? "casual indie hacker"
      : variant === "shorter"
        ? "micro-update mode"
        : tone;

  const candidates = [];

  function addGroup(groupCategory, groupTone, score) {
    const group = (founderReplyBank[groupCategory] && founderReplyBank[groupCategory][groupTone]) || founderModeReplies[groupTone];
    if (!group) return;
    group.forEach((text) => {
      candidates.push({
        text,
        category: groupCategory,
        tone: groupTone,
        score
      });
    });
  }

  addGroup(category, effectiveTone, 15);
  if (effectiveTone !== tone) addGroup(category, tone, 10);

  founderTones.forEach((availableTone) => {
    if (availableTone !== effectiveTone && availableTone !== tone) {
      addGroup(category, availableTone, 6);
    }
  });

  keywordCategories.forEach((keywordCategory) => {
    addGroup(keywordCategory, effectiveTone, keywordCategory === category ? 9 : 12);
    addGroup(keywordCategory, tone, keywordCategory === category ? 7 : 9);
  });

  founderContextualReplies.forEach((entry) => {
    if (containsAny(lower, entry.words)) {
      entry.replies.forEach((text) => {
        candidates.push({
          text,
          category: entry.category,
          tone: "context",
          score: entry.score || (entry.category === category ? 14 : 11)
        });
      });
    }
  });

  addFounderArchetypeCandidates(candidates, tweetText, settings);
  addFounderTextureCandidates(candidates, tweetText, category, settings);

  if (keywordCategories.length === 0) {
    addGroup("shipping update", effectiveTone, 4);
    addGroup("solo founder", effectiveTone, 4);
  }

  const echo = buildEchoCandidates(tweetText, "founder");
  candidates.forEach((candidate) => {
    candidate.score -= danglingReferencePenalty(candidate.text, echo.intent);
  });
  // Invitation threads ("what are you building?") want your own answer, not an echo.
  const echoWeight = echo.intent.invitation ? -8 : 0;
  echo.candidates.forEach((candidate) => {
    candidates.push({ ...candidate, score: candidate.score + echoWeight });
  });

  return candidates;
}

function recentFounderTextSet() {
  const recent = new Set();
  founderCurrentReplies.forEach((reply) => recent.add(reply.text));
  founderState.used.slice(0, 30).forEach((item) => recent.add(item.text));
  founderState.history.slice(0, 12).forEach((run) => {
    (run.replies || []).forEach((text) => recent.add(text));
  });
  return recent;
}

function pickFounderReplies(candidates, variant, tweetText) {
  const seen = new Set();
  const recent = recentFounderTextSet();
  const promptLike = isFounderPromptLike(tweetText);
  const maxLength = variant === "shorter" ? 145 : promptLike ? 165 : 210;
  const unique = [];

  candidates.forEach((candidate) => {
    const text = variant === "shorter" || promptLike ? makeShorter(candidate.text) : trimToLimit(candidate.text, 220);
    if (!text || seen.has(text) || text.length > 220) return;
    const polishedPenalty = containsAny(text.toLowerCase(), ["beautifully", "meaningful", "cinematic", "sanctuary", "nervous system", "emotional wisdom"]) ? 6 : 0;
    seen.add(text);
    unique.push({
      ...candidate,
      text,
      score: candidate.score
        + Math.random() * 4
        - (recent.has(text) ? 5 : 0)
        - (text.length > maxLength ? 3 : 0)
        - polishedPenalty
    });
  });

  unique.sort((a, b) => b.score - a.score);
  const picked = capEchoReplies(unique, 5, 3).map((item) => ({
    text: item.text,
    category: item.category,
    tone: item.tone,
    anchor: item.anchor
  }));

  return applyReplyEngineShape(picked, variant, "founder", tweetText);
}
