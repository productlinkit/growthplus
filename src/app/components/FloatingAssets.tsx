import { useEffect, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from "motion/react";

// ─── Assets ───────────────────────────────────────────────────────────────────
// Drop transparent PNG/WebP files into src/assets/floating/ using the names in
// ASSETS below (e.g. folder.png, megaphone.png). Missing files are skipped.
const FILES = import.meta.glob("../../assets/floating/*.{png,webp}", { eager: true, import: "default" }) as Record<string, string>;
const SRC: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.split("/").pop()!.replace(/\.(png|webp)$/, ""), url]),
);

type Layer = "back" | "mid" | "front";
// Spot = object centre in % of the viewport (values <0 or >100 sit partly off-screen); w = width in px.
type Spot = { x: number; y: number; w: number };
type FloatingAsset = {
  name: string;
  layer: Layer;
  rotate: number;
  desktop: Spot;
  mobile?: Spot; // omit to hide on phones
  float: { y: number; r: number; dur: number; delay: number };
};

const LAYERS: Record<Layer, { depth: number; opacity: number; blur: number; order: number }> = {
  back:  { depth: 0.35, opacity: 0.9, blur: 1, order: 0 },
  mid:   { depth: 0.65, opacity: 1,   blur: 0, order: 1 },
  front: { depth: 1,    opacity: 1,   blur: 0, order: 2 },
};

const ASSETS: FloatingAsset[] = [
  { name: "folder",     layer: "back",  rotate: -14, desktop: { x: -3, y: 16, w: 280 }, mobile: { x: -12, y: 7,  w: 150 }, float: { y: -10, r: 2,  dur: 9,   delay: 0 } },
  { name: "paperclips", layer: "back",  rotate: 18,  desktop: { x: 24, y: 5,  w: 110 },                                     float: { y: -8,  r: -3, dur: 7.5, delay: 1.2 } },
  { name: "paperclip",  layer: "back",  rotate: 28,  desktop: { x: 97, y: 42, w: 120 },                                     float: { y: -12, r: 3,  dur: 8,   delay: 2.4 } },
  { name: "pushpin",    layer: "mid",   rotate: 16,  desktop: { x: 86, y: 10, w: 150 }, mobile: { x: 92, y: 5,  w: 90 },  float: { y: -14, r: -2, dur: 6.5, delay: 0.6 } },
  { name: "button",     layer: "mid",   rotate: -8,  desktop: { x: 88, y: 64, w: 115 },                                     float: { y: -12, r: 4,  dur: 7,   delay: 3.1 } },
  { name: "star",       layer: "mid",   rotate: -12, desktop: { x: 13, y: 80, w: 155 }, mobile: { x: 6,  y: 90, w: 100 }, float: { y: -16, r: -4, dur: 7.8, delay: 1.8 } },
  { name: "megaphone",  layer: "front", rotate: 10,  desktop: { x: 5,  y: 50, w: 210 },                                     float: { y: -18, r: 3,  dur: 6.8, delay: 0.3 } },
  { name: "eyes",       layer: "front", rotate: -7,  desktop: { x: 81, y: 82, w: 180 }, mobile: { x: 90, y: 88, w: 110 }, float: { y: -15, r: -3, dur: 6.2, delay: 2.2 } },
  { name: "smiley",     layer: "front", rotate: 12,  desktop: { x: 55, y: 99, w: 170 }, mobile: { x: 50, y: 101, w: 120 }, float: { y: -14, r: 4, dur: 7.2, delay: 4 } },
];

const FLOAT_CSS = `
@keyframes fa-float {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50%      { transform: translate3d(0, var(--fy), 0) rotate(var(--fr)); }
}
@keyframes fa-shadow {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(0.84); }
}
.fa-float  { animation: fa-float  var(--fdur) ease-in-out var(--fdelay) infinite; will-change: transform; }
.fa-shadow { animation: fa-shadow var(--fdur) ease-in-out var(--fdelay) infinite; }
@media (prefers-reduced-motion: reduce) {
  .fa-float, .fa-shadow { animation: none; }
}`;

const SPRING = { stiffness: 90, damping: 18, mass: 0.6 };
const HOVER_SPRING = { stiffness: 170, damping: 20 };

