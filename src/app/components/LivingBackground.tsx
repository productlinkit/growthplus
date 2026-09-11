import type { CSSProperties } from "react";
import landscape from "../../assets/background/landscape-hd.webp"; // 2× AI-upscaled (EDSR) 1672×941 painting
import portrait from "../../assets/background/portrait-hd.webp";   // 2× AI-upscaled (EDSR) 941×1672 painting
import landA from "../../assets/background/land-cloud-a.webp";
import landB from "../../assets/background/land-cloud-b.webp";
import landC from "../../assets/background/land-cloud-c.webp";
import landD from "../../assets/background/land-cloud-d.webp";
import portA from "../../assets/background/port-cloud-a.webp";
import portB from "../../assets/background/port-cloud-b.webp";
import portC from "../../assets/background/port-cloud-c.webp";
import portD from "../../assets/background/port-cloud-d.webp";

// ─── Scenes ───────────────────────────────────────────────────────────────────
// Each scene is a painting plus where its living parts are, in the painting's own
// pixels (W×H = the original size; the HD files are exactly 2× so coordinates hold).
// Clouds: top / w in % of the painting; dur / delay in seconds (negative delay on use).
type Box = { x: number; y: number; w: number; h: number };
type Cloud = { src: string; top: number; w: number; dur: number; delay: number; flip?: boolean; op: number };
type Scene = { img: string; W: number; H: number; anchorX: number; clouds: Cloud[]; sun?: Box; fall: Box & { skew: number }; mist: Box; lake: Box };

// Desktop: landscape painting, anchored at 88% so the waterfall on the right survives side cropping.
const DESKTOP: Scene = {
  img: landscape, W: 1672, H: 941, anchorX: 88,
  clouds: [
    { src: landA, top: 4, w: 18, dur: 190, delay: 20, op: 0.95 },
    { src: landB, top: 14, w: 11, dur: 140, delay: 70, op: 0.9 },
    { src: portC, top: 24, w: 16, dur: 170, delay: 120, op: 0.9 },
    { src: landC, top: 36, w: 10, dur: 120, delay: 35, op: 0.85 },
    { src: portA, top: 8, w: 13, dur: 160, delay: 160, flip: true, op: 0.9 },
    { src: landD, top: 30, w: 10, dur: 130, delay: 40, op: 0.85 },
    { src: portB, top: 18, w: 13, dur: 175, delay: 95, flip: true, op: 0.85 },
    { src: landA, top: 27, w: 14, dur: 210, delay: 140, flip: true, op: 0.8 },
    { src: portD, top: 2, w: 9, dur: 110, delay: 15, op: 0.9 },
    { src: landB, top: 40, w: 8, dur: 100, delay: 60, flip: true, op: 0.8 },
    { src: landC, top: 11, w: 8, dur: 115, delay: 100, op: 0.85 },
    { src: portC, top: 33, w: 12, dur: 185, delay: 185, flip: true, op: 0.8 },
  ],
  fall: { x: 1584, y: 545, w: 40, h: 135, skew: -8.4 },
  mist: { x: 1545, y: 657, w: 90, h: 36 },
  lake: { x: 730, y: 648, w: 500, h: 150 }, // open water right of the lakeside house, so its roof never ripples
};

// Phones: portrait painting, anchored at 78% so the waterfall on the right edge stays on screen.
// The scene is narrow, so clouds cross faster to read as moving.
const MOBILE: Scene = {
  img: portrait, W: 941, H: 1672, anchorX: 78,
  clouds: [
    { src: portA, top: 8, w: 23, dur: 60, delay: 10, op: 0.95 },
    { src: portB, top: 24, w: 23, dur: 70, delay: 30, op: 0.95 },
    { src: landA, top: 15, w: 33, dur: 85, delay: 55, op: 0.9 },
    { src: portC, top: 38, w: 29, dur: 75, delay: 20, flip: true, op: 0.9 },
    { src: landB, top: 3, w: 19, dur: 55, delay: 12, op: 0.9 },
    { src: portD, top: 31, w: 18, dur: 50, delay: 40, op: 0.85 },
    { src: landC, top: 45, w: 18, dur: 58, delay: 62, flip: true, op: 0.85 },
    { src: landD, top: 19, w: 18, dur: 52, delay: 47, flip: true, op: 0.9 },
    { src: portA, top: 49, w: 17, dur: 65, delay: 35, flip: true, op: 0.8 },
    { src: portB, top: 12, w: 16, dur: 62, delay: 75, op: 0.85 },
  ],
  fall: { x: 872, y: 1100, w: 34, h: 100, skew: -9 },
  mist: { x: 850, y: 1193, w: 60, h: 24 },
  lake: { x: 450, y: 1195, w: 390, h: 110 }, // open water right of the lakeside houses
};

