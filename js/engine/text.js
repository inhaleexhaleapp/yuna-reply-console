// Reply engine rules and the humanizer that keeps replies short, lowercase and non-corporate.

const replyEngineRules = {
  preferredMax: 180,
  replyOrder: ["safest", "warmer", "slightly witty", "mentor-aware", "ultra-short"],
  avoidWords: [
    "authenticity",
    "community",
    "compound",
    "crushing it",
    "ecosystem",
    "engagement",
    "friction",
    "growth hack",
    "insight",
    "meaningful connections",
    "nervous system",
    "sanctuary",
    "signal",
    "this hits different",
    "transparency"
  ],
  bannedPhrases: [
    "10x",
    "check my app",
    "dm me",
    "download my app",
    "grind harder",
    "great insight",
    "love this perspective",
    "valuable content"
  ]
};

const replyOpeners = {
  safest: ["fair honestly.", "yeah this part.", "felt this."],
  warmer: ["felt this honestly.", "yeah, this is very real.", "quietly been thinking the same."],
  witty: ["fair. the internet makes this weirder than it should be.", "yeah. tiny internet math, somehow emotional.", "honestly, this is the weird little part."],
  mentor: ["respect this.", "fair honestly.", "i’ve learned this the slow way too."],
  ultra: ["this is very real.", "yeah this part.", "felt this one."]
};

function trimToLimit(text, limit) {
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1).trim().replace(/[,\s]+$/, "");
  return `${clipped}.`;
}

function sentenceCaseToLowercaseBias(text) {
  if (!text) return text;
  return text.replace(/^([A-Z])/, (match) => match.toLowerCase());
}

function removeAiCadence(text) {
  let cleaned = text
    .replace(/\bThis resonates deeply\.?\s*/gi, "felt this. ")
    .replace(/\bYour authenticity is inspiring\.?\s*/gi, "respect this. ")
    .replace(/\bGreat insight!?\s*/gi, "fair honestly. ")
    .replace(/\bKeep going!?\s*/gi, "quietly rooting for this. ")
    .replace(/\bLove this perspective\.?\s*/gi, "felt this. ")
    .replace(/\bValuable content\.?\s*/gi, "this is useful. ")
    .replace(/\bmeaningful community connections\b/gi, "real replies")
    .replace(/\bmeaningful connections\b/gi, "real replies")
    .replace(/\bnervous systems\b/gi, "people")
    .replace(/\bnervous system\b/gi, "body")
    .replace(/\becosystem\b/gi, "space")
    .replace(/\bdigital sanctuary\b/gi, "small app")
    .replace(/\bsanctuary\b/gi, "quiet place")
    .replace(/\bemotional wisdom\b/gi, "honest note")
    .replace(/\bbeautifully crafted\b/gi, "specific")
    .replace(/\bcinematic\b/gi, "late")
    .replace(/\bmeaningful\b/gi, "real")
    .replace(/\btransparency\b/gi, "honesty")
    .replace(/\bauthenticity\b/gi, "honesty")
    .replace(/\bfriction\b/gi, "rough edge")
    .replace(/\bsignal\b/gi, "sign")
    .replace(/\bcompound\b/gi, "add up")
    .replace(/\bspiritual alignment\b/gi, "the room feeling quieter")
    .replace(/\bancient mantra deeply calms\b/gi, "this mantra slowed")
    .replace(/\bdeeply heals the nervous system\b/gi, "helped a little")
    .replace(/\bmay the universe guide your soul tonight\b/gi, "hope tonight gets a little quieter")
    .replace(/\bthe universe will provide\b/gi, "maybe one small thing helps")
    .replace(/\bmanifest abundance\b/gi, "make a little room")
    .replace(/\bhigh vibration only\b/gi, "quiet helps")
    .replace(/\bmillionaire mindset\b/gi, "less noise")
    .replace(/\bhigh vibrational\b/gi, "quiet")
    .replace(/\btransform your life\b/gi, "help a little")
    .replace(/\bunlock your potential\b/gi, "make the next minute easier")
    .replace(/\s+/g, " ")
    .trim();

  replyEngineRules.bannedPhrases.forEach((phrase) => {
    cleaned = cleaned.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
  });

  return cleaned.replace(/\s+/g, " ").trim();
}

