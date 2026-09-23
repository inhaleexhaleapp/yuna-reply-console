// Wellness / Yuna candidate building and picking.

function detectKeywordCategories(tweetText) {
  const lower = tweetText.toLowerCase();
  const matches = new Set();

  contextualReplies.forEach((entry) => {
    if (containsAny(lower, entry.words)) {
      matches.add(entry.category);
    }
  });

  if (containsAny(lower, ["founder", "startup", "building", "shipping", "launch"])) {
    matches.add("founder fatigue");
  }

  if (containsAny(lower, ["sad", "grief", "cry", "heavy"])) {
    matches.add("sadness");
  }

  if (containsAny(lower, ["meditate", "breath", "breathing", "mindful"])) {
    matches.add("meditation");
  }

  if (containsAny(lower, ["app", "tool", "product"])) {
    matches.add("app discovery");
  }

  return Array.from(matches);
}

function buildCandidateReplies(tweetText, category, tone, variant) {
  const lower = tweetText.toLowerCase();
  const keywordCategories = detectKeywordCategories(tweetText);
  const effectiveTone = variant === "softer"
    ? "soft"
    : variant === "human"
      ? "warm human"
      : variant === "shorter"
        ? "minimal"
        : tone;

  const candidates = [];

  function addGroup(groupCategory, groupTone, score) {
    const group = replyBank[groupCategory] && replyBank[groupCategory][groupTone];
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

  addGroup(category, effectiveTone, 14);
  if (effectiveTone !== tone) addGroup(category, tone, 9);

  tones.forEach((availableTone) => {
    if (availableTone !== effectiveTone && availableTone !== tone) {
      addGroup(category, availableTone, 5);
    }
  });

  keywordCategories.forEach((keywordCategory) => {
    addGroup(keywordCategory, effectiveTone, keywordCategory === category ? 8 : 11);
    addGroup(keywordCategory, tone, keywordCategory === category ? 6 : 8);
  });

  contextualReplies.forEach((entry) => {
    if (containsAny(lower, entry.words)) {
      entry.replies.forEach((text) => {
        candidates.push({
          text,
          category: entry.category,
          tone: "context",
          score: entry.score || (entry.category === category ? 13 : 10)
        });
      });
    }
  });

  if (keywordCategories.length === 0) {
    addGroup("need calm", effectiveTone, 4);
    addGroup("soft internet", effectiveTone, 3);
  }

  const echo = buildEchoCandidates(tweetText, "wellness");
  candidates.forEach((candidate) => {
    candidate.score -= danglingReferencePenalty(candidate.text, echo.intent);
  });
  candidates.push(...echo.candidates);

  return candidates;
}

function recentTextSet() {
  const recent = new Set();
  currentReplies.forEach((reply) => recent.add(reply.text));
  appState.used.slice(0, 30).forEach((item) => recent.add(item.text));
  appState.history.slice(0, 12).forEach((run) => {
    (run.replies || []).forEach((text) => recent.add(text));
  });
  return recent;
}

function pickReplies(candidates, variant, tweetText) {
  const seen = new Set();
  const recent = recentTextSet();
  const maxLength = variant === "shorter" ? 155 : 220;
  const unique = [];

  candidates.forEach((candidate) => {
    const text = variant === "shorter" ? makeShorter(candidate.text) : trimToLimit(candidate.text, 220);
    if (!text || seen.has(text) || text.length > 220) return;
    seen.add(text);
    unique.push({
      ...candidate,
      text,
      score: candidate.score
        + Math.random() * 4
        - (recent.has(text) ? 5 : 0)
        - (text.length > maxLength ? 1.5 : 0)
    });
  });

  unique.sort((a, b) => b.score - a.score);
  const picked = capEchoReplies(unique, 5, 3).map((item) => ({
    text: item.text,
    category: item.category,
    tone: item.tone,
    anchor: item.anchor
  }));

  return applyReplyEngineShape(picked, variant, "wellness", tweetText);
}