// Sparkles on the lake, in % of the lake box.
const GLINTS = [
  [22, 40, 0], [35, 62, 1.1], [48, 35, 2.3], [58, 55, 0.6], [66, 42, 1.8],
  [42, 70, 2.9], [75, 60, 0.3], [30, 50, 3.4], [54, 25, 1.5], [62, 75, 2.6],
];

const CSS = `
.lb-scene { position: absolute; top: 50%; overflow: hidden; }
.lb-scene > * { position: absolute; pointer-events: none; }

/* clouds */
.lb-cloud-track { left: 0; width: 100%; animation: lb-cross var(--dur) linear var(--delay) infinite; will-change: transform, opacity; }
.lb-cloud-track img { display: block; height: auto; }
@keyframes lb-cross {
  0%   { transform: translateX(var(--from)); opacity: 0; }
  6%   { opacity: var(--op); }
  94%  { opacity: var(--op); }
  100% { transform: translateX(100%); opacity: 0; }
}

/* waterfall: two streak layers falling at different speeds, skewed to follow the fall's lean,
   with every edge faded out (no hard box), plus mist at the base */
.lb-fall { overflow: hidden; mix-blend-mode: screen; opacity: 0.6;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 28%, #000 72%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 28%, #000 72%, transparent 100%); }
.lb-fall-inner { position: absolute; inset: 0; overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 82%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 82%, transparent 100%); }
.lb-stream { position: absolute; left: 0; right: 0; top: -100%; height: 200%; will-change: transform; }
.lb-stream-a { background:
    repeating-linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 4%, rgba(255,255,255,0) 10%),
    repeating-linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 14%, rgba(255,255,255,0) 26%);
  animation: lb-fall 1.1s linear infinite; }
.lb-stream-b { background: repeating-linear-gradient(180deg, rgba(220,240,255,0) 0%, rgba(220,240,255,0.55) 6%, rgba(220,240,255,0) 12.5%);
  animation: lb-fall 1.9s linear infinite; opacity: 0.8; }
@keyframes lb-fall { from { transform: translateY(0); } to { transform: translateY(50%); } }
.lb-mist { border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(255,255,255,0));
  filter: blur(4px); animation: lb-mist 3.4s ease-in-out infinite alternate; }
@keyframes lb-mist { from { transform: scale(0.85); opacity: 0.45; } to { transform: scale(1.2); opacity: 0.85; } }

/* lake: a copy of the lake area run through an animated SVG displacement filter (real
   wobbling water), with soft glints drifting in two directions and twinkling sparkles */
.lb-lake { -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 35%, transparent 72%);
  mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 35%, transparent 72%); overflow: hidden; }
.lb-lake-warp { position: absolute; inset: 0; overflow: hidden; filter: url(#lb-water); }
.lb-lake-img { position: absolute; background-position: center; background-size: 100% 100%; background-repeat: no-repeat; }
.lb-ripple { position: absolute; top: 0; bottom: 0; mix-blend-mode: screen; will-change: transform; }
.lb-ripple-a { left: -160px; right: 0; opacity: 0.9; animation: lb-drift-a 9s linear infinite;
  background-image:
    radial-gradient(ellipse 34px 3px at 22% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0)),
    radial-gradient(ellipse 20px 2.4px at 70% 78%, rgba(255,255,255,0.8), rgba(255,255,255,0));
  background-size: 160px 24px; }
.lb-ripple-b { left: 0; right: -120px; opacity: 0.6; animation: lb-drift-b 13s linear infinite;
  background-image:
    radial-gradient(ellipse 26px 2.6px at 40% 55%, rgba(230,245,255,0.9), rgba(230,245,255,0)),
    radial-gradient(ellipse 14px 2px at 85% 15%, rgba(230,245,255,0.8), rgba(230,245,255,0));
  background-size: 120px 18px; }
@keyframes lb-drift-a { from { transform: translateX(0); } to { transform: translateX(160px); } }
@keyframes lb-drift-b { from { transform: translateX(0); } to { transform: translateX(-120px); } }
.lb-glint { position: absolute; width: 7px; height: 3px; border-radius: 2px; background: #fff;
  box-shadow: 0 0 6px 2px rgba(255,255,255,0.8); opacity: 0; animation: lb-glint 3.6s ease-in-out infinite; }
@keyframes lb-glint { 0%, 100% { opacity: 0; transform: scale(0.4); } 45% { opacity: 1; transform: scale(1.3); } 60% { opacity: 0.2; } }

/* sun: breathing glow and slowly turning rays */
.lb-sun > div { position: absolute; inset: 0; border-radius: 50%; mix-blend-mode: screen; }
.lb-sun-glow { background: radial-gradient(circle, rgba(255,246,220,0.95) 0%, rgba(255,226,160,0.4) 28%, rgba(255,220,150,0) 62%);
  animation: lb-pulse 6s ease-in-out infinite alternate; }
.lb-sun-rays { opacity: 0.45; animation: lb-spin 90s linear infinite;
  background: repeating-conic-gradient(rgba(255,240,200,0) 0deg 9deg, rgba(255,240,200,0.5) 12deg, rgba(255,240,200,0) 15deg 26deg);
  -webkit-mask-image: radial-gradient(circle, #000 10%, transparent 62%); mask-image: radial-gradient(circle, #000 10%, transparent 62%); }
@keyframes lb-pulse { from { opacity: 0.55; transform: scale(0.94); } to { opacity: 1; transform: scale(1.08); } }
@keyframes lb-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) { .lb-scene * { animation: none !important; } .lb-glint { opacity: 0; } }`;

