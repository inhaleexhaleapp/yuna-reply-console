// Indie Founder reply bank, archetypes and search presets.

const founderCategories = [
  "solo founder",
  "indie hacker",
  "build in public",
  "builder prompts",
  "no users yet",
  "launch day",
  "Product Hunt",
  "app store launch",
  "coding burnout",
  "vibe coding",
  "no-code",
  "founder loneliness",
  "revenue anxiety",
  "SaaS building",
  "mobile app founder",
  "shipping update",
  "creator monetization"
];

const founderTones = [
  "supportive founder",
  "calm builder",
  "soft indie",
  "X-native casual",
  "tiny encouragement",
  "practical helpful",
  "quietly rooting",
  "peer-to-peer",
  "ambient founder",
  "tired solo founder",
  "calm-tech builder",
  "low-energy late-night reply",
  "casual indie hacker",
  "slightly witty builder",
  "mentor-aware respect mode",
  "micro-update mode",
  "same-boat reciprocity mode",
  "exhausted shipping mode"
];

const founderProjectUrl = "https://inhaleexhale.app";

const founderReplyBank = {
  "solo founder": {
    "supportive founder": ["Solo building makes every tiny decision feel bigger. This is real work, even when nobody sees the tabs open."],
    "calm builder": ["One clear next step is enough today. Solo founders do not need to solve the whole map in one sitting."],
    "soft indie": ["There is something tender about building alone and still choosing to ship. quietly rooting for this."],
    "X-native casual": ["yeah solo building is a lot. every small win feels weirdly huge when it is just you in the room."],
    "tiny encouragement": ["tiny progress still counts, especially when you are the whole team."],
    "practical helpful": ["Maybe pick one thing that reduces friction for tomorrow. Solo momentum often comes from making the next step easier."],
    "quietly rooting": ["quietly rooting for this. solo building takes a specific kind of patience."],
    "peer-to-peer": ["I feel this. Solo founder mode turns every product decision into an internal meeting."]
  },
  "indie hacker": {
    "supportive founder": ["This is the part of indie hacking that looks small from the outside and heavy from the inside. Respect for staying with it."],
    "calm builder": ["The calm version is often enough: build the next useful thing, learn from the next signal, keep your pace."],
    "soft indie": ["Indie work has so much quiet faith inside it. Hope this keeps finding its people."],
    "X-native casual": ["this is very indie hacker coded. tiny bets, weird patience, lots of refreshes."],
    "tiny encouragement": ["small bets compound. this one counts."],
    "practical helpful": ["This seems like the kind of update worth turning into one clear lesson for future users too."],
    "quietly rooting": ["quietly rooting. The handmade internet needs more people who care this much."],
    "peer-to-peer": ["Same lane, same feelings. The waiting-for-signal part is underrated hard."]
  },
  "build in public": {
    "supportive founder": ["Building in public takes guts because the messy middle is always visible. This is the part nobody sees clearly enough."],
    "calm builder": ["A steady public build log is enough. You do not have to make every update sound like a breakthrough."],
    "soft indie": ["This kind of honest build note is useful. It makes the whole thing feel more human."],
    "X-native casual": ["love these real build updates. not polished, just useful signal."],
    "tiny encouragement": ["keep showing the small pieces. they add up."],
    "practical helpful": ["This is a good place to ask one specific question. Public building works best when the ask is tiny."],
    "quietly rooting": ["quietly rooting for the next update. The consistency is doing more than it looks like."],
    "peer-to-peer": ["Honestly the consistency is the product sometimes. People notice the steady builders."]
  },
  "builder prompts": {
    "supportive founder": [
      "building Inhale Exhale, a calm little app world for sleep, mantras, myths, and softer phone time. today is mostly polish and distribution panic.",
      "working on Yuna Reply Console now. it started as a reply helper and accidentally became a tiny social media cockpit.",
      "building calm tools and trying to survive the part where the product exists but the world has not received the memo yet 😅",
      "today’s mission: keep improving Inhale Exhale and pretend distribution is not the final boss."
    ],
    "calm builder": [
      "slowly building Inhale Exhale. the product is calm, the founder is negotiating with distribution.",
      "today is less glamorous: tightening small details, checking the flow, trying to make the internet feel a little less loud.",
      "building the calm app, then walking straight into the marketing battlefield with a tiny cup of courage.",
      "mostly polishing the quiet parts today. very peaceful product, mildly dramatic founder."
    ],
    "soft indie": [
      "building a quiet meditation and sleep app ecosystem with ambient sounds, myths, and a soft AI companion. very small team, very many tabs.",
      "making calm tech in the least calm way possible: alone, late, and with too many notes open.",
      "today i’m adding softness to the app and trying not to get emotionally defeated by distribution. balanced founder diet.",
      "building tiny calm rooms for people’s phones. meanwhile the founder is somewhere in act three of the launch movie."
    ],
    "X-native casual": [
      "a calm app ecosystem. today’s feature is convincing myself distribution is also a feature.",
      "built the thing. now doing the ancient founder ritual of making strangers aware it exists.",
      "working on the app and the part after the app, which rudely turns out to also be work.",
      "this is Sparta but for App Store screenshots and tiny marketing courage 😂",
      "today’s build: calm app polish. today’s boss fight: getting literally anyone to notice.",
      "currently in the founder scene where the product is done-ish and the distribution soundtrack gets intense."
    ],
    "tiny encouragement": [
      "tiny calm app things. distribution arc continues.",
      "shipping small softness today. marketing courage pending.",
      "small app win, tiny battle cry 🫡",
      "still building. slightly dramatic, but building."
    ],
    "practical helpful": [
      "working on Inhale Exhale and testing calmer ways to find the right people without turning it into growth-hack soup.",
      "today’s build is mostly making the manual social workflow cleaner: find the right thread, then reply like a person.",
      "today i’m improving the app and the manual discovery flow around it. less spam cannon, more finding the right rooms.",
      "building the product and the calmer distribution system around it. turns out both need UX."
    ],
    "quietly rooting": [
      "quietly building Inhale Exhale. sleep sounds, mantras, myths, Yuna, and a lot of tiny founder doubt in between.",
      "building calm tools and trying to get better at the uncomfortable part: letting people know they exist.",
      "building the soft app, then gently entering the arena of being perceived online 😅",
      "quietly working on Inhale Exhale today. the app is soft, the founder quest log is not."
    ],
    "peer-to-peer": [
      "i’m building Inhale Exhale. the app side is alive; now i’m wrestling the weird boss fight called distribution.",
      "mostly building a calmer app world and learning that shipping is only half the quest. rude discovery honestly.",
      "working on calm tech while learning that marketing is basically a side quest with emotional damage.",
      "building Inhale Exhale and Yuna stuff. product work is peaceful; getting seen on the internet is the battlefield part 😂"
    ]
  },
  "no users yet": {
    "supportive founder": ["No users yet is a brutal stage, but it is still a stage. The product is not a verdict on you."],
    "calm builder": ["The next move can be small: one clearer promise, one sharper user, one real conversation."],
    "soft indie": ["The quiet before users can feel so personal. Hope you can stay curious instead of crushed by it."],
    "X-native casual": ["yeah the zero-user phase is humbling. weirdly useful too, but still humbling."],
    "tiny encouragement": ["one real user can change the whole temperature."],
    "practical helpful": ["I would look for one person with the exact problem and ask what they tried last. That signal is gold."],
    "quietly rooting": ["quietly rooting for that first real user. That moment hits different."],
    "peer-to-peer": ["Been around this feeling. No users yet can make every pixel feel suspicious."]
  },
  "launch day": {
    "supportive founder": ["Launch day is such a strange mix of pride and refreshing. Hope you get to actually feel the milestone for a minute."],
    "calm builder": ["Whatever the numbers do, shipping changed the state of the project. That part is real."],
    "soft indie": ["A launch is a little door opening after a lot of quiet work. Hope good people walk through it."],
    "X-native casual": ["launch day nerves are so real. refresh, breathe, refresh again."],
    "tiny encouragement": ["you shipped. that matters."],
    "practical helpful": ["After the launch wave, write down the questions people ask most. That usually points to the next best iteration."],
    "quietly rooting": ["quietly rooting for this launch. Hope the right early people find it."],
    "peer-to-peer": ["That launch-day mix of adrenaline and doubt is familiar. Shipping is still the win."]
  },
  "Product Hunt": {
    "supportive founder": ["Product Hunt days can feel loud, but getting the work out there is still meaningful. Hope the right people notice it."],
    "calm builder": ["The PH spike is only one signal. Useful feedback after the noise is where the next version usually starts."],
    "soft indie": ["Hope today brings more real curiosity than empty metrics. That is the better kind of launch energy."],
    "X-native casual": ["PH day is a lot. tabs everywhere, tiny dopamine spikes, strange silence in between."],
    "tiny encouragement": ["big day. breathe between refreshes."],
    "practical helpful": ["Save every useful comment today. Tomorrow-you will want the patterns, not just the ranking."],
    "quietly rooting": ["quietly rooting for the launch. Hope it finds the builders who need it."],
    "peer-to-peer": ["The leaderboard can get noisy fast. The real win is finding a few people who genuinely care."]
  },
  "app store launch": {
    "supportive founder": ["App store launch is a different kind of vulnerable. So much quiet work behind one little listing."],
    "calm builder": ["Once it is live, the next calm move is watching where people hesitate and tightening that first minute."],
    "soft indie": ["There is a tiny magic to seeing your app out in the world. Hope you get to enjoy that part."],
    "X-native casual": ["app store launch hits different. one listing, a thousand tiny decisions behind it."],
    "tiny encouragement": ["live in the store is a real milestone."],
    "practical helpful": ["Screenshots, first sentence, and first session matter a lot here. Small clarity upgrades can move the needle."],
    "quietly rooting": ["quietly rooting for the app to find its first true fans."],
    "peer-to-peer": ["That first store version always feels both finished and unfinished. Totally normal."]
  },
  "coding burnout": {
    "supportive founder": ["Shipping while tired is underrated hard. Hope you can protect the builder, not just the build."],
    "calm builder": ["A tired brain is not a bad brain. It may just need a smaller problem and a clean stopping point."],
    "soft indie": ["The code can wait for a rested version of you. The product needs that person too."],
    "X-native casual": ["debugging with a fried brain is a special kind of nonsense. been there."],
    "tiny encouragement": ["rest is part of the build loop."],
    "practical helpful": ["Leave yourself one clear note before stopping. Future-you deserves a softer handoff."],
    "quietly rooting": ["quietly rooting for you to close the laptop before the laptop wins."],
    "peer-to-peer": ["The hardest bug is sometimes knowing when to stop staring at the bug."]
  },
  "vibe coding": {
    "supportive founder": ["Vibe coding can be messy, but it also gets ideas out of your head fast. The taste still has to lead."],
    "calm builder": ["The calm move is to let the vibe explore, then let your judgment clean up the edges."],
    "soft indie": ["There is something fun about making the idea visible before it gets overthought."],
    "X-native casual": ["vibe coding is fun until the vibes create a second mystery app inside the first one."],
    "tiny encouragement": ["ship the vibe, then tidy the edges."],
    "practical helpful": ["After the fast pass, write down what the app is actually supposed to do. That keeps the vibe from wandering."],
    "quietly rooting": ["quietly rooting for tasteful vibes and fewer surprise regressions."],
    "peer-to-peer": ["The trick is knowing when the prototype became a product-shaped creature with responsibilities."]
  },
  "no-code": {
    "supportive founder": ["No-code still takes product taste, patience, and real user understanding. The tool does not remove the hard part."],
    "calm builder": ["A no-code build can be a perfectly valid first version. Clarity beats stack pride."],
    "soft indie": ["I like when tools let people test an idea without asking permission from complexity first."],
    "X-native casual": ["no-code discourse is noisy. users mostly care if the thing works."],
    "tiny encouragement": ["valid build, valid signal."],
    "practical helpful": ["If the workflow is clear, the stack can stay boring. The user problem is the main event."],
    "quietly rooting": ["quietly rooting for the useful thing, whatever stack got it there."],
    "peer-to-peer": ["Honestly, shipping the testable version matters more than winning a stack argument."]
  },
  "founder loneliness": {
    "supportive founder": ["Founder loneliness is real. Carrying the uncertainty alone can make even small choices feel heavier."],
    "calm builder": ["You are allowed to find a peer before you find the perfect answer. This is easier with another builder nearby."],
    "soft indie": ["Hope you get one honest founder conversation that does not require performing confidence."],
    "X-native casual": ["yeah, building alone can make the internet feel crowded and still weirdly quiet."],
    "tiny encouragement": ["you do not have to hold every unknown alone."],
    "practical helpful": ["A tiny founder circle can help a lot. Even one weekly check-in changes the texture."],
    "quietly rooting": ["quietly rooting for you to find your builder people."],
    "peer-to-peer": ["This is one of the less visible costs of building. The uncertainty gets loud when it has no witness."]
  },
  "revenue anxiety": {
    "supportive founder": ["Revenue anxiety can make every metric feel personal. It is data, not a full identity review."],
    "calm builder": ["A calmer lens: one offer, one audience, one reason to pay. Then listen hard."],
    "soft indie": ["Money pressure can make the whole project feel sharper. Hope you can keep your judgment gentle."],
    "X-native casual": ["revenue brain is wild. one quiet dashboard and suddenly everything feels existential."],
    "tiny encouragement": ["one honest paying user can change the room."],
    "practical helpful": ["Try separating traffic, activation, and willingness to pay. The anxiety gets smaller when the question is specific."],
    "quietly rooting": ["quietly rooting for clearer signal and less dashboard dread."],
    "peer-to-peer": ["I know this loop. Refreshing does not create revenue, but it sure feels like a ritual."]
  },
  "SaaS building": {
    "supportive founder": ["SaaS building is a lot of invisible plumbing before anything looks impressive. This is still progress."],
    "calm builder": ["Reliable and boring is underrated in SaaS. A calm product that works is already a strong signal."],
    "soft indie": ["There is care in the unglamorous parts too. The quiet backend work counts."],
    "X-native casual": ["SaaS is mostly tiny edge cases wearing a trench coat. respect."],
    "tiny encouragement": ["boring progress is progress."],
    "practical helpful": ["If retention matters, the next best question might be what users repeat without thinking."],
    "quietly rooting": ["quietly rooting for the unsexy parts to compound."],
    "peer-to-peer": ["Every simple SaaS has a hidden basement of decisions. People rarely see that part."]
  },
  "mobile app founder": {
    "supportive founder": ["Mobile app building has so many little gates. Respect for pushing through the parts users never notice."],
    "calm builder": ["The first session matters a lot on mobile. One calmer onboarding step can change the feel fast."],
    "soft indie": ["A good mobile app feels small in the hand but carries so many decisions. Hope yours finds its rhythm."],
    "X-native casual": ["mobile app founder life is screenshots, edge cases, and app review suspense."],
    "tiny encouragement": ["small screen, real milestone."],
    "practical helpful": ["Watch the first tap after install. That moment tells you more than a long feature list."],
    "quietly rooting": ["quietly rooting for the app to land softly with the right users."],
    "peer-to-peer": ["The store, the screenshots, the onboarding, the bugs. Mobile makes every detail show up."]
  },
  "shipping update": {
    "supportive founder": ["Good shipping update. It is easy to underestimate how much discipline sits behind a small changelog."],
    "calm builder": ["A clear shipped note is enough. The work does not need fireworks to be real."],
    "soft indie": ["This feels like the nice kind of progress: specific, useful, quietly earned."],
    "X-native casual": ["nice ship. small update, real momentum."],
    "tiny encouragement": ["shipped is shipped."],
    "practical helpful": ["This would be even stronger with the user problem it improves. People remember the before and after."],
    "quietly rooting": ["quietly rooting for the next small ship too."],
    "peer-to-peer": ["The consistency behind these updates is the impressive part."]
  },
  "creator monetization": {
    "supportive founder": ["Creator monetization is tricky because the work is personal and the business is real. Both parts deserve care."],
    "calm builder": ["The cleanest offer usually respects the audience and the creator. That balance is hard but worth it."],
    "soft indie": ["Hope this becomes a way to support the work without making the work feel less yours."],
    "X-native casual": ["monetizing creative work is such a weird emotional spreadsheet."],
    "tiny encouragement": ["getting paid for the work can be gentle too."],
    "practical helpful": ["A simple paid layer that saves time or creates closeness is often easier to understand than a huge bundle."],
    "quietly rooting": ["quietly rooting for revenue that does not flatten the creative part."],
    "peer-to-peer": ["The hard bit is making the offer clear without making the relationship feel transactional."]
  }
};

