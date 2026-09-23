// Run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadEngine } = require("./load-engine");

const y = loadEngine();
// Values come from another vm realm; normalize before deep comparisons.
const plain = (value) => JSON.parse(JSON.stringify(value));
const phrases = (text, extra) => plain(y.extractTweetAnchors(text, extra).map((anchor) => anchor.phrase));

const SAMPLE_POSTS = [
  "couldn't sleep again. 3am and my brain is replaying every conversation from 2019",
  "what helps you actually fall asleep? tried everything",
  "been listening to 432hz rain sounds while coding, weirdly it helps me focus",
  "journaling before bed is the only thing that's worked for my anxiety this month",
  "what are you building this weekend? drop it below 👇",
  "finally got my first 10 users after 4 months of building solo 🎉",
  "rejected by app store for the third time. i'm so tired",
  "cursor wrote half my app and i still spent 6 hours debugging",
  "",
  "ok",
  "https://example.com @someone #tag"
];

test("intent: reads what a post is doing", () => {
  assert.equal(y.analyzeTweetIntent("what are you building this weekend? drop it below").primary, "invitation");
  assert.equal(y.analyzeTweetIntent("what helps you fall asleep?").primary, "question");
  assert.equal(y.analyzeTweetIntent("finally shipped v1 today 🎉").primary, "celebration");
  assert.equal(y.analyzeTweetIntent("so tired. couldn't sleep again").primary, "struggle");
  assert.equal(y.analyzeTweetIntent("new track out now, made this at night").primary, "share");
  assert.equal(y.analyzeTweetIntent("3am and still awake").lateNight, true);
});

test("anchors: picks up concrete details", () => {
  const sleepless = phrases("couldn't sleep again. 3am and my brain is replaying every conversation from 2019");
  assert.ok(sleepless.includes("3am"));
  assert.ok(sleepless.includes("2019"));
  assert.ok(phrases("finally got my first 10 users").includes("10 users"));
  assert.ok(phrases("spent 6 hours debugging").includes("6 hours"));
});

test("anchors: speak like a person (aliases) and never duplicate", () => {
  assert.ok(phrases("rejected by app store again").includes("app store rejection"));
  const journaling = phrases("journaling before bed with a journal");
  assert.equal(journaling.filter((phrase) => phrase.startsWith("journal")).length, 1);
  const misty = phrases("the misty forest level", y.musicLexicon);
  assert.ok(misty.includes("mist"));
  assert.ok(!misty.includes("misty"));
});

test("anchors: never more than four, never empty strings", () => {
  for (const post of SAMPLE_POSTS) {
    const found = phrases(post);
    assert.ok(found.length <= 4, post);
    found.forEach((phrase) => assert.ok(phrase.trim().length >= 2, post));
  }
});

test("echo: replies reference the anchor", () => {
  const { candidates } = y.buildEchoCandidates("3am and my brain is replaying 2019", "wellness");
  const echo = plain(candidates).filter((candidate) => candidate.tone.startsWith("echo ·") && candidate.tone !== "echo · answer");
  assert.ok(echo.length > 0);
  echo.forEach((candidate) => assert.ok(candidate.text.includes(candidate.anchor), candidate.text));
});

test("echo: real questions get answers, invitations do not", () => {
  const question = plain(y.buildEchoCandidates("what helps you actually fall asleep?", "wellness").candidates);
  assert.ok(question.some((candidate) => candidate.tone === "echo · answer"));
  const invitation = plain(y.buildEchoCandidates("what are you building? drop your project", "founder").candidates);
  assert.ok(!invitation.some((candidate) => candidate.tone === "echo · answer"));
});

test("dangling 'this' is penalized only when nothing is shared", () => {
  const confession = y.analyzeTweetIntent("couldn't sleep again");
  const share = y.analyzeTweetIntent("new track out now 🎧");
  assert.ok(y.danglingReferencePenalty("tried this with headphones", confession) > 0);
  assert.equal(y.danglingReferencePenalty("tried this with headphones", share), 0);
  assert.equal(y.danglingReferencePenalty("hope sleep finds you soon", confession), 0);
});

