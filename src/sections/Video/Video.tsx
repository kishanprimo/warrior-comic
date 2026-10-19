"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Video data                                                         */
/* ------------------------------------------------------------------ */
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// Clicking a card opens `href`. Change it to an internal route
// (e.g. "/videos") or any other page if you prefer.
const VIDEOS = [
  {
    id: "dBmpjAwpmxc",
    title: "WARRIOR COMICS CHARACTER TRAILER 2019",
    sub: "Character Showcase",
    href: yt("dBmpjAwpmxc"),
    thumbnail: thumb("dBmpjAwpmxc"),
    label: "Watch on YouTube",
  },
  {
    id: "qAjLLApkMt4",
    title: "Empowering Young Artists - Outdoor Art Workshop",
    sub: "Warrior Comics Workshop",
    href: yt("qAjLLApkMt4"),
    thumbnail: thumb("qAjLLApkMt4"),
    label: "Watch on YouTube",
  },
  {
    id: "XjFOjx_Lfcg",
    title: "WHY WARRIOR COMICS",
    sub: "Mission & Vision",
    href: yt("XjFOjx_Lfcg"),
    thumbnail: thumb("XjFOjx_Lfcg"),
    label: "Watch on YouTube",
  },
  {
    id: "kYT27UA1-2o",
    title: "Warrior Comics Showcase",
    sub: "Special Highlight",
    href: yt("kYT27UA1-2o"),
    thumbnail: thumb("kYT27UA1-2o"),
    label: "Watch on YouTube",
  },
];

/* ------------------------------------------------------------------ */
/* Layout constants                                                   */
/* ------------------------------------------------------------------ */
const CARD_W = 6.6; // bigger cards (was 4.8 x 2.7), still 16:9
const CARD_H = 3.7125;
const GAP_X = 1.4;
const GAP_Y = 1.5;
// 9 rows => videos still fill the view when you tilt up to the "ceiling"
// or down to the "floor", so there is never empty black space.
const ROWS = 9;
const COLS_DESKTOP = 14;
const COLS_COMPACT = 10; // phones: fewer, larger-looking columns
const MAX_TILT = 0.45; // radians, desktop only
const AUTO_SPEED = 0.06; // rad/s idle spin
const CLICK_SLOP = 8; // px of movement that still counts as a click

const PLANE = new THREE.PlaneGeometry(CARD_W, CARD_H);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Ctl = {
  rotX: number;
  rotY: number;
  vel: number;
  dragging: boolean;
  moved: number;
  hover: number;
  lastX: number;
  lastY: number;
  lastT: number;
};

/* ------------------------------------------------------------------ */
/* Camera: keep the horizontal field of view sensible on every screen */
/* ------------------------------------------------------------------ */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const hfov = aspect < 1 ? 70 : 100;
    const fov = THREE.MathUtils.clamp(
      THREE.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(hfov) / 2) / aspect)
      ),
      50,
      92
    );
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/* ------------------------------------------------------------------ */
/* One video card                                                     */
/* ------------------------------------------------------------------ */
type CardItem = {
  id: string;
  video: (typeof VIDEOS)[number];
  texture: THREE.Texture;
  position: [number, number, number];
  rotation: [number, number, number];
};

