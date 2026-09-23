// Builds the copy-paste prompt for claude.ai. Nothing is sent anywhere.

function buildClaudePrompt(tweetText, context, options = {}) {
  const intent = analyzeTweetIntent(tweetText);
  const anchors = extractTweetAnchors(tweetText, context === "music" ? musicLexicon : []).map((anchor) => anchor.phrase);
  const worthiness = calculateReplyWorthiness(tweetText, options.category || "", options.tone || "", context === "music" ? "wellness" : context);
  const isFounder = context === "founder";
  const isMusic = context === "music";
  const linkLine = isMusic
    ? options.linkMode !== "none" && options.portfolioUrl
      ? `- only if the post is looking for a composer, one reply may include my portfolio: ${options.portfolioUrl}`
      : "- no links. if they are looking for a composer, offer to send a short sketch instead"
    : isFounder
    ? options.linkMode === "include"
      ? `- one reply may mention my app with this link: ${founderProjectUrl}`
      : options.linkMode === "none"
        ? "- no links, no app mentions"
        : `- only mention my app (${founderProjectUrl}) if the tweet explicitly asks people to share projects`
    : "- no links, no app mentions unless the tweet directly asks for app recommendations";

  return [
    isMusic
      ? "help me reply to a post on X. i'm @inhaleexhaleapp — elvin, an ambient / mythic / ritual music producer moving toward indie game soundtracks (hellblade-inspired scores, steppe journeys, drones)."
      : "help me reply to a tweet on X. i'm @inhaleexhaleapp — elvin, solo founder of inhale exhale, a small calm meditation / sleep sound app. i also make ambient music.",
    "",
    "tweet:",
    `"""${tweetText.trim()}"""`,
    "",
    "context:",
    `- room: ${isMusic ? "indie game dev / composers / ambient music" : isFounder ? "indie founder / builder" : "wellness / calm internet"}`,
    options.category ? `- category: ${options.category}` : null,
    options.tone ? `- tone i want: ${options.tone}` : null,
    `- what the tweet is doing: ${intent.primary}${intent.lateNight ? " (late night)" : ""}`,
    anchors.length ? `- specific details worth picking up: ${anchors.join(", ")}` : null,
    worthiness ? `- my local reply-worthiness score: ${worthiness.overall}/100` : null,
    options.format && options.format !== "text" ? `- format: ${options.format}` : null,
    "",
    "voice rules:",
    "- mostly lowercase, casual, like a real person typing on their phone",
    `- short: under ${replyEngineRules.preferredMax} characters each, some much shorter`,
    "- reference one concrete detail from the tweet so it doesn't feel like a template",
    isMusic ? "- if it's a game WIP, react like someone who can already hear its soundtrack: mood, texture, one instrument idea. never pitch myself unless they ask for a composer" : null,
    "- low-ego, warm, slightly imperfect is fine. no hashtags, no emojis unless one fits naturally",
    "- no therapy-speak, no guru / linkedin tone, no engagement bait, no sales language",
    `- avoid: ${[...replyEngineRules.avoidWords, ...replyEngineRules.bannedPhrases].join(", ")}`,
    linkLine,
    "",
    "give me 5 replies in this order: safest, warmer, slightly witty, mentor-aware, ultra-short.",
    "just the 5 lines, numbered, no commentary."
  ].filter((line) => line !== null).join("\n");
}