// ─── One floating object ──────────────────────────────────────────────────────
function FloatingObject({ asset, spot, vw, vh, mx, my }: {
  asset: FloatingAsset; spot: Spot; vw: number; vh: number; mx: MotionValue<number>; my: MotionValue<number>;
}) {
  const { depth, opacity, blur } = LAYERS[asset.layer];
  const w = spot.w * Math.min(1.15, Math.max(0.75, vw / 1440));
  const cx = (spot.x / 100) * vw;
  const cy = (spot.y / 100) * vh;

  // 0 = cursor far away, 1 = cursor on the object
  const near = useTransform([mx, my], ([x, y]: number[]) => Math.max(0, 1 - Math.hypot(x - cx, y - cy) / (w * 0.5 + 260)));
  const nx = useTransform(mx, x => (x / vw - 0.5) * 2);
  const ny = useTransform(my, y => (y / vh - 0.5) * 2);

  // Parallax — deeper layers move less; objects near the cursor move more.
  const x = useSpring(useTransform([nx, near], ([n, p]: number[]) => -n * 38 * depth * (1 + 1.2 * p)), SPRING);
  const y = useSpring(useTransform([ny, near], ([n, p]: number[]) => -n * 30 * depth * (1 + 1.2 * p)), SPRING);
  const rotateY = useSpring(useTransform([nx, near], ([n, p]: number[]) => n * 16 * depth + p * 8), SPRING);
  const rotateX = useSpring(useTransform(ny, n => -n * 12 * depth), SPRING);
  // Hover — lift forward, tilt a little further, deepen the shadow.
  const scale = useSpring(useTransform(near, p => 1 + p * 0.12), HOVER_SPRING);
  const rotate = useSpring(useTransform(near, p => asset.rotate + p * Math.sign(asset.rotate || 1) * 6), HOVER_SPRING);
  const shadowOpacity = useSpring(useTransform(near, p => 0.35 + p * 0.45), HOVER_SPRING);
  const shadowY = useSpring(useTransform(near, p => p * 14), HOVER_SPRING);

  const vars = {
    "--fy": `${asset.float.y}px`, "--fr": `${asset.float.r}deg`,
    "--fdur": `${asset.float.dur}s`, "--fdelay": `-${asset.float.delay}s`,
  } as CSSProperties;

  return (
    <div style={{ position: "absolute", left: cx, top: cy, width: w, transform: "translate(-50%, -50%)", opacity }}>
      <motion.div style={{ x, y, rotateX, rotateY, rotate, scale, transformStyle: "preserve-3d", willChange: "transform" }}>
        {/* Ground shadow — stays under the object while it bobs, stronger on hover */}
        <motion.div style={{ position: "absolute", left: "12%", right: "12%", bottom: `-${8 + depth * 10}%`, height: "16%", y: shadowY, opacity: shadowOpacity }}>
          <div className="fa-shadow" style={{ ...vars, width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(60,45,20,0.35), rgba(60,45,20,0))" }} />
        </motion.div>
        <div className="fa-float" style={vars}>
          <img src={SRC[asset.name]} alt="" draggable={false}
            style={{
              display: "block", width: "100%", height: "auto", userSelect: "none",
              filter: `${blur ? `blur(${blur}px) ` : ""}drop-shadow(0 ${6 + depth * 10}px ${12 + depth * 12}px rgba(60,45,20,${0.1 + depth * 0.08}))`,
            }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Layer system ─────────────────────────────────────────────────────────────
export function FloatingAssets({ isMobile }: { isMobile: boolean }) {
  const reduceMotion = useReducedMotion();
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const mx = useMotionValue(vp.w / 2);
  const my = useMotionValue(vp.h / 2);

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // One pointer listener for every object, throttled to one update per frame.
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0, px = 0, py = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; mx.set(px); my.set(py); });
    };
    const onLeave = () => { mx.set(window.innerWidth / 2); my.set(window.innerHeight / 2); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion, mx, my]);

  const items = ASSETS
    .filter(a => SRC[a.name] && (!isMobile || a.mobile))
    .sort((a, b) => LAYERS[a.layer].order - LAYERS[b.layer].order);
  if (!items.length) return null;

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", perspective: 1200 }}>
      <style>{FLOAT_CSS}</style>
      {items.map(a => (
        // Re-key on resize so each object's position maths is rebuilt for the new viewport.
        <FloatingObject key={`${a.name}-${vp.w}x${vp.h}-${isMobile}`} asset={a}
          spot={isMobile ? a.mobile! : a.desktop} vw={vp.w} vh={vp.h} mx={mx} my={my} />
      ))}
    </div>
  );
}