function CardMesh({
  item,
  ctl,
}: {
  item: CardItem;
  ctl: React.MutableRefObject<Ctl>;
}) {
  const grp = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const gl = useThree((s) => s.gl);
  const [hovered, setHovered] = useState(false);
  const bright = useRef(0.4);
  const wp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const g = grp.current;
    const m = mat.current;
    if (!g || !m) return;
    dt = Math.min(dt, 0.05);

    // cards facing the viewer are bright, cards toward the edges fade out
    g.getWorldPosition(wp);
    const facing = -wp.z / wp.length();
    const base = THREE.MathUtils.smoothstep(facing, 0.15, 0.92);
    const target = hovered ? 1 : 0.1 + 0.9 * base;
    bright.current += (target - bright.current) * (1 - Math.exp(-8 * dt));
    m.color.setScalar(bright.current);

    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, hovered ? 1.07 : 1, 10, dt));
  });

  return (
    <group
      ref={grp}
      position={item.position}
      rotation={item.rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (ctl.current.dragging) return;
        setHovered(true);
        ctl.current.hover += 1;
        gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (!hovered) return;
        setHovered(false);
        ctl.current.hover = Math.max(0, ctl.current.hover - 1);
        gl.domElement.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        // a drag is not a click
        if (ctl.current.moved > CLICK_SLOP) return;
        window.open(item.video.href, "_blank", "noopener,noreferrer");
      }}
    >
      <mesh geometry={PLANE}>
        <meshBasicMaterial ref={mat} map={item.texture} toneMapped={false} />
      </mesh>

      {/* link pill, like the reference: appears on hover, click = go there */}
      {hovered && (
        <Html
          center
          position={[0, 0, 0.08]}
          zIndexRange={[30, 0]}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            {item.video.label}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </motion.div>
        </Html>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The cylinder                                                       */
/* ------------------------------------------------------------------ */
function CylinderGallery({
  cols,
  ctl,
  reduce,
}: {
  cols: number;
  ctl: React.MutableRefObject<Ctl>;
  reduce: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const textures = useTexture(VIDEOS.map((v) => v.thumbnail)) as THREE.Texture[];

  // hqdefault thumbnails are 4:3 with black bars: crop to the 16:9 picture
  useMemo(() => {
    textures.forEach((t) => {
      t.repeat.set(1, 0.75);
      t.offset.set(0, 0.125);
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textures]);

  const cards = useMemo(() => {
    const radius = (cols * (CARD_W + GAP_X)) / (Math.PI * 2);
    const mid = (ROWS - 1) / 2;
    const items: CardItem[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < cols; c++) {
        const angle = (c / cols) * Math.PI * 2;
        const vi = (c + r * 2) % VIDEOS.length; // neighbours always differ
        items.push({
          id: `${r}-${c}`,
          video: VIDEOS[vi],
          texture: textures[vi],
          position: [
            Math.sin(angle) * radius,
            (r - mid) * (CARD_H + GAP_Y),
            Math.cos(angle) * radius,
          ],
          rotation: [0, angle + Math.PI, 0],
        });
      }
    }
    return items;
  }, [cols, textures]);

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    dt = Math.min(dt, 0.05);
    const c = ctl.current;

    if (!c.dragging) {
      // momentum after a flick, then a slow idle spin
      c.rotY += c.vel * dt;
      c.vel *= Math.exp(-3 * dt);
      if (Math.abs(c.vel) < 0.03 && c.hover === 0 && !reduce) {
        c.rotY += AUTO_SPEED * dt;
      }
    }

    const k = 1 - Math.exp(-6 * dt);
    g.rotation.y += (c.rotY - g.rotation.y) * k;
    g.rotation.x += (c.rotX - g.rotation.x) * k;
  });

  return (
    <group ref={groupRef}>
      {cards.map((item) => (
        <CardMesh key={item.id} item={item} ctl={ctl} />
      ))}
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Edge helpers (fade + blur)                                         */
/* ------------------------------------------------------------------ */
const mask = (dir: string): React.CSSProperties => {
  const g = `linear-gradient(${dir}, black, transparent)`;
  return { WebkitMaskImage: g, maskImage: g };
};

/* ------------------------------------------------------------------ */
/* Main section                                                       */
/* ------------------------------------------------------------------ */
export default function Video() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ctl = useRef<Ctl>({
    rotX: 0,
    rotY: 0,
    vel: 0,
    dragging: false,
    moved: 0,
    hover: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
  });

  const [compact, setCompact] = useState(false); // phones
  const [horizontalOnly, setHorizontalOnly] = useState(false); // phones + touch
  const [reduce, setReduce] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  /* responsive behaviour */
  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const touchy = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const motionQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setCompact(small.matches);
      setHorizontalOnly(touchy.matches);
      setReduce(motionQ.matches);
    };
    update();
    small.addEventListener("change", update);
    touchy.addEventListener("change", update);
    motionQ.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      touchy.removeEventListener("change", update);
      motionQ.removeEventListener("change", update);
    };
  }, []);

  // side-by-side only: drop any vertical tilt
  useEffect(() => {
    if (horizontalOnly) ctl.current.rotX = 0;
  }, [horizontalOnly]);

  /* only render while the section is on screen */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* drag to rotate */
  const onDown = (e: React.PointerEvent) => {
    const c = ctl.current;
    c.dragging = true;
    c.moved = 0;
    c.vel = 0;
    c.lastX = e.clientX;
    c.lastY = e.clientY;
    c.lastT = e.timeStamp;
  };

  const onMove = (e: React.PointerEvent) => {
    const c = ctl.current;
    if (!c.dragging) return;
    const dx = e.clientX - c.lastX;
    const dy = e.clientY - c.lastY;
    c.moved += Math.abs(dx) + Math.abs(dy);

    c.rotY += dx * 0.005;
    if (!horizontalOnly) c.rotX = clamp(c.rotX + dy * 0.003, -MAX_TILT, MAX_TILT);

    const dt = Math.max(0.008, (e.timeStamp - c.lastT) / 1000);
    c.vel = clamp(c.vel * 0.5 + ((dx * 0.005) / dt) * 0.5, -5, 5);

    c.lastX = e.clientX;
    c.lastY = e.clientY;
    c.lastT = e.timeStamp;
  };

  const onUp = () => {
    const c = ctl.current;
    c.dragging = false;
    if (c.moved < CLICK_SLOP) c.vel = 0;
  };

  const cols = compact ? COLS_COMPACT : COLS_DESKTOP;

  /* ---------------------------------------------------------------- */
  return (
    <section
      id="videos"
      aria-label="Warrior Comics videos"
      className="relative w-full overflow-hidden bg-black font-sans text-white"
    >
      {/* soft accent glow behind the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_srgb,var(--accent)_20%,transparent)_0%,transparent_70%)]"
      />

      {/* ============ TITLE + TAGLINE ============ */}
      <header className="relative z-30 mx-auto max-w-4xl px-5 pb-10 pt-18  text-center sm:pb-12 sm:pt-20 md:pb-16 md:pt-24">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Videos
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="m-0 mt-5 font-serif text-[clamp(1.9rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-tight"
        >
          Stories brought to life by{" "}
          <span className="font-light italic text-accent">artists worldwide</span>
        </motion.h2>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-4 block text-sm font-normal tracking-wide text-gray-500"
        >
          ( Drag and rotate to explore th 3D gallery from all sides )
        </motion.span>

        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mb-0 mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
        >
          Character trailers, workshops and behind-the-scenes films from the
          WC-Universe. Drag to explore, then click any video to watch it.
        </motion.p> */}
      </header>

      {/* ============ GALLERY STAGE ============ */}
      <div
        ref={stageRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        className="relative h-[72svh] min-h-[460px] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[88vh] md:min-h-[620px]"
      >
        {/* 3D canvas — opacity flips once `ready` becomes true */}
        <div
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${ready ? "opacity-100" : "opacity-0"
            }`}
        >
          <Canvas
            frameloop={inView ? "always" : "never"}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 0.1], fov: 65, near: 0.1, far: 100 }}
          >
            <CameraRig />
            <Suspense fallback={null}>
              <CylinderGallery cols={cols} ctl={ctl} reduce={reduce} />
              <Ready onReady={onReady} />
            </Suspense>
          </Canvas>
        </div>

        {!ready && (
          <div className="absolute inset-0 z-20 grid place-items-center">
            <span className="animate-pulse text-xs uppercase tracking-[0.3em] text-white/60">
              Loading videos
            </span>
          </div>
        )}

        {/* centre heading */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h3 className="m-0 font-serif text-2xl font-normal leading-tight tracking-tight text-white drop-shadow-xl sm:text-4xl ">
            Made with <br />
            <span className="font-normal italic">Warrior Comics</span>
          </h3>
        </div>

        {/* ---- faded + blurred edges ---- */}
        {/* top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 md:h-40"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-transparent" />
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={mask("to bottom")}
          />
        </div>
        {/* bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 md:h-40"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={mask("to top")}
          />
        </div>
        {/* left corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 sm:w-24 md:w-44"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={mask("to right")}
          />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        </div>
        {/* right corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 sm:w-24 md:w-44"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/55 to-transparent" />
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={mask("to left")}
          />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
        </div>

        {/* fading hairline separator — kept only at the bottom of the section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>

      {/* keyboard / screen-reader access to the same links */}
      <ul className="sr-only">
        {VIDEOS.map((v) => (
          <li key={v.id}>
            <a href={v.href} target="_blank" rel="noopener noreferrer">
              {v.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}