# Yuna Reply Console

A calm little console for softer conversations on the internet.

Yuna Reply Console is a small local-first social gravity console for manually finding aligned X threads, mapping reply opportunities, and drafting thoughtful replies for `@inhaleexhaleapp`.

It does not connect to X, use the X API, post, like, follow, DM, or automate anything. Paste a tweet, choose a category and tone, generate suggestions, copy one, and post manually.

API-free and local-first. Yuna only opens doors: X search URLs, profile links, post links, scoring helpers, reply drafts, and local notes. You decide where to enter, what to copy, and what to post.

## Tabs

- Gravity Map: the primary workspace for scoring thread opportunity, reply culture, aesthetic match, freshness, account quality, and list fit before replying.
- Wellness / Yuna: the original soft wellness reply assistant, Search Radar, Tonight mode, favorites, used replies, and local history.
- Indie Founder: a separate builder-focused reply assistant for indie hackers, solo founders, no-code creators, app developers, and product makers. It has its own input, categories, tones, Search Radar, Indie Night Shift, favorites, used replies, and local history.

The Indie Founder tab also includes builder prompt replies for common X threads like "what are you building today?" so the creator can answer naturally without sounding salesy. These include lightly funny, emoji-friendly founder replies for distribution pain, app polishing, and public-building fatigue. Project links are only suggested for prompts that explicitly ask for a link or URL.

Human Texture Controls let Indie Founder replies switch between text, playful text, meme caption, and GIF cue modes. Link mode can be set to no link, auto link if asked, or include link.

## Social Gravity Mapping

The console now prioritizes finding where to exist online before generating replies. The Gravity Map is built around the question: "where should I emotionally exist online tonight?" It scores candidate threads from 0-100 using niche relevance, account quality, reply culture, visibility opportunity, freshness, and aesthetic alignment.

On launch, the console asks for a session intention. Map only and Looking keep reply generation at 0 unless deliberately bypassed. Reply soft allows 3 reply generations, and Full allows 5. Sessions expire after 6 hours and are archived locally.

Threads under 50 should be skipped. Threads over 70 are recommended gravity wells. Candidate accounts can be saved into local radar lists such as CalmTech, AmbientCreators, CozyInternet, DreamyUI, SlowInternet, IndieWellness, MythologyAndCalm, and GentleAI.

Account notes create a private local memory for handles, vibe clusters, reply culture impressions, and whether an account is worth watching again.

The wellness radar now focuses on emotionally alive calm-tech rooms instead of generic wellness SEO. It includes Quote Cemetery Detector, Emotionally Alive Rooms, Late Night Calm, Mantra Culture, 432Hz/Frequency Culture, Delta Waves, Sound Healing, Ambient Sleep Culture, Myth + Calm, Quiet Internet, and Low Ego Wellness clusters. Gravity scoring boosts active human reply culture, recurring people, emotional depth, late-night activity, ambient creators, mythology/mantra signals, soft/cozy internet, and low-ego builders while reducing score for quote spam, fake spirituality, hashtag-heavy affirmation loops, CTA spirituality, giant passive accounts, dead replies, and obvious promotion.

The Gravity Map includes a quote cemetery warning, recurring users count, emotional depth score, tone match, alive room score, and local recurring familiar account notes. It is meant to separate living calm internet rooms from recycled Pinterest-style wellness content before any reply is drafted.

The interface also carries a subtle Yuna signature layer: Quiet Gravity, Alive Room Index, Familiar Faces, Emotional Echo, Human Warmth, Soft Signal, and a small hidden soft rooms panel for reading the atmosphere of a thread without turning it into a growth dashboard.

## Reply Engine Style

The reply engine favors short, human-feeling replies over polished content. It avoids startup guru language, LinkedIn tone, engagement bait, therapy-speak, sales language, hashtags, and overly cinematic wellness copy.

Generated sets are shaped as: safest, warmer, slightly witty, mentor-aware, and ultra-short. Replies are designed to feel noticed, not written.

## Use locally

Open `index.html` directly in a browser. It works offline and stores history, favorites, and used replies in localStorage on the same browser.

The Search Radar sections include local preset X search queries for manual discovery. Date filters refresh automatically when the app opens, and Open in X uses X's Latest view. Use the copy button or open a search in X, then review and reply manually.

No build step, server, npm install, backend, external dependency, or API key is needed.
