// Social Gravity scoring for threads and accounts.

function sweetSpotScore(value, idealMin, idealMax, softMin, softMax) {
  if (value >= idealMin && value <= idealMax) return 100;
  if (value >= softMin && value <= softMax) return 64;
  return 24;
}

function metricBandScore(value, idealMin, idealMax, softMin, softMax) {
  if (value >= idealMin && value <= idealMax) return 100;
  if (value >= softMin && value <= softMax) return 68;
  return value > softMax ? 34 : 18;
}

function freshnessScore(hours) {
  if (hours <= 6) return 100;
  if (hours <= 12) return 72;
  if (hours <= 24) return 44;
  if (hours <= 48) return 20;
  return 8;
}

function countPattern(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function compactWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countEmojiLikeMarks(text) {
  return countPattern(text, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu);
}

function detectGravityCultureSignals(candidate) {
  const text = `${candidate.text} ${candidate.handle} ${candidate.mode} ${(candidate.tags || []).join(" ")}`.toLowerCase();
  const boosts = [];
  const risks = [];
  const aliveSignals = [];
  const deadSignals = [];
  const hashtagCount = countPattern(candidate.text, /(^|\s)#[a-z0-9_]+/gi);
  const emojiCount = countEmojiLikeMarks(candidate.text);
  const words = compactWordCount(candidate.text);
  const hashtagDense = hashtagCount >= 4 || (words > 0 && hashtagCount / words > 0.08);
  const repetitiveQuoteFormat = countPattern(candidate.text, /["“”]/g) >= 4 || countPattern(candidate.text, /\n\s*\n/g) >= 2;
  const highLikesNoConversation = candidate.likes >= 80 && candidate.replies <= 2;
  const lowReplyDepth = candidate.replies < 5 || (!candidate.backAndForth && !candidate.realHumans);
  const noRecurringPeople = candidate.recurringUsers <= 0 && !containsAny(text, ["same people", "regulars", "mutuals", "people know each other", "recurring"]);

  const boostChecks = [
    [["felt this", "honestly", "tried this", "made my brain", "this helped a little"], "personal anecdote"],
    [["tonight", "late night", "2am", "3am", "rain", "window", "headphones", "in the dark"], "late-night sensory"],
    [["exhausted", "tired", "wide awake", "can't sleep", "overthinking"], "real exhaustion"],
    [["quiet", "soft", "stillness", "breathe", "sleep", "ritual"], "human calm"],
    [["ambient", "soundscape", "headphones", "rain on window", "sleep track"], "ambient creator"],
    [["432hz", "432 hz", "frequency", "delta waves", "theta waves"], "frequency room"],
    [["mantra", "chant", "japa"], "mantra"],
    [["breathwork", "box breathing", "slow exhales", "breathe through"], "breathwork"],
    [["myth", "mythology", "dreams", "stories for sleep"], "mythology calm"],
    [["ai companion", "gentle ai", "ai friend", "yuna"], "AI companion"],
    [["cozy internet", "soft internet", "slow tech", "calm tech", "quiet internet"], "cozy/calm tech"],
    [["replying back", "mutuals", "thread feels alive", "people know each other", "same people", "regulars"], "recurring people"],
    [["what did you ship", "building in public", "weekend builders", "small win", "shipping update"], "reciprocal founder room"],
    [["made this", "building", "solo founder", "indie"], "low ego builder"]
  ];

  const riskChecks = [
    [["daily affirmation", "daily wisdom", "quote of the day", "quote repost", "write this before sleep"], "generic affirmation loop"],
    [["type yes", "comment yes", "comment \"yes\"", "repost if", "rt if", "drop a", "claim it"], "CTA spirituality"],
    [["manifest abundance", "millionaire mindset", "the universe will", "high vibration only", "high vibe only"], "billionaire/spirituality crossover"],
    [["guru", "manifest your dream life", "law of attraction", "spiritual awakening course"], "fake spirituality"],
    [["download now", "install now", "free trial", "limited time", "link in bio", "dm me"], "obvious promotion"],
    [["unlock your potential", "transform your life", "deeply resonate", "ancient wisdom reveals"], "polished AI/corporate tone"],
    [["corporate wellness", "enterprise mindfulness", "b2b wellness", "yoga magazine"], "corporate wellness"],
    [["ai-generated", "ai generated", "generated image", "cosmic aura", "spiritual image"], "AI spiritual image spam"],
    [["drive some traffic", "promote your project", "hype each other", "follow everyone", "everyone drop"], "founder engagement bait"]
  ];

  boostChecks.forEach(([words, label]) => {
    if (containsAny(text, words)) {
      boosts.push(label);
      aliveSignals.push(label);
    }
  });
  riskChecks.forEach(([words, label]) => {
    if (containsAny(text, words)) {
      risks.push(label);
      deadSignals.push(label);
    }
  });

  if (candidate.recurringUsers >= 2) aliveSignals.push("recurring familiar people");
  if (candidate.emotionalDepth >= 70) aliveSignals.push("emotional depth");
  if (candidate.toneMatch >= 70) aliveSignals.push("emotional tone match");
  if (candidate.lateNightActive || containsAny(text, ["2am", "3am", "late night", "tonight"])) aliveSignals.push("late-night active room");
  if (candidate.backAndForth && candidate.realHumans) aliveSignals.push("people replying to each other");
  if (hashtagDense) deadSignals.push("high hashtag density");
  if (emojiCount >= 4) deadSignals.push("emoji spam");
  if (repetitiveQuoteFormat) deadSignals.push("repetitive quote formatting");
  if (highLikesNoConversation) deadSignals.push("high likes + no conversation");
  if (lowReplyDepth) deadSignals.push("low reply depth");
  if (noRecurringPeople) deadSignals.push("no recurring users");

  const uniqueAlive = [...new Set(aliveSignals)];
  const uniqueDead = [...new Set(deadSignals)];
  const deadQuoteScore = boundedScore(
    uniqueDead.length * 11 +
    hashtagCount * 5 +
    emojiCount * 3 +
    (highLikesNoConversation ? 20 : 0) +
    (lowReplyDepth ? 14 : 0) +
    (noRecurringPeople ? 10 : 0) +
    (candidate.followers > 120000 && candidate.replies < 8 ? 16 : 0)
  );
  const emotionalScore = boundedScore(
    candidate.emotionalDepth * 0.48 +
    candidate.toneMatch * 0.22 +
    Math.min(uniqueAlive.length * 8, 36) +
    Math.min(candidate.recurringUsers * 6, 24) +
    (candidate.lateNightActive ? 8 : 0)
  );

  return {
    boosts: [...new Set(boosts)],
    risks: [...new Set(risks)],
    aliveSignals: uniqueAlive,
    deadSignals: uniqueDead,
    deadQuoteScore,
    emotionalScore,
    hashtagCount,
    emojiCount
  };
}

function scoreGravityCandidate(candidate) {
  const cultureSignals = detectGravityCultureSignals(candidate);
  const followerScore = sweetSpotScore(candidate.followers, candidate.followerMin, candidate.followerMax, 1500, 90000);
  const likeScore = metricBandScore(candidate.likes, 20, 200, 8, 420);
  const replyCountScore = metricBandScore(candidate.replies, 5, 30, 2, 60);
  const accountQuality = boundedScore((followerScore * 0.68) + (candidate.originalMedia ? 18 : 0) + (candidate.tags.length >= 2 ? 14 : 0));
  const replyCulture = boundedScore((replyCountScore * 0.3) + (candidate.authorReplies ? 21 : 0) + (candidate.backAndForth ? 20 : 0) + (candidate.realHumans ? 18 : 0) + Math.min(candidate.recurringUsers * 6, 22) + (candidate.lateNightActive ? 7 : 0));
  const visibility = boundedScore((likeScore * 0.52) + (replyCountScore * 0.48));
  const freshness = freshnessScore(candidate.hours);
  const aestheticAlignment = boundedScore((candidate.aesthetic * 0.7) + Math.min(candidate.tags.length * 8, 30));
  const emotionalDepth = cultureSignals.emotionalScore;
  const quoteCemeteryRisk = cultureSignals.deadQuoteScore;
  const aliveRoom = boundedScore(
    replyCulture * 0.34 +
    emotionalDepth * 0.32 +
    Math.min(cultureSignals.aliveSignals.length * 7, 32) +
    (candidate.backAndForth ? 8 : 0) +
    (candidate.authorReplies ? 6 : 0) -
    quoteCemeteryRisk * 0.22
  );
  const passiveGiantPenalty = candidate.followers > 150000 && candidate.replies < 5 ? 12 : candidate.followers > 300000 ? 10 : 0;
  const deadReplyPenalty = candidate.likes > 120 && candidate.replies < 3 ? 14 : 0;
  const penalties = (candidate.nonPolitical ? 0 : 18) + (candidate.noBotHeavy ? 0 : 24) + (cultureSignals.risks.length * 9) + (quoteCemeteryRisk * 0.42) + passiveGiantPenalty + deadReplyPenalty;
  const total = boundedScore(
    candidate.niche * 0.17 +
    accountQuality * 0.14 +
    replyCulture * 0.18 +
    visibility * 0.1 +
    freshness * 0.08 +
    aestheticAlignment * 0.09 +
    emotionalDepth * 0.13 +
    aliveRoom * 0.11 -
    penalties
  );

  return {
    score: total,
    decision: total >= 70 ? "recommended" : total >= 50 ? "watch" : "skip",
    breakdown: {
      "Calm-Tech Match": boundedScore(candidate.niche),
      "Familiar Faces": accountQuality,
      "Human Warmth": replyCulture,
      "Soft Discoverability": visibility,
      "Late Night Density": freshness,
      "Window Rain Score": aestheticAlignment,
      "Emotional Echo": emotionalDepth,
      "Alive Room Index": aliveRoom,
      "Quote Cemetery Risk": quoteCemeteryRisk
    },
    penalties,
    quoteCemeteryRisk,
    aliveRoom,
    emotionalDepth,
    cultureSignals
  };
}

function gravityWhyText(candidate, result) {
  const cemeteryWarning = result.quoteCemeteryRisk >= 55
    ? ` Quote cemetery warning: ${result.cultureSignals.deadSignals.slice(0, 3).join(", ")}.`
    : "";
  if (result.score < 50) {
    return `Skip this one tonight. The thread is not giving enough social gravity, or it risks passive quote-farm attention.${cemeteryWarning}`;
  }
  const reasons = [];
  if (candidate.followers >= candidate.followerMin && candidate.followers <= candidate.followerMax) reasons.push("mid-size account range");
  if (candidate.replies >= 5 && candidate.replies <= 30) reasons.push("visible reply lane");
  if (candidate.authorReplies) reasons.push("author is likely present");
  if (candidate.recurringUsers >= 2) reasons.push(`${candidate.recurringUsers} recurring people`);
  if (candidate.emotionalDepth >= 70) reasons.push("emotional depth");
  if (candidate.toneMatch >= 70) reasons.push("tone match");
  if (candidate.lateNightActive) reasons.push("late-night activity");
  if (candidate.hours <= 6) reasons.push("fresh window");
  if (candidate.tags.length) reasons.push(`aesthetic match: ${candidate.tags.slice(0, 3).join(", ")}`);
  if (result.cultureSignals?.boosts?.length) reasons.push(`culture: ${result.cultureSignals.boosts.slice(0, 3).join(", ")}`);
  const riskNote = result.cultureSignals?.risks?.length ? ` Watch for ${result.cultureSignals.risks.slice(0, 2).join(", ")}.` : "";
  const atmosphere = [];
  if (result.aliveRoom >= 76) atmosphere.push("some rooms feel alive immediately");
  if (candidate.lateNightActive || containsAny(`${candidate.text} ${(candidate.tags || []).join(" ")}`.toLowerCase(), ["late night", "2am", "3am", "tonight"])) atmosphere.push("late-night gravity detected");
  if (candidate.recurringUsers >= 2 || result.cultureSignals?.aliveSignals?.includes("recurring familiar people")) atmosphere.push("familiar people detected");
  if (result.cultureSignals?.aliveSignals?.some((signal) => /low ego|human calm|personal anecdote/i.test(signal))) atmosphere.push("low ego room");
  const signatureNote = atmosphere.length ? ` ${atmosphere.slice(0, 2).join(". ")}.` : " quiet internet energy.";
  return `This thread matters because it has ${reasons.join(", ") || "enough aligned signals"} without needing a viral reply black hole.${riskNote}${cemeteryWarning}${signatureNote}`;
}
