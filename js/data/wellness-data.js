// Wellness / Yuna reply bank, categories, tones and search presets.

const categories = [
  "can't sleep",
  "overthinking",
  "burnout",
  "sadness",
  "soft internet",
  "need calm",
  "loneliness",
  "founder fatigue",
  "meditation",
  "app discovery"
];

const tones = [
  "soft",
  "warm human",
  "tiny poetic",
  "minimal",
  "Yuna voice",
  "indie founder",
  "gentle helpful"
];

const replyBank = {
  "can't sleep": {
    "soft": [
      "I hope the night gets a little less sharp soon. Even a few quiet breaths count as rest.",
      "Being awake when everything is quiet can feel so loud. I hope your body finds its way down gently."
    ],
    "warm human": [
      "That restless kind of tired is so real. Hope you can stop trying so hard for a minute and just be held by the dark.",
      "I know that feeling. Sometimes the kindest move is not forcing sleep, just making the room feel safer."
    ],
    "tiny poetic": [
      "May the night loosen its grip a little and let your thoughts land somewhere softer.",
      "Some nights arrive like waves. I hope one small breath becomes a shore."
    ],
    "minimal": [
      "Hope rest finds you soon, even in a small way.",
      "A softer night to you. No forcing, just easing."
    ],
    "Yuna voice": [
      "Maybe tonight is less about chasing sleep and more about giving your nervous system a dimmer switch.",
      "Try letting the night be simple for a moment: one breath, one softer thought, one less thing to solve."
    ],
    "indie founder": [
      "Sleep can feel impossible when your mind is still shipping thoughts. Hope you get one clean pause tonight.",
      "The brain loves a midnight backlog. Wishing you a small shutdown window and no extra self-blame."
    ],
    "gentle helpful": [
      "If sleep is far away, lowering the pressure can help. Resting still counts, even before you drift off.",
      "Maybe try making the goal smaller: not sleep yet, just a calmer body for the next few minutes."
    ]
  },
  "overthinking": {
    "soft": [
      "That loop can feel endless. I hope you get one quiet place inside it where you do not have to decide anything.",
      "Some thoughts ask for more attention than they deserve. Hope you can set one down for a little while."
    ],
    "warm human": [
      "Overthinking can feel like trying to protect yourself with a flashlight. Makes sense, and it is still exhausting.",
      "I get this. Sometimes the mind keeps rehearsing because it wants safety, not because you failed at calm."
    ],
    "tiny poetic": [
      "May the thought spiral become a small circle, then a dot, then room to breathe.",
      "Not every thought needs a verdict. Some can pass like weather through an open window."
    ],
    "minimal": [
      "You do not have to solve every thought tonight.",
      "A pause is allowed before the next answer."
    ],
    "Yuna voice": [
      "Maybe the gentlest reply to the loop is: I hear you, but I am not following you all night.",
      "When the mind gets loud, try choosing the next breath instead of the next conclusion."
    ],
    "indie founder": [
      "The mental tabs can multiply fast. Closing one tiny tab still counts as progress.",
      "Not every scenario needs a product review from your nervous system. Hope one thing can wait."
    ],
    "gentle helpful": [
      "It can help to name the loop without arguing with it: this is worry, and I can return to now.",
      "Maybe write the thought down once, then let your body know it does not need to keep carrying it."
    ]
  },
  "burnout": {
    "soft": [
      "Burnout has a way of making even simple things feel far away. Hope you can give yourself less to prove today.",
      "That kind of empty tired deserves tenderness, not a new task list."
    ],
    "warm human": [
      "This sounds like the kind of tired that sleep alone cannot fix. I hope you get real permission to go slower.",
      "I am sorry it feels this heavy. Burnout can make your own life feel hard to reach."
    ],
    "tiny poetic": [
      "May the part of you that has been carrying too much finally meet a softer pace.",
      "Even a candle needs oxygen. I hope you get a little space around the flame."
    ],
    "minimal": [
      "Less output. More oxygen. That counts.",
      "You are allowed to be done for today."
    ],
    "Yuna voice": [
      "Maybe the signal is not weakness. Maybe it is your system asking for a quieter way to continue.",
      "A gentle reset can be more honest than another push through."
    ],
    "indie founder": [
      "Burnout can make every tiny decision feel like a board meeting. Hope you can cancel a few internal meetings today.",
      "Building while depleted is such a strange tax. Wishing you one protected hour with no performance."
    ],
    "gentle helpful": [
      "If everything feels too much, choose the smallest repair first: water, food, a slower room, one postponed thing.",
      "A useful first step might be removing one demand, not adding one wellness task."
    ]
  },
  "sadness": {
    "soft": [
      "Sadness can take up the whole room sometimes. I hope you do not have to make it smaller to be understood.",
      "That sounds tender. Wishing you a little company inside it, even if the day stays heavy."
    ],
    "warm human": [
      "I am sorry. Some days just hurt in a way that does not need a silver lining.",
      "That kind of sadness deserves a real pause. Hope someone meets you gently there."
    ],
    "tiny poetic": [
      "May the heavy thing become a little less lonely in the light.",
      "Some feelings are rain with nowhere to go. I hope you find a dry corner soon."
    ],
    "minimal": [
      "No fixing. Just sending softness.",
      "That sounds heavy. I hope it eases."
    ],
    "Yuna voice": [
      "Maybe today does not need to become bright. Maybe it only needs one place where you can stop pretending.",
      "Let the feeling be real without making it your whole future."
    ],
    "indie founder": [
      "Hard to build or be visible when your heart is offline. Hope you can move gently and ignore the metrics for a bit.",
      "Some days the only honest roadmap is: feel it, hydrate, answer less."
    ],
    "gentle helpful": [
      "If you can, make the next hour smaller. A drink, a softer seat, one person who does not need a polished version.",
      "Sometimes naming it plainly helps: this is sadness, and I do not have to solve it all at once."
    ]
  },
  "soft internet": {
    "soft": [
      "The internet feels easier when people leave small gentle signals like this. Glad this corner exists.",
      "A softer timeline is such a relief. Tiny human notes can change the whole room."
    ],
    "warm human": [
      "This is the kind of internet I want more of. Low noise, real feeling, no performance required.",
      "I love when online spaces remember there are nervous systems behind the screens."
    ],
    "tiny poetic": [
      "A small soft post can feel like a lamp left on in the timeline.",
      "May the timeline keep a few quiet windows open for people who need air."
    ],
    "minimal": [
      "More of this kind of internet, please.",
      "Soft posts make the timeline easier to breathe in."
    ],
    "Yuna voice": [
      "This feels like a little pause button inside the scroll. Needed that.",
      "The timeline can be loud, but this has a quieter temperature."
    ],
    "indie founder": [
      "Tiny humane corners of the internet are still worth building for. This is a good reminder.",
      "The best online moments still feel handmade. This has that quality."
    ],
    "gentle helpful": [
      "This is a good reminder to choose slower inputs when the feed starts feeling like weather.",
      "A little softness in the scroll can help people come back to themselves."
    ]
  },
  "need calm": {
    "soft": [
      "Wishing you a little room between the feeling and the next thing you have to do.",
      "I hope calm reaches you in a small believable way, not as pressure to be perfectly okay."
    ],
    "warm human": [
      "That sounds like a lot for one nervous system. Hope you get a moment where nothing asks more of you.",
      "I hope your body gets the message that it is allowed to stand down, even just a little."
    ],
    "tiny poetic": [
      "May the noise lower by one shade and leave you enough quiet to breathe.",
      "A small calm can still be a doorway."
    ],
    "minimal": [
      "One breath is enough to begin.",
      "Small calm is still calm."
    ],
    "Yuna voice": [
      "Maybe the next step is not a solution. Maybe it is a softer inhale and one less urgent thought.",
      "Let the moment shrink until it fits in one breath."
    ],
    "indie founder": [
      "Not every moment needs a strategy. Sometimes the system just needs less input.",
      "A calm minute is underrated infrastructure."
    ],
    "gentle helpful": [
      "Try lowering the room by one notch: dim light, slower breath, fewer tabs, less pressure.",
      "If calm feels far away, start with safety cues: feet on floor, jaw unclenched, one longer exhale."
    ]
  },
  "loneliness": {
    "soft": [
      "Loneliness can be so quiet and so loud at the same time. I hope you feel reached, even a little.",
      "I hope the night gives you one small reminder that you are not as alone as it feels."
    ],
    "warm human": [
      "That ache is real. Sometimes being surrounded by people still does not touch the lonely part.",
      "I am glad you said it out loud. Loneliness gets heavier when it has to stay perfectly hidden."
    ],
    "tiny poetic": [
      "May one small thread of connection find its way through the quiet.",
      "Even the loneliest room can hold a little light under the door."
    ],
    "minimal": [
      "You are not strange for feeling this.",
      "Hoping connection reaches you gently."
    ],
    "Yuna voice": [
      "Maybe the first softness is not forcing the lonely feeling to disappear, just keeping it company.",
      "Let this be a tiny signal back: you are here, and that matters."
    ],
    "indie founder": [
      "Building things can be weirdly lonely, even in public. Hope you get a real human touchpoint today.",
      "The online room can be crowded and still feel empty. Wishing you one real conversation."
    ],
    "gentle helpful": [
      "If it feels possible, send one honest low-pressure message. Not to perform, just to make a thread.",
      "A small connection counts: a voice note, a walk near people, a text that says the real thing."
    ]
  },
  "founder fatigue": {
    "soft": [
      "Founder tired is a very specific kind of alone. I hope you can be a person before being a plan today.",
      "The building can wait for a breath. You are allowed to have edges."
    ],
    "warm human": [
      "This is so real. Carrying the vision and the tiny details can make your brain feel crowded all the time.",
      "I hope you get a moment where nobody needs certainty from you, including you."
    ],
    "tiny poetic": [
      "May the maker in you find a quiet table and put the weight down for a while.",
      "Even the person holding the map needs somewhere to rest."
    ],
    "minimal": [
      "You are more than the build.",
      "Pause the dashboard. Keep the person."
    ],
    "Yuna voice": [
      "Maybe the product does not need more of you tonight. Maybe you need more of you.",
      "A softer founder rhythm still counts as momentum."
    ],
    "indie founder": [
      "Solo building can make every unknown feel personal. It is not. Some fog is just fog.",
      "The tiny founder loop of build, doubt, ship, refresh is a lot. Hope you can step out for a bit."
    ],
    "gentle helpful": [
      "Try choosing one next action and one clear stop point. The stop point matters too.",
      "If the list is endless, pick the task that protects your energy first."
    ]
  },
  "meditation": {
    "soft": [
      "Meditation can be less about becoming calm and more about meeting yourself without flinching.",
      "A quiet minute is still a practice. You do not have to arrive anywhere dramatic."
    ],
    "warm human": [
      "I like this. The gentle version of practice is often the one people can actually return to.",
      "Some days sitting with yourself is brave enough. Calm does not have to be instant."
    ],
    "tiny poetic": [
      "The breath is small, but it knows the way back.",
      "A single inhale can be a little doorway out of the rush."
    ],
    "minimal": [
      "Return once. That is practice.",
      "The breath is enough to start."
    ],
    "Yuna voice": [
      "Maybe the point is not emptying the mind. Maybe it is learning not to believe every wave.",
      "A soft practice can begin with one honest exhale."
    ],
    "indie founder": [
      "Meditation is the rare reset that does not need a roadmap. Just enough attention to come back.",
      "A calmer nervous system is useful, but the real gift is being less at war with yourself."
    ],
    "gentle helpful": [
      "If sitting feels hard, try three slower exhales with your feet on the floor. That is a valid start.",
      "You can count five breaths and begin again whenever you lose track. Losing track is part of it."
    ]
  },
  "app discovery": {
    "soft": [
      "Finding a tool that feels quiet instead of demanding is such a relief. Hope you find one that meets you gently.",
      "The best wellness tools feel like a soft place to land, not another thing to keep up with."
    ],
    "warm human": [
      "I always appreciate tools that respect the mood I am already in. Calm design matters more than people think.",
      "A good app in this space should feel like support, not pressure. That is the bar for me."
    ],
    "tiny poetic": [
      "The right little tool can feel like a lamp for the pocket.",
      "Sometimes a small ritual in your hand can help the day change shape."
    ],
    "minimal": [
      "Quiet tools are underrated.",
      "A calmer interface can make a real difference."
    ],
    "Yuna voice": [
      "I am drawn to tools that help people soften without making self-care feel like homework.",
      "The best kind of calm tool does not ask you to become a new person first."
    ],
    "indie founder": [
      "The wellness apps I trust most feel carefully made and low-pressure. Less funnel, more feeling.",
      "App discovery is easier when the product has restraint. Calm is partly what it chooses not to ask."
    ],
    "gentle helpful": [
      "I would look for something private, simple, and easy to leave. A calm tool should not trap your attention.",
      "A useful filter: does it make your nervous system feel safer within the first minute?"
    ]
  }
};

