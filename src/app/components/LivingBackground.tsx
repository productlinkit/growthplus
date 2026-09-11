import type { CSSProperties } from "react";
import landscape from "../../assets/background/landscape.jpg";
import cloudA from "../../assets/background/cloud-a.webp";
import cloudC from "../../assets/background/cloud-c.webp";
import cloudD from "../../assets/background/cloud-d.webp";
import cloudE from "../../assets/background/cloud-e.webp";

// The painting is 1672×941. The scene box always covers the viewport at that aspect ratio,
// so every effect below is placed in % of the painting and stays glued to it at any size.
const AR = 1672 / 941;

// Cloud sprites cut from the painting's own sky, crossing it at different heights and speeds.
// top / w in % of the painting; dur / delay in seconds (negative delay = already mid-way on load).
const CLOUDS = [
  { src: cloudC, top: 3, w: 12, dur: 150, delay: 20, flip: false, op: 0.95 },
  { src: cloudD, top: 20, w: 10, dur: 115, delay: 70, flip: false, op: 0.9 },
  { src: cloudC, top: 11, w: 9, dur: 185, delay: 120, flip: true, op: 0.85 },
  { src: cloudD, top: 29, w: 13, dur: 140, delay: 35, flip: true, op: 0.8 },
  { src: cloudA, top: 1, w: 26, dur: 240, delay: 160, flip: false, op: 0.9 },
  { src: cloudE, top: 6, w: 16, dur: 210, delay: 40, flip: false, op: 0.9 },
  { src: cloudE, top: 18, w: 11, dur: 170, delay: 130, flip: true, op: 0.8 },
  { src: cloudA, top: 14, w: 18, dur: 260, delay: 60, flip: true, op: 0.75 },
  { src: cloudC, top: 24, w: 7, dur: 120, delay: 95, flip: false, op: 0.85 },
  { src: cloudD, top: 8, w: 8, dur: 100, delay: 15, flip: false, op: 0.9 },
  { src: cloudE, top: 26, w: 9, dur: 150, delay: 5, flip: false, op: 0.7 },
  { src: cloudC, top: 0, w: 15, dur: 200, delay: 185, flip: true, op: 0.9 },
];

// Sparkles on the lake, in % of the lake box.
const GLINTS = [
  [22, 40, 0], [35, 62, 1.1], [48, 35, 2.3], [58, 55, 0.6], [66, 42, 1.8],
  [42, 70, 2.9], [75, 60, 0.3], [30, 50, 3.4], [54, 25, 1.5], [62, 75, 2.6],
];

const CSS = `
/* Anchor the painting at 88% horizontally so the waterfall stays on screen when a narrower
   viewport crops the sides; phones can't fit both, so they keep the centre (castle + lake). */
.lb-scene { position: absolute; left: 88%; top: 50%; transform: translate(-88%, -50%);
  width: max(100vw, calc(100vh * ${AR})); height: max(100vh, calc(100vw / ${AR}));
  background: url(${landscape}) center / 100% 100% no-repeat; overflow: hidden; }
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
.lb-fall { overflow: hidden; mix-blend-mode: screen; opacity: 0.6; transform: skewX(-8.6deg);
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

/* lake: soft light glints drifting slowly in two directions, plus twinkling sparkles */
.lb-lake { -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 35%, transparent 72%);
  mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 35%, transparent 72%); overflow: hidden; }
.lb-lake-warp { position: absolute; inset: 0; overflow: hidden; filter: url(#lb-water); }
.lb-lake-img { position: absolute; background: url(${landscape}) center / 100% 100% no-repeat; }
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

@media (max-width: 639px) { .lb-scene { left: 50%; transform: translate(-50%, -50%); } }
@media (prefers-reduced-motion: reduce) { .lb-scene * { animation: none !important; } .lb-glint { opacity: 0; } }`;

// Fixed full-screen painting that feels alive: drifting clouds, a flowing waterfall,
// rippling lake and a breathing sun — CSS transform/opacity animations plus one small SVG
// displacement filter on the lake.
export function LivingBackground() {
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
      <div className="lb-scene">
        {CLOUDS.map((c, i) => (
          <div key={i} className="lb-cloud-track" style={{ top: `${c.top}%`, "--dur": `${c.dur}s`, "--delay": `-${c.delay}s`, "--from": `-${c.w}%`, "--op": c.op } as CSSProperties}>
            <img src={c.src} alt="" style={{ width: `${c.w}%`, transform: c.flip ? "scaleX(-1)" : undefined }} />
          </div>
        ))}

        <div className="lb-sun" style={{ left: "-5.26%", top: "12.96%", width: "23.92%", height: "42.5%" }}>
          <div className="lb-sun-glow" />
          <div className="lb-sun-rays" />
        </div>

        <div className="lb-fall" style={{ left: "94.62%", top: "58.02%", width: "2.63%", height: "15.52%" }}>
          <div className="lb-fall-inner">
            <div className="lb-stream lb-stream-a" />
            <div className="lb-stream lb-stream-b" />
          </div>
        </div>
        <div className="lb-mist" style={{ left: "92.82%", top: "71.41%", width: "4.78%", height: "3.83%" }} />

        <div className="lb-lake" style={{ left: "35.29%", top: "68.54%", width: "34.69%", height: "15.94%" }}>
          <div className="lb-lake-warp">
            <div className="lb-lake-img" style={{ left: "-101.72%", top: "-430%", width: "288.28%", height: "627.33%" }} />
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
