/* Content from http://warriorcomics.com/character
   Images are the same character art used in Avtar.tsx (Avatarman uses the
   hero image). Edit text / order / side / tone / fire here — the layout follows. */

const BASE = "/images/Avtar";

/* Background artwork, one per chapter (cycles if there are more chapters).
   They are blended with the chapter colour so they follow the theme. */
export const BG_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxO4tfRUQOJSmO6DCfcUrkhJxCcXRL93GcoIQVI0AsQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCoxFObAygGfRJRXiwkSJYjyaOYBqU_wHSQguGW_7iBQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzadcBVFRLX430PHd7dctCI6zmflQIbMphpFpu9NvtXQ&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1uuWKZKJqpxGKywwoul8UCsX6YlM8VlpM04MWmLTC9w&s=10",
];

export type Block = { h?: string; t: string; cta?: { label: string; href: string } };
export type Extra = { title: string; text?: string };

export type Chapter = {
  id: string;
  kicker: string; // small line above the title (typed)
  title: string; // typed on scroll
  sub?: string; // typed after the title
  ghost: string; // giant outlined word behind the scene
  tone: 0 | 1; // 0 = dark forge, 1 = pale parchment
  fire: number; // 0..1 how hard the fire burns in this chapter
  img?: string;
  side: 1 | -1; // 1 = art on the right, -1 = art on the left
  len: number; // scroll length of this chapter, in screens
  blocks: Block[];
  extras: Extra[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: "intro",
    kicker: "",
    title: "WC-Originals",
    sub: "Experience the world which is full of fascinating characters, intriguing stories, and an eye-catching animations.",
    ghost: "WC",
    tone: 0,
    fire: 1,
    side: 1,
    len: 2.4,
    blocks: [
      {
        h: "What is WC Universe?",
        t: "In WC Universe, you will be traveling to an outstanding and unforgettable animation arena. This creative hub will have Virtual Heroes, Villains, Queens, Emperors, Powers, Wars, and an astonishing Empire.",
      },
      {
        t: "This leading edge platform is diverse and you are just a click away from an extraordinary pack. Go ahead, this is an open world for creators who are artistic, imaginative, you can come, collaborate here, show your creativity and of course will be honored because we believe in “RESPECTING CREATIVITY”.",
      },
      {
        t: "For filmmakers and other entertainment industry enthusiast, our hands are open for you, join us, you can lease our characters, advertise your products and work with WC.",
        cta: { label: "Watch WC-Originals", href: "https://www.youtube.com/watch?v=dBmpjAwpmxc" },
      },
    ],
    extras: [],
  },
  {
    id: "sentor",
    kicker: "Chapter 01",
    title: "Sentor",
    ghost: "Sentor",
    tone: 0,
    fire: 1,
    img: `${BASE}/sentor-1.png`,
    side: 1,
    len: 1.9,
    blocks: [
      {
        t: "He is an enemy of Avatarman. Possess technological and semi magical skills making him equally powerful like Avatarman.",
      },
      {
        t: "His cube is his power. The glistening bright blue color and energy from cube is having unimaginable power.",
      },
      {
        t: "His luminescent silvery sword is his favorite weapon and his accuracy with it is remarkable. He also has time watch allowing him time travel and teleportation activities.",
      },
    ],
    extras: [{ title: "Enemy of Avatarman" }],
  },
  {
    id: "avatarman",
    kicker: "Chapter 02",
    title: "Avatarman",
    sub: "Aka Maxwell Meronius",
    ghost: "Avatarman",
    tone: 1,
    fire: 0.35,
    img: `${BASE}/avtarman1.png`,
    side: -1,
    len: 2.3,
    blocks: [
      {
        t: "Avatarman, aka Maxwell Meronius, born on Jan 3, 2050, is the son of Merlyn Meronius and Petra Meronius. He is intelligent, charming and ageless.",
      },
      {
        t: "Maxwell was given early hierarchical membership into the council of 9 a powerful cabal of masters who are able to create worlds, destroy them, recreate universes and play with time, space and matter. Nothing is beyond their means. He is the youngest member of the council of 9.",
      },
      {
        t: "His parents descended onto earth using an interdimensional time/space gateway which allowed them to protect their son from the onslaught of Lord Temarlyn the evil leader from the Ambolok. His descent into 2018 was done as a way to shield him from the many changes seen on earth. He is unique even among his Peers in that he knows the art, science of time, space manipulation from an early age.",
      },
    ],
    extras: [
      {
        title: "Specialities",
        text: "Avatarman is capable of transdimensional travel, time-travel, teleportation, levitation. He can shrink or increase size to any level, change appearance and heal the wounds. He can do complex calculations, can see mathematical equations and can warp space/time to create change in the fabric of time. He can erase Karmas instantly. Amazing strength, deathless state and self-healing.",
      },
      {
        title: "Weapons",
        text: "Avatarman's weapon is a vel or spear. He can change to traditional or ancient costumes, etc. He does not need weapons, can use any weapon or his amazing strength. He has what many Hindus describe as Siddhis.",
      },
    ],
  },
  {
    id: "doctor",
    kicker: "Chapter 03",
    title: "Doctor",
    sub: "“Handel Von Neumann”",
    ghost: "Doctor",
    tone: 0,
    fire: 0.8,
    img: `${BASE}/doctor-1.png`,
    side: 1,
    len: 1.9,
    blocks: [
      {
        t: "He is stylish intelligent and very professional. He is an exclusive fit for a billionaire. His fancy stethoscope and futuristic techniques accessible with his watch makes him out of this world.",
      },
      {
        t: "His blue piercing eyes and extravagant style is remarkable. In his early thirties, he is ambitious, young and thriving guy. His wit, sense of humor, quick reflexes and ability to read characters well, places him at unique place in the world of these superheroes.",
      },
    ],
    extras: [{ title: "Comics Coming Soon" }],
  },
  {
    id: "merlyn",
    kicker: "Chapter 04",
    title: "Merlyn Meronius",
    ghost: "Merlyn",
    tone: 1,
    fire: 0.35,
    img: `${BASE}/Merlyn-1.png`,
    side: -1,
    len: 1.9,
    blocks: [
      {
        t: "He is an emperor, father of Avatarman. He is regal modest with charming look.",
      },
      {
        t: "Though he is not waging wars now but his extraordinary powers and his experience is enough to speak about his valor. His divine spear and the way he point his left hand is giving him air of distinction and dignity.",
      },
    ],
    extras: [{ title: "Emperor" }],
  },
  {
    id: "petra",
    kicker: "Chapter 05",
    title: "Petra Meronius",
    ghost: "Petra",
    tone: 0,
    fire: 1,
    img: `${BASE}/petraB.png`,
    side: 1,
    len: 1.9,
    blocks: [
      {
        t: "She is a Queen, mother of Avatarman. Her regal and enchanting face with a captivating smile is wreaking her Royalty.",
      },
      {
        t: "She is a royal figure with jewel crested tiara on her forehead. Her jewellery is futuristic with several powers in them making her bold courageous Queen in this warrior world.",
      },
    ],
    extras: [{ title: "Queen" }],
  },
  {
    id: "ange",
    kicker: "Chapter 06",
    title: "Ange Apollo",
    ghost: "Ange",
    tone: 1,
    fire: 0.35,
    img: `${BASE}/ange-guru-1.png`,
    side: -1,
    len: 1.9,
    blocks: [
      {
        t: "His exceptional intelligence, remarkable knowledge makes him Avatarman’s advisor cum Guru. He is a perfect blend of power with wisdom.",
      },
      {
        t: "Chakra on right hand is his supreme power. Its colors, energy patterns manifests when wrist is tapped and it blooms out like emanating as fast spinning like Sudarshana Chakra. His futuristic machine gun and mighty sword makes him matchless warrior.",
      },
    ],
    extras: [{ title: "Advisor cum Guru" }],
  },
  {
    id: "outro",
    kicker: "",
    title: "Brand new characters and thrilling stories!",
    ghost: "WC",
    tone: 0,
    fire: 1,
    side: 1,
    len: 1.7,
    blocks: [
      {
        t: "Characters which are unique and matchless and are put together in a perfect and an engaging story. Futuristic and innovative world featuring revolutionary characters with their incredible powers, impressive costumes, cutting-edge weapons, and breathtaking wars.",
      },
      {
        t: "Well, whom will be they fighting and what would be their purpose? Answers for these questions will be provided in the comic one by one, with an epic and a mysterious storyline. Get ready to experience an inexplicable and perplexing life of these comic characters which will blow your mind away.",
      },
      {
        h: "Warrior Comics",
        t: "Participate in token sale. Track our ICO here.",
        cta: { label: "Our ICO", href: "https://warriortoken.com/" },
      },
    ],
    extras: [],
  },
];

/* cumulative start of each chapter (in screens) and the total length */
export const START: number[] = [];
let acc = 0;
CHAPTERS.forEach((c) => {
  START.push(acc);
  acc += c.len;
});
export const TOTAL = acc;