const builderPromptWords = [
  "what are you building",
  "building today",
  "drop your startup",
  "drop in the replies",
  "drop below",
  "drop your project",
  "drop your project url",
  "drop your link",
  "drop the link",
  "drop your product",
  "promote your project",
  "what did you ship",
  "what are you shipping",
  "shipping right now",
  "share your saas",
  "what are you working on",
  "what are you working on today",
  "show me what you are building",
  "show me what you're building",
  "show me what you're working on",
  "share your project",
  "share your project link",
  "project link below",
  "project url below",
  "link below",
  "weekend builders",
  "weekend build thread",
  "support each other",
  "what are you launching",
  "what did you build",
  "who is still awake coding",
  "who's still awake coding",
  "reply with what"
];

const projectLinkPromptWords = [
  "project url",
  "project link",
  "drop your link",
  "drop the link",
  "drop your project url",
  "drop your project link",
  "drop your product",
  "share your project link",
  "share your project url",
  "link below",
  "url below",
  "drive some traffic"
];

const founderProjectLinkReplies = [
  `building a small calm audio thing for sleep/mantras/myths. still figuring distribution out lol ${founderProjectUrl}`,
  `trying to make sleep sounds less artificial. tiny app world, very real founder tabs: ${founderProjectUrl}`,
  `my project is Inhale Exhale. not another productivity app, thankfully. ${founderProjectUrl}`,
  `late night ambient experiments + a calm app around them. link since this thread asked: ${founderProjectUrl}`,
  `helps me stop doomscrolling at least. building it into a small calm app world: ${founderProjectUrl}`
];