const contextualReplies = [
  {
    words: ["432hz", "432 hz", "frequency", "delta waves", "theta waves", "binaural"],
    category: "meditation",
    score: 22,
    replies: [
      "this one actually slowed my brain down for a second.",
      "tried this kind of thing with headphones in the dark and it makes more sense there.",
      "felt the shift around the second layer. not dramatic, just noticeably quieter.",
      "late night frequency stuff is either nothing or suddenly the room changes a little."
    ]
  },
  {
    words: ["ambient", "soundscape", "sleep track", "headphones", "rain on window", "sound bath", "singing bowls"],
    category: "can't sleep",
    score: 22,
    replies: [
      "rain on window + this track honestly.",
      "late night headphone music hits different.",
      "this kinda became part of my sleep routine accidentally.",
      "the room feels different when the low layer comes in."
    ]
  },
  {
    words: ["felt this", "tonight", "quiet", "late night", "rain", "window", "headphones", "exhausted", "stillness", "small ritual"],
    category: "need calm",
    score: 21,
    replies: [
      "tried this with headphones in the dark honestly.",
      "rain on window + this tonight.",
      "this one slowed my brain down for a second.",
      "small rituals hit harder when you are already tired."
    ]
  },
  {
    words: ["mantra", "chant", "myth", "mythology", "story for sleep", "dreams"],
    category: "meditation",
    score: 20,
    replies: [
      "i like when mantra stuff feels lived-in, not like a lecture.",
      "myths before sleep make the night feel less flat somehow.",
      "this feels better when it is treated like a small ritual, not a whole personality.",
      "the story layer is what makes it stay with me a bit."
    ]
  },
  {
    words: ["breathwork", "box breathing", "slow exhales", "breathe through", "breathing exercise"],
    category: "need calm",
    score: 17,
    replies: [
      "slow exhales are annoyingly effective sometimes.",
      "i always forget how much the body changes before the mind does.",
      "this is the kind of thing that sounds too simple until you actually need it.",
      "one longer exhale can buy a tiny bit of room."
    ]
  },
  {
    words: ["sleep", "insomnia", "awake", "night"],
    category: "can't sleep",
    replies: [
      "if sleep is not here yet, even lying there softer counts a little.",
      "long nights make every thought louder. hope one thing gets quieter soon."
    ]
  },
  {
    words: ["tired", "exhausted", "drained"],
    category: "burnout",
    replies: [
      "That sounds like more than ordinary tired. Hope you can lower the demand instead of raising the effort.",
      "Your tiredness might be asking for protection, not productivity."
    ]
  },
  {
    words: ["anxious", "anxiety", "panic", "worried"],
    category: "need calm",
    replies: [
      "Anxiety can make the present feel too full. Hope the next breath gives you a little more room.",
      "Your body may just need a safety signal before it can hear reason."
    ]
  },
  {
    words: ["internet", "timeline", "scroll", "online"],
    category: "soft internet",
    replies: [
      "The scroll can get sharp fast. A softer corner of the internet really does matter.",
      "I hope your timeline gives you more room to breathe than to brace."
    ]
  },
  {
    words: ["burnout", "burned", "overworked"],
    category: "burnout",
    replies: [
      "Burnout is not a character flaw. It is often a long ignored message finally getting louder.",
      "Pushing harder is not always the brave thing. Sometimes stopping is."
    ]
  },
  {
    words: ["lonely", "alone", "isolated"],
    category: "loneliness",
    replies: [
      "That lonely feeling can be so heavy. I hope connection reaches you without you having to perform for it.",
      "You deserve contact that does not ask you to be brighter than you feel."
    ]
  },
  {
    words: ["quiet", "rest", "pause", "still"],
    category: "need calm",
    replies: [
      "Quiet can be a real form of care. Hope you get enough of it to hear yourself again.",
      "Rest is not empty time. It is where your system gets some of itself back."
    ]
  }
];