// Place a box given in painting pixels as % of the painting.
const place = (b: Box, s: Scene): CSSProperties => ({
  left: `${(b.x / s.W) * 100}%`, top: `${(b.y / s.H) * 100}%`, width: `${(b.w / s.W) * 100}%`, height: `${(b.h / s.H) * 100}%`,
});

// Fixed full-screen painting that feels alive: drifting clouds, a flowing waterfall,
// rippling lake (and a breathing sun when the scene has one) — CSS transform/opacity animations plus one small SVG
// displacement filter on the lake. Phones get the portrait painting, desktops the landscape.
export function LivingBackground({ isMobile }: { isMobile: boolean }) {
  const s = isMobile ? MOBILE : DESKTOP;
  const ar = s.W / s.H;
  const { lake } = s;
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#8FB4DE" }}>
      <style>{CSS}</style>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="lb-water" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.12" numOctaves={2} seed={7} result="noise">
            <animate attributeName="baseFrequency" dur="4.5s" values="0.01 0.12;0.016 0.16;0.012 0.1;0.01 0.12" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={24} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* The scene box always covers the viewport at the painting's aspect ratio, anchored so the
          chosen point of the painting stays on screen; everything inside is placed in % of it. */}
      <div className="lb-scene" style={{
        left: `${s.anchorX}%`, transform: `translate(-${s.anchorX}%, -50%)`,
        width: `max(100vw, calc(100vh * ${ar}))`, height: `max(100vh, calc(100vw / ${ar}))`,
        background: `url(${s.img}) center / 100% 100% no-repeat`,
      }}>
        {s.clouds.map((c, i) => (
          <div key={i} className="lb-cloud-track" style={{ top: `${c.top}%`, "--dur": `${c.dur}s`, "--delay": `-${c.delay}s`, "--from": `-${c.w}%`, "--op": c.op } as CSSProperties}>
            <img src={c.src} alt="" style={{ width: `${c.w}%`, transform: c.flip ? "scaleX(-1)" : undefined }} />
          </div>
        ))}

        {s.sun && (
          <div className="lb-sun" style={place(s.sun, s)}>
            <div className="lb-sun-glow" />
            <div className="lb-sun-rays" />
          </div>
        )}

        <div className="lb-fall" style={{ ...place(s.fall, s), transform: `skewX(${s.fall.skew}deg)` }}>
          <div className="lb-fall-inner">
            <div className="lb-stream lb-stream-a" />
            <div className="lb-stream lb-stream-b" />
          </div>
        </div>
        <div className="lb-mist" style={place(s.mist, s)} />

        <div className="lb-lake" style={place(lake, s)}>
          <div className="lb-lake-warp">
            {/* the whole painting, offset so the visible window lines up exactly with the lake box */}
            <div className="lb-lake-img" style={{
              left: `${(-lake.x / lake.w) * 100}%`, top: `${(-lake.y / lake.h) * 100}%`,
              width: `${(s.W / lake.w) * 100}%`, height: `${(s.H / lake.h) * 100}%`, backgroundImage: `url(${s.img})`,
            }} />
          </div>
          <div className="lb-ripple lb-ripple-a" />
          <div className="lb-ripple lb-ripple-b" />
          {GLINTS.map(([x, y, d], i) => (
            <span key={i} className="lb-glint" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
      {/* soft light veil behind the hero keeps the copy legible */}
      <div style={{ position: "absolute", top: 0, left: "50%", width: "min(980px, 100%)", height: "52vh", transform: "translateX(-50%)", background: "radial-gradient(ellipse 50% 60% at 50% 38%, rgba(255,255,255,0.6), rgba(255,255,255,0) 72%)" }} />
    </div>
  );
}