const founderFormatReplies = {
  playful: [
    "building calm tools and entering the visibility arena with one screenshot and unreasonable hope 😂",
    "today’s build is app polish plus distribution courage. very normal founder cardio 😅",
    "working on Inhale Exhale. soft product, dramatic marketing side quest, many tabs open.",
    "building the calm thing while the founder soundtrack is clearly boss fight music."
  ],
  meme: [
    "meme caption: when the app is calm but the distribution plan is doing parkour.",
    "meme caption: solo founder enters the marketing arena with one screenshot and no shield.",
    "meme caption: the product is soft, the launch dashboard is not.",
    "meme caption: me explaining calm tech while fighting the visibility boss."
  ],
  gif: [
    "gif cue: tired founder entering final boss room. reply: building calm tools; distribution arc continues 😅",
    "gif cue: tiny hero walking into a huge arena. reply: app polish today, visibility battle ongoing.",
    "gif cue: dramatic movie walk. reply: building Inhale Exhale and trying to be perceived online 😂",
    "gif cue: calm music over battlefield footage. reply: the app is peaceful; the founder quest is not."
  ]
};

const founderModeReplies = {
  "ambient founder": [
    "building a small calm audio thing. mostly late night layers and tiny fixes rn.",
    "trying to make sleep sounds less artificial. weirdly hard, worth it though.",
    "late night ambient experiments today. the app is calmer than the founder, obviously.",
    "not another productivity app. just trying to make the phone feel less loud."
  ],
  "tired solo founder": [
    "solo today. again at 3am, because apparently that is the schedule now.",
    "small wins. one fix, three new questions, classic.",
    "still figuring this out. the product is moving, the founder is buffering.",
    "good enough for tonight. future me can judge it with coffee."
  ],
  "calm-tech builder": [
    "building calm tech without turning it into guru soup. harder than expected.",
    "trying to make the app quieter, not more addictive. tiny distinction, big rabbit hole.",
    "helps me stop doomscrolling at least. calling that early user research lol.",
    "small calm tool, many uncalm tabs."
  ],
  "low-energy late-night reply": [
    "yeah. late night builder tax.",
    "same boat. brain stopped sprinting for like 4 minutes.",
    "felt this. too tired to phrase it better.",
    "this is very real. unfortunately."
  ],
  "casual indie hacker": [
    "lol yeah. tiny ship, tiny panic.",
    "idk, feels like half the job is explaining the thing exists.",
    "same boat. shipping is easier than being perceived.",
    "founder math is weird. one small fix can eat the whole night."
  ],
  "slightly witty builder": [
    "finally got this working and immediately found the next thing broken. tradition.",
    "the rabbit hole has a basement, apparently.",
    "late night builder tax has been paid.",
    "good enough for tonight is a valid product management strategy."
  ],
  "mentor-aware respect mode": [
    "respect this. especially the part where you kept it specific.",
    "fair. this is the kind of note that saves another builder a little time.",
    "respect the honesty here. no need to wrap it in founder theater.",
    "yeah, this is useful because it is not trying to sound huge."
  ],
  "micro-update mode": [
    "shipped a tiny fix. tiny, but real.",
    "small update today. nothing dramatic, it just works better now.",
    "finally got this working. not glamorous. still counts.",
    "one small win and only a mild new rabbit hole."
  ],
  "same-boat reciprocity mode": [
    "same boat. still figuring this out too.",
    "yeah same. tiny progress, weird amount of feelings.",
    "felt this. building alone makes every reply feel louder.",
    "same here. product work is one thing, distribution is another creature."
  ],
  "exhausted shipping mode": [
    "shipping while tired is such a specific sport.",
    "good enough for tonight. ship it, sleep maybe.",
    "tiny fix shipped. brain has left the meeting.",
    "this is the part where the changelog looks small and the effort was not."
  ]
};

