# Yuna Reply Console

**Yuna Reply Console is a local-first reply companion for thoughtful conversations online.**

Not a bot.  
Not automation.  
Not an engagement farm.

`Open Source` `Local First` `Privacy Friendly` `No API Required` `Human-in-the-Loop`

Yuna Reply Console is a quiet local-first social gravity console for people who still want the internet to feel human. It helps you manually find aligned X threads, map reply opportunities, understand room culture, and draft softer replies for `@inhaleexhaleapp`.

It does not connect to X, use the X API, post, like, follow, DM, scrape, or automate anything. Paste a tweet, choose a category and tone, generate suggestions, copy one manually if it feels right, and stay fully in control.

Yuna only opens doors: X search URLs, profile links, post links, scoring helpers, reply drafts, local notes, and atmosphere signals. You decide where to enter, what to copy, and what to post.

## Screenshot

<!-- TODO: Add an app screenshot here once a screenshot file is committed to the repository. Do not reference an image path until the file exists. -->

## Privacy

Yuna Reply Console is designed to stay local and quiet:

- Runs entirely in the browser
- No accounts
- No tracking
- No cloud storage
- LocalStorage only
- No backend, external dependency, API key, or API connection required

History, favorites, used replies, radar notes, and session data stay in `localStorage` on the same browser where you use the console.

## Why This Exists

Online conversation can reward speed, volume, and performance. Yuna Reply Console exists for a calmer path: notice better conversations, pause before replying, and write with more care.

The goal is not to maximize engagement. The goal is to support healthier, more human communication: slower replies, better context, softer tone, and a little more intentionality before entering a conversation.

## Tabs

### Gravity Map

The primary workspace for scoring thread opportunity, reply culture, aesthetic alignment, freshness, account quality, and list fit before replying.

Built around one question:

> "where should I emotionally exist online tonight?"

The Gravity Map prioritizes finding where to exist online before generating replies.

### Wellness / Yuna

The original soft wellness reply assistant.

Includes:

- Search Radar
- Tonight Mode
- Favorites
- Used replies
- Local history
- Calm-tech discovery presets
- Mantra, ambient, and mythology clusters

Focused on emotionally alive calm-tech rooms instead of generic wellness SEO.

### Indie Founder

A separate builder-focused reply assistant for:

- Indie hackers
- Solo founders
- No-code creators
- App developers
- Product makers

Includes:

- Founder-focused Search Radar
- Indie Night Shift
- Founder-native tones
- Favorites
- Used replies
- Local history

Supports common founder thread archetypes like:

- "what are you building?"
- "drop your startup"
- "what did you ship today?"
- "building in public"
- "weekend build thread"

Replies are intentionally low-ego, short, human, slightly messy, and non-salesy. Project links are only suggested when a thread explicitly asks for them.

## Human Texture Controls

Human Texture Controls allow replies to shift between:

- Text
- Playful text
- Meme caption
- GIF cue

Link mode can be set to:

- No link
- Auto link if asked
- Include link

The goal is not polished content. The goal is believable human presence.

## Social Gravity Mapping

The console prioritizes signal over scale.

Threads are scored from 0-100 using:

- Niche relevance
- Reply culture
- Conversational depth
- Visibility opportunity
- Freshness
- Aesthetic alignment
- Reciprocal interaction potential

Low-score threads are usually better skipped in favor of smaller but human active rooms. High-score threads become gravity wells.

Candidate accounts can be saved into local radar lists such as:

- CalmTech
- AmbientCreators
- CozyInternet
- DreamyUI
- SlowInternet
- IndieWellness
- MythologyAndCalm
- GentleAI

Account notes create a private local memory for handles, vibe clusters, reply culture impressions, recurring familiar people, and whether an account is worth revisiting later.

## Wellness Radar

The wellness radar focuses on living calm internet rooms rather than recycled quote ecosystems.

Clusters include:

- Quote Cemetery Detector
- Human Active Rooms
- Late Night Calm
- Mantra Culture
- 432Hz / Frequency Culture
- Delta Waves
- Sound Healing
- Ambient Sleep Culture
- Myth + Calm
- Quiet Internet
- Low Ego Wellness

Gravity scoring boosts:

- Active human reply culture
- Recurring people
- Late-night activity
- Ambient creators
- Mythology/mantra signals
- Cozy internet behavior
- Low-ego builders

It reduces score for:

- Quote spam
- Fake spirituality
- Affirmation loops
- CTA spirituality
- Giant passive accounts
- Dead replies
- Obvious promotion

The goal is to separate living rooms from recycled Pinterest-style wellness content before any reply is drafted.

## Yuna Signature Layer

The interface carries a subtle atmosphere layer:

- Quiet Gravity
- Alive Room Index
- Familiar Faces
- Human Warmth
- Soft Signal
- Emotional Residue

A small hidden soft rooms panel exists for reading the atmosphere of a thread without turning the console into a growth dashboard.

## Reply Engine Style

The reply engine favors:

- Short replies
- Human-feeling cadence
- Low-ego phrasing
- Slight imperfection
- Conversational rhythm

It avoids:

- Startup guru language
- LinkedIn tone
- Engagement bait
- Therapy-speak
- Sales language
- Hashtags
- Over-polished optimism
- Overly cinematic wellness prose

Generated sets are shaped as:

- Safest
- Warmer
- Slightly witty
- Mentor-aware
- Ultra-short

Replies should feel noticed, not written.

## Session Intentions

On launch, the console asks for a session intention.

- Map Only
- Looking
- Reply Soft
- Full

Map-oriented modes intentionally limit reply generation unless deliberately bypassed. Sessions expire after 6 hours and are archived locally.

## Use Locally

Open `index.html` directly in a browser.

The console works offline and stores:

- History
- Favorites
- Used replies
- Local notes

inside `localStorage` on the same browser.

Search Radar sections include local preset X search queries for manual discovery. Open in X only generates manual X search URLs using Latest view.

No build step, server, npm install, backend, external dependency, or API key is needed.

## GitHub Pages

Because this is a static app, it can be published with GitHub Pages from the repository root:

1. Open the repository settings on GitHub.
2. Go to Pages.
3. Set the source to the main branch and the repository root.
4. Save the setting and wait for GitHub Pages to publish the site.

## Shortcut Launch Modes

iOS Shortcuts can open the local console with a mode parameter to prepare the right view without searching, fetching, posting, or automating anything.

- `/?mode=tonight`
- `/?mode=founder`
- `/?mode=wellness`
- `/?mode=gravity`

These modes only switch tabs, show a small local status pill, adjust microcopy, and prioritize local radar presets.

## Roadmap

- Accessibility improvements
- More localization
- Import/export settings
- Community-contributed reply styles
- Better documentation
