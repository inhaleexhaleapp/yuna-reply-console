// Music / Sound rooms, scene lexicon, reply bank and search presets.

const musicCategories = [
  "gamedev WIP",
  "looking for composer",
  "composer peer",
  "ambient / drone producer",
  "music release",
  "process / gear",
  "soundtrack talk"
];

const musicTones = [
  "curious listener",
  "fellow composer",
  "soft ambient",
  "gamedev fan",
  "ultra short"
];

const musicLexicon = [
  { kind: "scene", words: ["fog", "foggy", "mist", "misty", "forest", "woods", "ruins", "temple", "shrine", "cave", "caves", "snow", "snowy", "rain", "storm", "ocean", "sea", "shore", "desert", "steppe", "mountain", "mountains", "swamp", "marsh", "night", "moon", "moonlight", "lantern", "candle", "candles", "underwater", "abyss", "void", "graveyard", "cathedral", "village", "castle", "dungeon", "tower", "lighthouse", "island", "valley", "river", "lake", "ice", "fire", "embers", "dust", "sunset", "dawn", "dusk", "stars", "space", "wind"] },
  { kind: "instrument", words: ["cello", "violin", "viola", "piano", "felt piano", "synth", "synth pad", "pads", "choir", "vocals", "throat singing", "frame drum", "taiko", "drums", "duduk", "ney", "kalimba", "flute", "harp", "guitar", "bass", "strings", "brass", "music box", "singing bowl", "singing bowls", "field recording", "field recordings", "tape loop", "modular", "granular", "reverb", "drone", "bells", "organ", "oud", "baglama", "kanun"] },
  { kind: "genre", words: ["horror", "survival horror", "cozy", "soulslike", "metroidvania", "roguelike", "puzzle", "narrative", "walking sim", "folk horror", "dark fantasy", "mythic", "mythology", "folklore", "ritual", "melancholic", "liminal", "lofi", "ambient", "drone", "dark ambient", "ost", "soundtrack", "boss theme", "main theme", "menu music"] }
];

const musicEchoTemplates = {
  scene: {
    share: [
      "the {a} in this already has a sound. something low and slow underneath it.",
      "i can almost hear the {a} here. long reverb, one lonely cello.",
      "that {a} is doing so much work. would love to hear what it sounds like at night.",
      "okay the {a} atmosphere is beautiful. what are you using for audio so far?"
    ],
    any: [
      "{a} + a slow drone is my favorite combination in games.",
      "anything with {a} in it gets my full attention honestly."
    ]
  },
  instrument: {
    share: ["the {a} layer is the thing for me here.", "{a} is such an underrated texture for games.", "love how the {a} sits in the mix. very patient."],
    any: ["{a} never misses for me.", "more {a} everywhere, please."]
  },
  genre: {
    share: ["{a} done this quietly is so rare. following along.", "this is exactly the {a} mood i love."],
    any: ["{a} soundtracks are where the interesting stuff happens right now.", "{a} needs more patient music. glad people are making it."]
  }
};

const musicReplyBank = {
  "gamedev WIP": [
    "this looks like it already has a soundtrack in its head. what's the mood you're aiming for?",
    "the atmosphere here is lovely. is audio in yet or still silent?",
    "such a patient mood. following to see where it goes.",
    "the lighting alone tells a story. curious how it'll sound.",
    "this is the kind of screenshot that makes me want to open my daw."
  ],
  "looking for composer": [
    "hi! i make ambient, mythic and ritual-leaning music. would love to hear more about the mood you want.",
    "this sounds like a lovely project. i score quiet, atmospheric stuff. happy to send a short sketch if it helps.",
    "what references do you have in mind? i do fog-and-drone type atmospheres mostly.",
    "if you're open to ambient / dark folk textures, i'd love to be considered. no pressure either way."
  ],
  "composer peer": [
    "the space in this is beautiful. you're not afraid of silence, love that.",
    "that tail at the end. how long is the reverb on that?",
    "this would sit so well under a slow exploration scene.",
    "such a good texture. what are you layering underneath?"
  ],
  "ambient / drone producer": [
    "this is the good kind of slow.",
    "put this on and the room changed a little. thank you.",
    "love how nothing rushes here.",
    "that low end is so gentle. headphones recommended, clearly."
  ],
  "music release": [
    "congrats on putting it out. saving it for tonight.",
    "listening now. the opening already feels like a place.",
    "releasing ambient into the timeline takes courage lol. congrats.",
    "the cover and the sound match so well."
  ],
  "process / gear": [
    "love seeing the process side. what was the first layer you laid down?",
    "the simplest setups always make the most honest sounds.",
    "field recordings are half of my process too. where was this one from?",
    "this is the part nobody sees. thanks for sharing it."
  ],
  "soundtrack talk": [
    "the soundtracks that stay with me are always the ones that leave space.",
    "silence is an instrument in games and not enough people use it.",
    "hellblade's audio still lives in my head years later.",
    "the best game music makes you forget it's playing, then you miss it when it stops."
  ]
};

