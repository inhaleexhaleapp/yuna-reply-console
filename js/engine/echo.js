// Echo engine: anchors and intent so replies reference what the post actually says.

const echoStopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "for", "from", "has", "have", "i", "im", "i'm", "in", "is", "it", "its", "it's",
  "just", "me", "my", "of", "on", "or", "so", "that", "the", "this", "to", "was", "we", "with", "you", "your", "again", "still", "really", "very",
  "every", "some", "any", "all", "like", "about", "into", "out", "up", "down", "over", "then", "than", "too", "also", "even", "our", "their"
]);

const echoIngBlocklist = new Set([
  "thing", "nothing", "something", "anything", "everything", "morning", "evening", "during", "being", "bring", "king", "ring", "sing", "spring",
  "string", "wing", "ceiling", "feeling", "going", "doing", "saying", "getting", "trying", "having", "making"
]);

// Known concrete things worth echoing. kind decides which template family fits.
const echoLexicon = [
  { kind: "sound", words: ["432hz", "432 hz", "528hz", "528 hz", "delta waves", "theta waves", "binaural beats", "brown noise", "white noise", "pink noise", "rain sounds", "rain on the window", "rain on window", "thunderstorm", "singing bowls", "sound bath", "lofi", "lo-fi", "ambient music", "ambient track", "ocean sounds", "fan noise", "mantra", "om chanting"] },
  { kind: "ritual", words: ["journaling", "journal", "breathwork", "box breathing", "4-7-8", "cold shower", "long walk", "evening walk", "morning walk", "tea", "chamomile", "stretching", "yoga", "meditating", "meditation", "phone face down", "no phone", "screen time", "doomscrolling", "doom scrolling"] },
  { kind: "tool", words: ["cursor", "claude", "chatgpt", "codex", "flutter", "supabase", "firebase", "stripe", "revenuecat", "xcode", "testflight", "figma", "framer", "webflow", "bubble", "notion", "vercel", "swiftui", "react native"] },
  { kind: "milestone", words: ["first user", "first users", "first paying customer", "first customer", "first sale", "first dollar", "app review", "app store review", "rejected by app store", "product hunt", "launch day", "launched", "shipped", "went live", "mrr", "churn", "paywall", "onboarding", "landing page", "waitlist"] },
  { kind: "place", words: ["my desk", "the office", "coffee shop", "café", "cafe", "my bed", "the couch", "balcony", "the train", "airport"] }
];

// Say the anchor the way a person would in a reply.
const echoPhraseAliases = {
  "rejected by app store": "app store rejection",
  "app store review": "app review",
  "launched": "launch day",
  "shipped": "shipping day",
  "went live": "going live",
  "first users": "first users",
  "journal": "journaling",
  "doom scrolling": "doomscrolling",
  "432 hz": "432hz",
  "528 hz": "528hz",
  "rain on the window": "rain on the window",
  "cafe": "café",
  "foggy": "fog",
  "misty": "mist",
  "snowy": "snow",
  "caves": "cave",
  "mountains": "mountains",
  "moonlight": "moonlight",
  "candles": "candles",
  "singing bowls": "singing bowls",
  "field recording": "field recording"
};

