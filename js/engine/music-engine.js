// Music / Sound candidate building and people-list parsing.

function musicShape(text, mode, tone, anchor) {
  let cleaned = sentenceCaseToLowercaseBias(removeAiCadence(text))
    .replace(/\bI\b/g, "i")
    .replace(/\bI’m\b/g, "i’m");

  if (mode === "ultra-short" && tone === "composer offer") {
    const pool = ["would love to hear more about it 🙏", "sounds like my kind of project. dm open?", "ritual + drums is exactly my lane. would love to chat."];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  if (mode === "ultra-short") {
    const pool = anchor
      ? [`that ${anchor} though.`, `the ${anchor} 🌫️`, `${anchor} mood, yes.`]
      : ["the atmosphere here 🌫️", "this already has a sound.", "okay, this mood.", "following this one."];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const openers = (musicToneOpeners[tone] || [""]).filter(Boolean);
  if (openers.length && ["warmer", "slightly witty"].includes(mode) && cleaned.length < 120 && !/^(oh|okay|love|quietly|following|composer)/i.test(cleaned)) {
    cleaned = `${openers[Math.floor(Math.random() * openers.length)]} ${cleaned}`;
  }

  return trimToLimit(cleaned.replace(/\s+/g, " ").trim(), 220);
}

function buildMusicCandidates(tweetText, category, tone) {
  const intent = analyzeTweetIntent(tweetText);
  const anchors = extractTweetAnchors(tweetText, musicLexicon);
  const lower = normalizeEchoText(tweetText).toLowerCase();
  const composerWanted = category === "looking for composer" || containsAny(lower, ["looking for a composer", "need a composer", "looking for music", "need music", "hiring a composer", "composer wanted"]);
  const sharesWork = intent.share || category === "gamedev WIP" || containsAny(lower, ["#screenshotsaturday", "screenshotsaturday", "wip", "progress", "devlog", "here's", "made this", "working on"]);
  const effectiveCategory = composerWanted ? "looking for composer" : category;
  const candidates = [];

  (musicReplyBank[effectiveCategory] || []).forEach((text, index) => {
    candidates.push({ text, category: effectiveCategory, tone: composerWanted ? "composer offer" : tone, score: (composerWanted ? (index < 2 ? 27 : 12) : 14) - index * 0.3 });
  });

  musicCategories.forEach((otherCategory) => {
    if (otherCategory === effectiveCategory || otherCategory === "looking for composer") return;
    (musicReplyBank[otherCategory] || []).forEach((text) => {
      candidates.push({ text, category: otherCategory, tone, score: 5 });
    });
  });

  anchors.forEach((anchor, anchorIndex) => {
    const family = musicEchoTemplates[anchor.kind] || echoTemplates.wellness[anchor.kind];
    if (!family) return;
    const intentKey = sharesWork ? "share" : intent.struggle ? "struggle" : "any";
    [...(family[intentKey] || []), ...(family.any || [])].forEach((template, templateIndex) => {
      candidates.push({
        text: fillEchoTemplate(template, anchor),
        template,
        category: effectiveCategory,
        tone: `echo · ${anchor.kind}`,
        anchor: anchor.phrase,
        score: 21 + anchor.weight * 0.6 - anchorIndex * 1.5 - templateIndex * 0.4
      });
    });
  });

  if (composerWanted && musicState.linkMode !== "none" && musicState.portfolioUrl) {
    candidates.push({
      text: `i make ambient / mythic music and would love to hear more about the project. a few pieces: ${musicState.portfolioUrl}`,
      category: "looking for composer",
      tone: "portfolio",
      score: musicState.linkMode === "include" ? 30 : 24
    });
  }

  candidates.forEach((candidate) => {
    candidate.score -= danglingReferencePenalty(candidate.text, { share: sharesWork || composerWanted });
    candidate.score += Math.random() * 4;
  });

  return { candidates, anchors, intent, composerWanted };
}

// People list
function parsePeopleLines(raw) {
  return String(raw || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /@[A-Za-z0-9_]{2,15}/.test(line))
    .map((line) => {
      const handle = line.match(/@([A-Za-z0-9_]{2,15})/)[1];
      const parts = line.split("|").map((part) => part.trim());
      if (parts.length >= 5 && parts[0].startsWith("@")) {
        return {
          handle: `@${handle}`,
          category: parts[1] || "",
          followers: parts[2] || "",
          postDate: parts[3] || "",
          link: ((parts[4] || "").match(/https?:\/\/\S+/) || [""])[0],
          mood: parts.slice(5).join(" · "),
          addedAt: new Date().toISOString(),
          lastReplied: ""
        };
      }
      const link = (line.match(/https?:\/\/\S+/) || [""])[0].replace(/[),.]+$/, "");
      const date = (line.match(/\b(20\d{2}-\d{2}-\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.? \d{1,2}(?:, ?20\d{2})?)\b/i) || [""])[0];
      const followers = (parts.find((part) => /\d/.test(part) && /(k|followers|~|\d,\d)/i.test(part) && !/https?:/.test(part) && part !== date) || "").replace(/followers?/i, "").trim();
      const textParts = parts.filter((part) => part && !part.startsWith("@") && !/https?:/.test(part) && part !== date && part !== followers && !/^\d/.test(part));
      return {
        handle: `@${handle}`,
        category: textParts[0] || "",
        followers,
        postDate: date,
        link,
        mood: textParts.slice(1).join(" · "),
        addedAt: new Date().toISOString(),
        lastReplied: ""
      };
    });
}

function mergePeople(incoming) {
  let added = 0;
  incoming.forEach((person) => {
    const existing = musicState.people.find((item) => item.handle.toLowerCase() === person.handle.toLowerCase());
    if (existing) {
      Object.keys(person).forEach((key) => {
        if (!["addedAt", "lastReplied"].includes(key) && person[key]) existing[key] = person[key];
      });
    } else {
      musicState.people.push(person);
      added += 1;
    }
  });
  return added;
}

function daysSince(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  return Number.isFinite(diff) ? Math.floor(diff / 86400000) : null;
}