const founderArchetypeReplies = {
  "drop prompt": [
    "building a small calm audio thing. still figuring out how to explain it without sounding like an app store paragraph lol",
    "trying to make sleep sounds less artificial. tiny product, large distribution side quest.",
    "not another productivity app. more like: stop doomscrolling, breathe, maybe sleep.",
    "working on Inhale Exhale. calm app, messy founder tabs, good enough for tonight."
  ],
  "what building": [
    "today? small fixes, ambient experiments, and pretending distribution is not its own product.",
    "building calm audio stuff. also the part where i learn to be visible online, unfortunately.",
    "app polish and one tiny social media cockpit. idk how that became my day but here we are.",
    "sleep sounds, little UI fixes, and the ongoing war against artificial calm."
  ],
  "shipping": [
    "shipped a tiny fix. not dramatic. it just bothered me enough.",
    "finally got this working. naturally it revealed the next thing.",
    "small win today. good enough for tonight.",
    "tiny ship. still counts, even if the changelog looks extremely unimpressed."
  ],
  "build public": [
    "building in public is mostly posting the parts i would rather pretend were smoother.",
    "trying to keep the updates real. no fake launch fireworks today.",
    "small update, small doubt, small win. very founder-coded.",
    "still showing the messy middle. probably useful. slightly uncomfortable."
  ],
  "late coding": [
    "still awake. late night builder tax has been paid.",
    "debugging at night is how normal bugs become psychological events.",
    "same boat. brain stopped sprinting but the bug did not.",
    "good enough for tonight is starting to sound wise, which is suspicious."
  ],
  "promo": [
    "building a small calm app. trying to mention it without turning into a marketing villain.",
    "tiny calm audio thing. sleep, ambient, mantras. distribution remains the boss fight.",
    "working on something that helps me stop doomscrolling at least. that was the first user story lol.",
    "calm app, soft sounds, very uncalm founder learning how visibility works."
  ]
};