function normalizeEchoText(value) {
  return String(value || "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[@#][\w_]+/g, " ")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function analyzeTweetIntent(tweetText) {
  const raw = String(tweetText || "");
  const lower = normalizeEchoText(raw).toLowerCase();
  const question = /\?\s*(\S{0,4})?\s*$/.test(raw.trim()) || /\?/.test(raw) && containsAny(lower, ["what", "how", "anyone", "who", "which", "does", "do you", "should i", "any tips", "recommend"]);
  const share = /https?:\/\//.test(raw) || containsAny(lower, [
    "new track", "just released", "out now", "made this", "i made", "we made", "listen", "check out", "here's", "here is", "sharing", "dropped",
    "released", "my new", "this track", "this song", "this app", "this sound", "this mix", "🎧", "🔊", "👇"
  ]) && !containsAny(lower, ["drop your", "drop it below", "what are you"]);
  const celebration = containsAny(lower, [
    "finally", "just shipped", "shipped", "launched", "first user", "first customer", "first sale", "we did it", "milestone", "approved",
    "went live", "celebrate", "🎉", "🥳", "so happy", "proud"
  ]);
  const struggle = containsAny(lower, [
    "can't", "cant", "couldn't", "couldnt", "tired", "exhausted", "burnt out", "burned out", "burnout", "anxious", "anxiety", "overthinking",
    "lonely", "alone", "sad", "heavy", "stuck", "rejected", "no users", "zero users", "failing", "gave up", "give up", "awake", "insomnia",
    "spiral", "replaying", "hard day", "rough", "struggling", "stressed", "debugging", "bug", "broke", "crashed"
  ]);
  const lateNight = /\b([1-4])\s?(am|a\.m\.)\b/.test(lower) || containsAny(lower, ["late night", "midnight", "can't sleep", "cant sleep", "insomnia", "still awake", "tonight"]);
  const invitation = containsAny(lower, ["drop your", "drop it below", "what are you building", "what are you working on", "what did you ship", "share your", "show me your", "reply with"]);
  const confession = !question && !share && (struggle || /\b(i|i'm|im|my)\b/.test(lower));
  const primary = invitation
    ? "invitation"
    : question
      ? "question"
      : celebration && !struggle
        ? "celebration"
        : share
          ? "share"
          : struggle
            ? "struggle"
            : confession
              ? "confession"
              : "observation";
  return { primary, question, share, celebration, struggle, lateNight, invitation, confession };
}

function extractTweetAnchors(tweetText, extraLexicon = []) {
  const text = normalizeEchoText(tweetText);
  const lower = text.toLowerCase();
  const anchors = [];
  const seen = new Set();

  function add(phrase, kind, weight) {
    const clean = String(phrase || "").toLowerCase().replace(/[.,!?;:"()]+$/g, "").replace(/^[.,!?;:"()]+/g, "").trim();
    if (!clean || clean.length < 2 || clean.length > 38 || seen.has(clean)) return;
    seen.add(clean);
    anchors.push({ phrase: clean, kind, weight });
  }

  const timeMatch = lower.match(/\b([1-5]|1[0-2])\s?(am|a\.m\.)\b/);
  if (timeMatch) add(`${timeMatch[1]}am`, "time", 9);

  const yearMatch = lower.match(/\b(19[6-9]\d|20[0-3]\d)\b/);
  if (yearMatch) add(yearMatch[1], "year", 8);

  const countMatch = lower.match(/\b(\d[\d,.]*\s?k?)\s?(users?|downloads?|customers?|subscribers?|followers?|rejections?|installs?|sales?|mrr)\b/);
  if (countMatch) add(`${countMatch[1].trim()} ${countMatch[2]}`, "count", 8);

  const durationMatch = lower.match(/\b(\d+|a few|two|three|four|five|six)\s?(days?|weeks?|months?|years?|hours?|nights?)\b/);
  if (durationMatch) add(`${durationMatch[1]} ${durationMatch[2]}`, "duration", 7);

  const moneyMatch = lower.match(/(\$\s?\d[\d,.]*\s?k?)(\s?mrr)?/);
  if (moneyMatch) add(moneyMatch[0].replace(/\s+/g, ""), "count", 8);

  [...extraLexicon, ...echoLexicon].forEach((group) => {
    [...group.words].sort((a, b) => b.length - a.length).forEach((word) => {
      const spoken = echoPhraseAliases[word] || word;
      if (anchors.some((anchor) => anchor.phrase.includes(spoken) || spoken.includes(anchor.phrase) || anchor.phrase.includes(word))) return;
      if (keywordHitCount(lower, [word]) > 0) add(echoPhraseAliases[word] || word, group.kind, word.includes(" ") ? 7 : 6);
    });
  });

  const quoted = text.match(/"([^"]{3,36})"/);
  if (quoted) add(quoted[1], "quote", 7);

  // "-ing" activity phrase: "replaying every conversation", "listening to rain"
  const ingPattern = /\b([a-z]{4,}ing)\b((?:\s+[a-z0-9']+){0,2})/g;
  let ingMatch;
  while ((ingMatch = ingPattern.exec(lower)) !== null) {
    const verb = ingMatch[1];
    if (echoIngBlocklist.has(verb)) continue;
    if (anchors.some((anchor) => anchor.phrase.includes(verb))) continue;
    const tail = (ingMatch[2] || "").trim().split(/\s+/).filter(Boolean);
    while (tail.length && echoStopWords.has(tail[tail.length - 1])) tail.pop();
    add([verb, ...tail].join(" "), "activity", tail.length ? 5 : 3);
  }

  return anchors.sort((a, b) => b.weight - a.weight).slice(0, 4);
}

const echoTemplates = {
  wellness: {
    time: {
      struggle: [
        "{a} brain is never accurate, just loud.",
        "{a} thoughts always feel like facts. they usually aren't.",
        "the {a} version of your brain doesn't get a vote. hope sleep finds you soon.",
        "{a} again. hope the room gets quiet for you."
      ],
      any: ["{a} hours have their own weather.", "{a} is when everything gets a little too honest."]
    },
    year: {
      any: [
        "the {a} archive always opens at the worst hour.",
        "{a} conversations at night are undefeated. none of them were as bad as the replay.",
        "nobody else remembers {a} the way your brain does at night, promise."
      ]
    },
    sound: {
      share: ["{a} while doing anything, weirdly underrated.", "{a} = my go-to when the room gets loud.", "{a} with headphones on is a whole different thing."],
      struggle: ["{a} low in the background sometimes helps me more than silence.", "have you tried {a} on very low volume? not a fix, just softer."],
      any: ["{a}, such a specific kind of calm.", "{a} gang, quietly.", "been leaning on {a} a lot lately too."]
    },
    ritual: {
      any: ["{a} is doing more quiet work than it gets credit for.", "{a} is one of the few things that actually sticks for me.", "small {a} energy is so underrated."],
      struggle: ["even a tiny bit of {a} counts tonight.", "no pressure to do {a} perfectly. five minutes is still something."]
    },
    activity: {
      struggle: ["the {a} part is too real.", "{a} is such a specific kind of tired.", "not you too with the {a}. hope it eases up."],
      share: ["{a} sounds like a good way to spend the evening.", "love that you're {a}. keep going slowly."],
      any: ["{a} is a very human sentence.", "the {a} bit made me stop scrolling."]
    },
    count: {
      any: ["{a} is not nothing.", "{a} is a real number. hope you let it count."]
    },
    duration: {
      struggle: ["{a} is a long stretch to carry. go easy on yourself tonight.", "{a} of that is a lot. hope it softens soon."],
      any: ["{a} of showing up for it. that counts.", "{a} is real time. glad it's working for you."]
    },
    quote: { any: ["\"{a}\" is going to stay with me today.", "\"{a}\" said it quieter than most threads manage."] },
    milestone: { any: ["{a} is a big quiet moment. hope you let yourself feel it."] },
    tool: { any: ["{a} doing the heavy lifting again."] },
    place: { any: ["{a} at this hour is its own mood."] }
  },
  founder: {
    time: {
      any: ["{a} coding is a genre.", "{a} bugs hit different. hope it ships before sunrise.", "{a} builder club, quietly present."]
    },
    year: { any: ["{a} was a whole other life for most of us building now."] },
    count: {
      celebration: ["{a}! that's a real one. congrats.", "{a} is how it starts. genuinely happy for you.", "{a} still counts more than any launch tweet."],
      struggle: ["{a} is not nothing, even if it feels quiet.", "{a} is more than zero, and zero is the hard part."],
      any: ["{a} is honestly not nothing.", "watching {a} go up is a weirdly emotional hobby."]
    },
    milestone: {
      celebration: ["{a} is such a good feeling. congrats, enjoy it for a minute.", "{a}! let yourself have tonight before the next bug.", "huge. {a} is the part nobody sees coming."],
      struggle: ["{a} is such a founder rite of passage. rooting for round two.", "{a} has humbled all of us. it gets less personal, promise."],
      any: ["{a} is always more emotional than the metrics admit.", "{a} is where it gets real."]
    },
    tool: {
      any: ["{a} carrying half the startup again.", "{a} + late night = most of my commits too.", "the {a} workflow is lowkey most of the job now."],
      struggle: ["{a} fighting back today? been there this week."]
    },
    activity: {
      struggle: ["{a} is the part nobody tweets about.", "the {a} bit is too real.", "{a} solo is a lot. rooting for you."],
      celebration: ["{a} and actually finishing is rare. congrats.", "love seeing someone {a} and shipping."],
      any: ["{a} is honestly most of the job.", "the {a} part is where it gets fun (and weird)."]
    },
    duration: {
      struggle: ["{a} of debugging is a founder rite of passage. rooting for the fix.", "{a} in and still going. respect, and please drink water."],
      celebration: ["{a} of building solo and it paid off. love to see it.", "{a} of quiet work finally showing up. congrats."],
      any: ["{a} of building is a lot of invisible work.", "{a} in. that's the part nobody tweets about."]
    },
    sound: { any: ["{a} while coding is my secret productivity stack too."] },
    ritual: { any: ["{a} between builds keeps me sane too."] },
    quote: { any: ["\"{a}\" should be on every founder's wall."] },
    place: { any: ["{a} builder energy. respect."] }
  }
};

// When a tweet asks a real question (not a "drop your project" invite), answer it like a person.
const echoAnswerBank = {
  wellness: {
    sleep: [
      "honestly? rain sounds very low + phone in another room. not magic, just less noise.",
      "delta waves on low volume and giving up on 'trying' to sleep. weirdly that part helps most.",
      "making the exhale longer than the inhale for a few rounds. boring, but it works for me."
    ],
    calm: [
      "a slow walk with no podcast. took me way too long to figure that out.",
      "five minutes of ambient sound and doing absolutely nothing. harder than it sounds.",
      "writing the loud thought down so it stops circling. that's most of it for me."
    ],
    generic: [
      "for me it's small quiet stuff. sound on low, lights down, fewer tabs open.",
      "honestly still figuring it out, but slowing down the evening helps more than any hack."
    ]
  },
  founder: {
    distribution: [
      "distribution, honestly. building is somehow the easy part.",
      "getting seen without turning into a billboard. still figuring that one out."
    ],
    tools: [
      "flutter + a lot of late-night ai pairing. not elegant, but it ships.",
      "whatever gets it in front of people fastest. mostly flutter and patience."
    ],
    generic: [
      "for me it's consistency more than any trick. small updates, most days.",
      "honestly just shipping smaller pieces more often. the big launches never feel real anyway."
    ]
  }
};

function buildAnswerCandidates(tweetText, context, intent) {
  if (!intent.question || intent.invitation) return [];
  const lower = normalizeEchoText(tweetText).toLowerCase();
  const bank = echoAnswerBank[context] || echoAnswerBank.wellness;
  let pool = bank.generic;
  if (context === "wellness") {
    if (containsAny(lower, ["sleep", "asleep", "insomnia", "bed", "night"])) pool = bank.sleep;
    else if (containsAny(lower, ["calm", "anxiety", "anxious", "stress", "relax", "overthink"])) pool = bank.calm;
  } else if (containsAny(lower, ["distribution", "marketing", "users", "growth", "hardest", "struggle"])) {
    pool = bank.distribution;
  } else if (containsAny(lower, ["stack", "tool", "use to build", "tech", "framework"])) {
    pool = bank.tools;
  }
  return [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((text, index) => ({ text, category: "answer", tone: "echo · answer", anchor: `answer-${index}`, score: 25 - index }));
}

function fillEchoTemplate(template, anchor) {
  let phrase = anchor.phrase;
  if (anchor.kind === "activity" && /^the \{a\}/i.test(template) === false && /^\{a\}/.test(template)) {
    phrase = phrase.charAt(0).toLowerCase() + phrase.slice(1);
  }
  return template.replace(/\{a\}/g, phrase);
}

function buildEchoCandidates(tweetText, context = "wellness") {
  const intent = analyzeTweetIntent(tweetText);
  const anchors = extractTweetAnchors(tweetText);
  const family = echoTemplates[context] || echoTemplates.wellness;
  const intentKey = intent.celebration && !intent.struggle
    ? "celebration"
    : intent.struggle
      ? "struggle"
      : intent.share
        ? "share"
        : "any";
  const candidates = [];

  anchors.forEach((anchor, anchorIndex) => {
    const kindTemplates = family[anchor.kind];
    if (!kindTemplates) return;
    const pool = [...(kindTemplates[intentKey] || []), ...(kindTemplates.any || [])];
    pool.forEach((template, templateIndex) => {
      candidates.push({
        text: fillEchoTemplate(template, anchor),
        template,
        category: "echo",
        tone: `echo · ${anchor.kind}`,
        anchor: anchor.phrase,
        score: 21 + anchor.weight * 0.6 - anchorIndex * 1.5 - (templateIndex >= (kindTemplates[intentKey] || []).length ? 1.5 : 0)
      });
    });
  });

  candidates.push(...buildAnswerCandidates(tweetText, context, intent));
  return { intent, anchors, candidates };
}

// Replies that point at "this" only make sense when the tweet shares something.
function danglingReferencePenalty(text, intent) {
  if (!intent || intent.share) return 0;
  return /\b(this (track|one|song|sound|app|mix|tonight)|tried this|with this|\+ this|saving this|this kind of thing)\b/i.test(text) ? 9 : 0;
}

function capEchoReplies(sorted, limit = 5, maxEcho = 3) {
  const picked = [];
  const anchorUse = new Map();
  const templatesUsed = new Set();
  let echoCount = 0;
  for (const item of sorted) {
    if (picked.length >= limit) break;
    const isEcho = String(item.tone || "").startsWith("echo");
    if (item.template) {
      if (templatesUsed.has(item.template)) continue;
      templatesUsed.add(item.template);
    }
    if (isEcho) {
      if (echoCount >= maxEcho) continue;
      const used = anchorUse.get(item.anchor) || 0;
      if (used >= 2) continue;
      anchorUse.set(item.anchor, used + 1);
      echoCount += 1;
    }
    picked.push(item);
  }
  return picked;
}