test("capEchoReplies: variety rules", () => {
  const items = [
    { text: "a", tone: "echo · time", anchor: "3am", template: "t1" },
    { text: "b", tone: "echo · time", anchor: "3am", template: "t2" },
    { text: "c", tone: "echo · time", anchor: "3am", template: "t3" },
    { text: "d", tone: "echo · year", anchor: "2019", template: "t1" },
    { text: "e", tone: "echo · year", anchor: "2019", template: "t4" },
    { text: "f", tone: "echo · year", anchor: "2019", template: "t5" },
    { text: "g", tone: "soft" },
    { text: "h", tone: "soft" }
  ];
  const picked = plain(y.capEchoReplies(items, 5, 3)).map((item) => item.text);
  assert.deepEqual(picked, ["a", "b", "e", "g", "h"]);
});

test("similarity: catches near-duplicates, ignores unrelated replies", () => {
  const reply = "the forest in this already has a sound. something low and slow underneath it.";
  assert.equal(y.replySimilarity(reply, reply), 1);
  assert.ok(y.replySimilarity(reply, "the cave in this already has a sound. something low and slow underneath it.") >= 0.6);
  assert.ok(y.replySimilarity(reply, "congrats on the launch, enjoy tonight") < 0.2);
  assert.equal(y.replySimilarity("", reply), 0);
});

test("people list: parses Grok's format and skips noise", () => {
  const people = plain(y.parsePeopleLines([
    "@hazzabdagazza | game composer | 2,056 | Sep 22, 2026 | https://x.com/hazzabdagazza/status/1 | Blended game scores, native clips",
    "",
    "Closest additional atmospheric posts:",
    "@myzzgames | game dev | 43 | Sep 23, 2026 | https://x.com/myzzgames/status/2 | Misty foggy mythic forest"
  ].join("\n")));
  assert.equal(people.length, 2);
  assert.deepEqual(
    { handle: people[0].handle, category: people[0].category, followers: people[0].followers, postDate: people[0].postDate, link: people[0].link },
    { handle: "@hazzabdagazza", category: "game composer", followers: "2,056", postDate: "Sep 22, 2026", link: "https://x.com/hazzabdagazza/status/1" }
  );
  assert.equal(people[1].followers, "43");
  assert.equal(people[1].mood, "Misty foggy mythic forest");
});

test("music: composer calls are detected and lead with at most two offers", () => {
  const result = y.buildMusicCandidates("we're looking for a composer for our folk horror game. DM me", "gamedev WIP", "curious listener");
  assert.equal(result.composerWanted, true);
  const offers = plain(result.candidates).filter((candidate) => candidate.tone === "composer offer" && candidate.score > 20);
  assert.equal(offers.length, 2);
});

test("replies: every generated set is short, unique and clean", () => {
  const banned = [...y.replyEngineRules.bannedPhrases];
  for (let round = 0; round < 5; round += 1) {
    for (const post of SAMPLE_POSTS.filter(Boolean)) {
      const wellness = plain(y.pickReplies(y.buildCandidateReplies(post, "need calm", "warm human", "base"), "base", post));
      const founder = plain(y.pickFounderReplies(y.buildFounderCandidateReplies(post, "solo founder", "peer-to-peer", "base", { linkMode: "auto", format: "text" }), "base", post));
      for (const set of [wellness, founder]) {
        assert.ok(set.length > 0 && set.length <= 5, post);
        assert.equal(new Set(set.map((reply) => reply.text)).size, set.length, post);
        set.forEach((reply) => {
          assert.ok(reply.text.length <= 220, reply.text);
          banned.forEach((phrase) => assert.ok(!reply.text.toLowerCase().includes(phrase), reply.text));
        });
      }
    }
  }
});

test("claude prompt: carries the post and the right link rule", () => {
  const wellness = y.buildClaudePrompt("3am again, can't sleep", "wellness", { category: "can't sleep", tone: "soft" });
  assert.ok(wellness.includes('"""3am again, can\'t sleep"""'));
  assert.ok(wellness.includes("no links"));
  const music = y.buildClaudePrompt("looking for a composer", "music", { linkMode: "none" });
  assert.ok(music.includes("indie game soundtracks"));
  assert.ok(!music.includes("https://"));
  const musicWithLink = y.buildClaudePrompt("looking for a composer", "music", { linkMode: "auto", portfolioUrl: "https://example.com/me" });
  assert.ok(musicWithLink.includes("https://example.com/me"));
});

test("text helpers: trimming and de-corporatizing", () => {
  const long = "a".repeat(300);
  assert.ok(y.trimToLimit(long, 180).length <= 180);
  assert.equal(y.trimToLimit("short", 180), "short");
  const cleaned = y.removeAiCadence("This resonates deeply. Great insight! Keep going!");
  assert.ok(!/resonates deeply|great insight|keep going/i.test(cleaned));
});