const musicToneOpeners = {
  "curious listener": ["oh this is lovely.", "okay, this mood.", ""],
  "fellow composer": ["composer brain says:", "love this.", ""],
  "soft ambient": ["quietly loving this.", "this is so calm.", ""],
  "gamedev fan": ["following this one.", "okay this looks special.", ""],
  "ultra short": [""]
};

const musicSearchPresets = [
  {
    category: "ScreenshotSaturday · atmosphere",
    queries: [
      "#ScreenshotSaturday (atmospheric OR fog OR foggy OR mythic OR moody OR melancholic) since:{since7} -filter:replies",
      "#ScreenshotSaturday (forest OR ruins OR temple OR cave OR snow OR lantern) since:{since7} -filter:replies",
      "#ScreenshotSaturday (cozy OR quiet OR peaceful) since:{since7} -filter:replies"
    ]
  },
  {
    category: "Looking for a composer",
    queries: [
      "(\"looking for a composer\" OR \"need a composer\" OR \"looking for music\" OR \"need music for my game\") since:{since14} -filter:replies",
      "(composer OR soundtrack) (#indiedev OR #indiegamedev) (\"looking for\" OR \"hiring\") since:{since14}"
    ]
  },
  {
    category: "Composer peers",
    queries: [
      "(#gamemusic OR #GameAudio OR #composer) (ambient OR atmospheric OR dark) since:{since7} -filter:replies",
      "(wip OR \"work in progress\") (soundtrack OR ost OR \"game music\") since:{since7} -filter:replies"
    ]
  },
  {
    category: "Ambient / drone rooms",
    queries: [
      "(#ambient OR #drone OR #ambientmusic OR #darkambient) since:{since7} -filter:replies -filter:links",
      "(ambient OR drone) (\"field recording\" OR \"tape loop\" OR modular OR granular) since:{since7} -filter:replies"
    ]
  },
  {
    category: "Myth · ritual · folklore",
    queries: [
      "(mythology OR folklore OR ritual) (game OR soundtrack OR ost) since:{since14} -filter:replies",
      "(\"folk horror\" OR \"dark folk\" OR \"ritual music\") since:{since14} -filter:replies"
    ]
  },
  {
    category: "Scene-scoring conversations",
    queries: [
      "(Hellblade OR Senua) (music OR soundtrack OR ost OR audio) since:{since14}",
      "(\"game soundtrack\" OR \"video game music\") (favorite OR underrated OR \"stays with me\") since:{since7} -filter:replies"
    ]
  }
];

const musicSaturdaySearches = [
  "#ScreenshotSaturday (atmospheric OR fog OR mythic) since:{since2} -filter:replies",
  "#ScreenshotSaturday (horror OR dark OR eerie) since:{since2} -filter:replies",
  "#ScreenshotSaturday (cozy OR quiet) since:{since2} -filter:replies",
  "(#indiegamedev OR #gamedev) (\"sound design\" OR \"no music yet\" OR \"placeholder music\") since:{since7}"
];

const musicStorageKey = "yunaMusicState";