const founderContextualReplies = [
  {
    words: builderPromptWords,
    category: "builder prompts",
    score: 22,
    replies: [
      "building a small calm audio thing. still figuring out the distribution part lol",
      "trying to make sleep sounds less artificial. tiny product, too many tabs.",
      "working on Yuna Reply Console. it was a reply helper and somehow became a social cockpit.",
      "today: app polish, tiny fixes, and the visibility side quest.",
      "small calm app work. founder battlefield remains active 😂",
      "not another productivity app. mostly sleep sounds, ambient experiments, and a lot of notes."
    ]
  },
  {
    words: ["who is still awake coding", "who's still awake coding", "3am", "2am", "late night", "debugging at night", "still awake coding"],
    category: "coding burnout",
    score: 24,
    replies: [
      "still awake. late night builder tax has been paid.",
      "debugging at night is how normal bugs become psychological events.",
      "same boat. brain stopped sprinting but the bug did not.",
      "good enough for tonight is starting to look like strategy."
    ]
  },
  {
    words: ["what did you ship", "what are you shipping", "finally shipped", "shipped today", "small win", "weekend build thread"],
    category: "shipping update",
    score: 20,
    replies: [
      "shipped a tiny fix. tiny, but real.",
      "finally got this working. naturally it revealed the next thing.",
      "small win today. good enough for tonight.",
      "tiny ship. still counts."
    ]
  },
  {
    words: ["same boat", "anyone else", "solo founder", "building solo", "indie founder"],
    category: "solo founder",
    score: 19,
    replies: [
      "same boat. still figuring this out too.",
      "yeah same. tiny progress, weird amount of feelings.",
      "building alone makes every small reply feel louder.",
      "solo founder math is strange. one small win can carry the day."
    ]
  },
  {
    words: ["solo", "alone", "only founder"],
    category: "solo founder",
    replies: [
      "solo building makes every small win feel bigger. quietly rooting for this.",
      "It is a lot to be the whole team and still keep the product moving."
    ]
  },
  {
    words: ["launch", "launched", "launching", "product hunt"],
    category: "launch day",
    replies: [
      "you shipped. Whatever happens next, the project is in the world now.",
      "Launch days are a weird blend of pride and refresh anxiety. Hope the right people find it."
    ]
  },
  {
    words: ["no users", "zero users", "first user", "users yet"],
    category: "no users yet",
    replies: [
      "that first user hits different. Hope the next signal is a real one.",
      "The no-users-yet stage is loud in its own way. Still not a verdict."
    ]
  },
  {
    words: ["tired", "burnout", "burned out", "exhausted", "debugging"],
    category: "coding burnout",
    replies: [
      "shipping while tired is underrated hard. The builder needs maintenance too.",
      "A clean stop point can be the most useful feature tonight."
    ]
  },
  {
    words: ["mrr", "revenue", "customer", "stripe", "payment", "paid"],
    category: "revenue anxiety",
    replies: [
      "money signal can make everything feel intense. Still, one real payment is a real clue.",
      "Revenue makes the dashboard louder, but it also gives you something concrete to learn from."
    ]
  },
  {
    words: ["app store", "review", "rejected", "mobile app"],
    category: "mobile app founder",
    replies: [
      "app review suspense is its own founder side quest. hope it clears soon.",
      "Mobile makes every little gate feel bigger. Still a real milestone."
    ]
  },
  {
    words: ["vibe coding", "ai built", "cursor", "lovable"],
    category: "vibe coding",
    replies: [
      "vibe coding gets the idea moving fast. taste still does the steering.",
      "The fun part is getting it alive. The founder part is deciding what it should become."
    ]
  }
];