function isRareYunaContext(category, tweetText) {
  const lower = `${category} ${tweetText}`.toLowerCase();
  return containsAny(lower, [
    "sleep",
    "ambient",
    "lonely",
    "loneliness",
    "quiet",
    "myth",
    "dream",
    "night",
    "calm",
    "meditation"
  ]);
}

function isBuilderPromptTweet(tweetText) {
  return containsAny(tweetText.toLowerCase(), builderPromptWords);
}

function isFounderPromptLike(tweetText) {
  const lower = tweetText.toLowerCase();
  return isBuilderPromptTweet(tweetText) || containsAny(lower, [
    "drop your startup",
    "share your saas",
    "promote your project",
    "what did you ship",
    "weekend build thread",
    "who is still awake coding"
  ]);
}

function addFounderHumanVariance(text, mode, tweetText) {
  const promptLike = isFounderPromptLike(tweetText);
  let cleaned = text
    .replace(/\bquietly rooting for this\.?\s*/gi, "rooting for this. ")
    .replace(/\bHope\b/g, "hope")
    .replace(/\bThis is the part\b/gi, "this part")
    .replace(/\bIt is a lot\b/gi, "it is a lot")
    .replace(/\bThe product\b/g, "the product")
    .replace(/\bThe founder\b/g, "the founder")
    .replace(/\bThe build\b/g, "the build")
    .replace(/\bThe internet\b/g, "the internet");

  if (promptLike || ["ultra-short", "slightly witty", "safest"].includes(mode)) {
    cleaned = cleaned
      .replace(/\bdistribution is also part of the quest\b/gi, "distribution is also work, annoyingly")
      .replace(/\bthe right early people\b/gi, "the right few people")
      .replace(/\bthe project is in the world now\b/gi, "it exists now")
      .replace(/\bwithout turning it into\b/gi, "without making it")
      .replace(/\bHope this keeps finding its people\b/gi, "hope it finds a few real people")
      .replace(/\bThis is real work\b/gi, "this is real work")
      .replace(/\bmeaningful\b/gi, "real");
  }

  const shouldAddTexture = promptLike && cleaned.length < 150 && Math.random() < 0.28;
  if (shouldAddTexture && !/\b(lol|idk|3am|same boat|good enough for tonight)\b/i.test(cleaned)) {
    const endings = [" lol", " idk", ". again at 3am", ". good enough for tonight"];
    cleaned = `${cleaned.replace(/[.!?\s]+$/, "")}${endings[Math.floor(Math.random() * endings.length)]}`;
  }

  if (promptLike && cleaned.length > 170) {
    cleaned = makeShorter(cleaned);
  }

  return cleaned;
}