const searchPresets = [
  {
    category: "Quote Cemetery Detector",
    queries: [
      "(\"comment YES\" OR \"daily wisdom\" OR \"manifest abundance\" OR \"the universe will\") since:{since14}",
      "(\"write this before sleep\" OR \"high vibration only\" OR \"millionaire mindset\") since:{since14}"
    ]
  },
  {
    category: "Emotionally Alive Rooms",
    queries: [
      "(\"felt this\" OR \"honestly\" OR \"been thinking about this\") (quiet OR sleep OR exhausted OR calm) since:{since2} -filter:links",
      "(\"people actually\" OR \"same people\" OR mutuals OR regulars) (reply OR replies OR thread) since:{since14} -filter:links"
    ]
  },
  {
    category: "Late Night Calm",
    queries: [
      "(\"late night\" OR 2am OR 3am OR tonight) (quiet OR rain OR headphones OR breathe OR stillness) since:{since2} -filter:links",
      "(\"can't sleep\" OR \"wide awake\") (ambient OR window OR rain OR ritual OR headphones) since:{since2} -filter:links"
    ]
  },
  {
    category: "Mantra Culture",
    queries: [
      "(mantra OR mantras) (night OR headphones OR sleep OR ritual) since:{since14} -filter:links",
      "(\"this mantra\" OR \"mantra loop\" OR \"mantra music\") (calm OR sleep OR quiet) since:{since14} -filter:links"
    ]
  },
  {
    category: "432Hz / Frequency Culture",
    queries: [
      "(\"432hz\" OR \"432 Hz\" OR frequency) (headphones OR sleep OR ambient OR track) since:{since14} -filter:links",
      "(\"frequency music\" OR \"healing frequency\") (\"slowed my brain\" OR sleep OR night OR headphones) since:{since14} -filter:links"
    ]
  },
  {
    category: "Delta Waves",
    queries: [
      "(\"delta waves\" OR \"theta waves\") (sleep OR headphones OR night OR ambient) since:{since14} -filter:links",
      "(\"deep sleep music\" OR \"sleep frequencies\") (delta OR theta OR ambient) since:{since14} -filter:links"
    ]
  },
  {
    category: "Sound Healing",
    queries: [
      "(\"sound healing\" OR \"sound bath\") (headphones OR room OR tonight OR session) since:{since14} -filter:links",
      "(\"singing bowls\" OR \"crystal bowls\") (sleep OR ambient OR quiet OR calm) since:{since14} -filter:links"
    ]
  },
  {
    category: "Ambient Sleep Culture",
    queries: [
      "(\"sleep ambient\" OR \"ambient sleep\" OR \"sleep track\") (rain OR headphones OR night) since:{since7} -filter:links",
      "(\"rain on window\" OR \"headphones in the dark\" OR \"late night headphone music\") since:{since14} -filter:links"
    ]
  },
  {
    category: "Myth + Calm",
    queries: [
      "(mythology OR myth OR myths) (calm OR sleep OR mantra OR ambient) since:{since14} -filter:links",
      "(\"myths and stories\" OR \"dreams feel strange lately\") (night OR sleep OR calm) since:{since14} -filter:links"
    ]
  },
  {
    category: "Quiet Internet",
    queries: [
      "(\"quiet internet\" OR \"soft internet\" OR \"slow internet\" OR \"calm tech\") since:{since14} -filter:links",
      "(\"internet feels too loud\" OR \"tired of the timeline\") (quiet OR soft OR calm) since:{since14} -filter:links"
    ]
  },
  {
    category: "Low Ego Wellness",
    queries: [
      "(\"not a guru\" OR \"still figuring this out\" OR \"small ritual\") (calm OR meditation OR breath) since:{since14} -filter:links",
      "(\"tried this\" OR \"this helped a little\") (breathe OR sleep OR ambient OR mantra) since:{since14} -filter:links"
    ]
  },
  {
    category: "AI Companion Radar",
    queries: [
      "(\"gentle ai\" OR \"ai companion\") (calm OR sleep OR emotional OR lonely) since:{since14} -filter:links",
      "(\"ai friend\" OR \"ai companion\") (soft OR calm OR night OR mental health) since:{since14} -filter:links"
    ]
  }
];

const tonightSearches = [
  "(\"can't sleep\" OR \"wide awake\") (ambient OR rain OR headphones OR breath) since:{since2} -filter:links",
  "(\"late night\" OR 2am OR 3am) (ambient OR mantra OR frequency OR sleep track) since:{since2} -filter:links",
  "(\"rain on window\" OR \"headphones in the dark\" OR \"late night headphone music\") since:{since14} -filter:links",
  "(\"trying to breathe through it\" OR \"slow exhales\" OR \"box breathing\") since:{since7} -filter:links",
  "(\"dreams feel strange lately\" OR \"night thoughts\") (myth OR story OR sleep) since:{since7}",
  "(\"this track\" OR \"this one slowed my brain\") (sleep OR ambient OR headphones) since:{since14} -filter:links",
  "(\"432hz\" OR \"delta waves\" OR \"sound bath\") (tonight OR sleep OR headphones) since:{since14} -filter:links"
];