const founderSearchPresets = [
  { category: "solo founder", queries: ["(\"solo founder\" OR \"building solo\" OR \"solo builder\") (app OR indie) since:{since7}", "(\"indie founder\" OR \"solo app\") since:{since7} -filter:links"] },
  { category: "build in public", queries: ["(\"build in public\" OR \"building in public\") since:{since7} -filter:links", "(\"finally shipped\" OR \"just shipped\") since:{since7} -filter:links"] },
  { category: "builder prompts", queries: ["(\"drop your project\" OR \"drop your project URL\" OR \"drop your link\") since:{since7} -filter:links", "(\"share your project link\" OR \"project link below\" OR \"link below\") since:{since7} -filter:links", "(\"what are you shipping right now\" OR \"what are you building\" OR \"what are you working on today\") since:{since7} -filter:links", "(\"weekend builders\" OR \"solo founders\" OR \"support each other\") (project OR link OR building) since:{since7} -filter:links"] },
  { category: "no users yet", queries: ["(\"no users yet\" OR \"zero users\") since:{since7} -filter:links", "(\"first user\" OR \"first paying customer\") since:{since14} -filter:links"] },
  { category: "launch day", queries: ["(\"launching today\" OR \"I made an app\") since:{since7} -filter:links", "(\"Product Hunt\" \"launched\") since:{since14} -filter:links"] },
  { category: "app store launch", queries: ["(\"app store launch\" OR \"app store release\" OR \"live on app store\" OR \"just shipped\") since:{since7}", "(\"waiting for app review\" OR \"rejected by app store\") since:{since14} -filter:links"] },
  { category: "late build", queries: ["(\"late night\" OR 2am OR 3am) (build OR shipping OR coding OR rendering OR \"working on\") since:{since7}", "(\"late night shipping\" OR \"debugging at night\") since:{since7} -filter:links"] },
  { category: "no-code / vibe coding", queries: ["(\"no-code\" OR nocode OR \"no code\") (build OR shipping OR app) since:{since7}", "\"vibe coding\" since:{since14} -filter:links"] },
  { category: "SaaS / revenue", queries: ["(\"MRR\" \"solo founder\" OR \"Stripe\" \"first payment\") since:{since14} -filter:links", "(\"SaaS\" \"launched\" OR \"working on my startup\") since:{since14} -filter:links"] },
  { category: "mobile app founder", queries: ["(\"mobile app\" \"founder\" OR \"building my app\") since:{since7} -filter:links", "(\"app store launch\" OR \"app store release\") (solo OR indie) since:{since14}"] },
  { category: "creator monetization", queries: ["\"creator monetization\" since:{since14} -filter:links", "(\"one time\" OR \"no ads\") (app OR creator OR indie) since:{since14}"] },
  { category: "Yuna crossover", queries: ["(\"meditation app\" OR calm) (solo OR indie OR founder) since:{since14}", "(\"gentle ai\" OR \"ai companion\") (calm OR sleep OR meditation) since:{since14}"] }
];

const founderNightSearches = [
  "\"late night shipping\" since:{since7} -filter:links",
  "\"debugging at night\" since:{since7} -filter:links",
  "\"waiting for app review\" since:{since7} -filter:links",
  "\"can't sleep\" \"startup\" since:{since7} -filter:links",
  "\"almost gave up\" \"building\" since:{since14} -filter:links",
  "\"still building\" since:{since7} -filter:links",
  "\"small win\" \"founder\" since:{since14} -filter:links",
  "\"finally fixed the bug\" since:{since7} -filter:links"
];