function humanizeReply(text, mode, context, tweetText = "") {
  let cleaned = removeAiCadence(text);
  const lower = cleaned.toLowerCase();
  const builderPromptAnswer = context === "founder" && (
    isBuilderPromptTweet(tweetText) ||
    /^(meme caption|gif cue|building|working|today|built|my project|sharing|i’m building|still building|app polish|shipping small softness)/i.test(cleaned)
  );

  if (mode === "ultra-short") {
    const ultraIntent = analyzeTweetIntent(tweetText);
    if (builderPromptAnswer && !ultraIntent.celebration && !ultraIntent.struggle) {
      const options = [
        "small calm audio thing. distribution arc continues 😅",
        "app polish today. visibility tax also due.",
        "shipped a tiny fix. good enough for tonight.",
        "still building. slightly tired, but building."
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    const options = context === "founder"
      ? ["yeah this part.", "this is very real.", "tiny progress still counts.", "felt this one."]
      : ["this is very real.", "yeah this part.", "felt this one.", "fair honestly."];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (!builderPromptAnswer && mode === "safest" && !/^(fair honestly|felt this|yeah|respect this|this is)/i.test(cleaned)) {
    cleaned = `${replyOpeners.safest[Math.floor(Math.random() * replyOpeners.safest.length)]} ${cleaned}`;
  }

  if (!builderPromptAnswer && mode === "warmer" && !/^(felt this|yeah|quietly|i get|i know)/i.test(cleaned)) {
    cleaned = `${replyOpeners.warmer[Math.floor(Math.random() * replyOpeners.warmer.length)]} ${cleaned}`;
  }

  if (!builderPromptAnswer && mode === "slightly witty" && context === "founder" && !lower.includes("weird")) {
    cleaned = `${replyOpeners.witty[Math.floor(Math.random() * replyOpeners.witty.length)]} ${cleaned}`;
  }

  if (!builderPromptAnswer && mode === "mentor-aware" && !/^(respect this|fair honestly|i’ve learned)/i.test(cleaned)) {
    cleaned = `${replyOpeners.mentor[Math.floor(Math.random() * replyOpeners.mentor.length)]} ${cleaned}`;
  }

  cleaned = cleaned
    .replace(/\bI\b/g, "i")
    .replace(/\bI’m\b/g, "i’m")
    .replace(/\bI’ve\b/g, "i’ve")
    .replace(/\bHope\b/g, "hope")
    .replace(/\bMaybe\b/g, "maybe")
    .replace(/\bRespect\b/g, "respect")
    .replace(/\bThat\b/g, "that")
    .replace(/\bThis\b/g, "this")
    .replace(/\. (A|After|Been|Building|Every|Hope|It|Low|Mobile|No|One|People|Product|SaaS|Screenshots|Solo|The|There|This|Try|Whatever|You)\b/g, (match) => match.toLowerCase());

  if (context === "founder") {
    cleaned = addFounderHumanVariance(cleaned, mode, tweetText);
  }

  cleaned = sentenceCaseToLowercaseBias(cleaned);
  const founderLimit = isFounderPromptLike(tweetText) ? 170 : replyEngineRules.preferredMax;
  return trimToLimit(cleaned, mode === "shorter" ? 145 : context === "founder" ? founderLimit : replyEngineRules.preferredMax);
}

function applyReplyEngineShape(items, variant, context, tweetText) {
  const modes = variant === "shorter"
    ? ["ultra-short", "safest", "warmer", "slightly witty", "mentor-aware"]
    : replyEngineRules.replyOrder;
  const shaped = [];
  const seen = new Set();

  items.forEach((item, index) => {
    const slotMode = modes[index] || "safest";
    const isAnswer = item.tone === "echo · answer";
    const mode = isAnswer && slotMode !== "ultra-short" ? "answer" : slotMode;
    const text = isAnswer && mode === "answer"
      ? trimToLimit(sentenceCaseToLowercaseBias(removeAiCadence(item.text)), replyEngineRules.preferredMax)
      : humanizeReply(item.text, mode, context, tweetText);
    if (!text || seen.has(text.toLowerCase())) return;
    seen.add(text.toLowerCase());
    shaped.push({
      ...item,
      text,
      mode
    });
  });

  return shaped;
}

function makeShorter(text) {
  if (text.length <= 138) return text;
  const sentence = text.split(/[.!?]/).map((part) => part.trim()).find(Boolean);
  return trimToLimit(sentence ? `${sentence}.` : text, 138);
}

function soundsPromotional(text) {
  const lower = text.toLowerCase();
  const promoPhrases = [
    "download",
    "install",
    "try my",
    "try our",
    "use our",
    "sign up",
    "subscribe",
    "follow us",
    "limited time",
    "link in"
  ];
  return promoPhrases.some((phrase) => lower.includes(phrase));
}
