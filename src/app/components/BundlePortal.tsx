import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Lightbulb, FolderOpen, Check, ExternalLink, X, TrendingUp, Gamepad2,
} from "lucide-react";
import linkitLogo    from "../../imports/image.png";
import growthImg     from "../../imports/ChatGPT_Image_Jun_18__2026__09_36_30_AM__2_.png";
import logoQuizPro   from "../../imports/logo-badge.png";
import logoSpeakEasy from "../../imports/image-6.png";
import logoCandy     from "../../imports/logo-candyjewels.png";
import { FloatingAssets } from "./FloatingAssets";
import { PlayVerseCatalog } from "./PlayVerseCatalog";
import { PLAYVERSE_GAMES } from "../data/playverse";

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

// ─── Package data ─────────────────────────────────────────────────────────────
const SMART_PLAY = {
  id: "smart-play",
  num: "SMP",
  label: "Smart Play",
  tagline: "For learning, speaking & play",
  tag: null,
  sticker: "SMP+",
  hw: "grow daily",
  chips: ["QuizPro", "SpeakEasy", "PlayVerse"],
  img: growthImg,
  tab: "#C49A00", tabText: "#1B3A6E",
  body: "#FFD23F",
  bodyText: "#1B3A6E", chipBg: "rgba(27,58,110,0.13)", chipText: "#1B3A6E",
  ey: "LinkIT360 · Smart Play",
  desc: "Smart Play brings together quiz practice, real speaking, and a colorful game into one playful daily learning habit.",
  pills: ["Quiz practice", "Speaking practice", "Casual gaming", "Daily learning"],
  prods: [
    { logo: logoQuizPro as string,   Icon: Lightbulb, nm: "QuizPro", d: "Gamified quiz app turning learning into play with adaptive questions.", lk: "https://mm.quizpro.mobi", ll: "mm.quizpro.mobi", removeBg: true },
    { logo: logoSpeakEasy as string, Icon: Lightbulb, nm: "SpeakEasy", d: "AI language app focused on real speaking practice and fluency.", lk: "https://speakeasy.mobi", ll: "speakeasy.mobi" },
    { logo: logoCandy as string,     Icon: Lightbulb, nm: "PlayVerse", d: `The Mega Combo catalogue — ${PLAYVERSE_GAMES.length} instant-play HTML5 games: puzzle, arcade, action, racing and more.`, lk: "", ll: `Browse ${PLAYVERSE_GAMES.length} games`, fill: true, catalog: true },
  ],
  bens: ["3 apps, one subscription", "Learn through play", `${PLAYVERSE_GAMES.length} PlayVerse games`, "Premium features unlocked"],
  pillColor: "#FFF3B0", pillText: "#5A4000", benColor: "#FFF3B0", btnBg: "#C49A00",
  hasSticky: false,
  HeroIcon: TrendingUp,
} as const;

type Pkg = typeof SMART_PLAY;

// ─── Full-width folder card ────────────────────────────────────────────────────
function FolderFull({ pkg, onOpen, isMobile }: { pkg: Pkg; onOpen: () => void; isMobile: boolean }) {
  return (
    <motion.div
      onClick={onOpen}
      className="cursor-pointer w-full select-none overflow-visible"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className="flex items-end gap-1.5 px-1.5">
        <div className="h-7 rounded-t-lg inline-flex items-center gap-2 px-3.5"
          style={{ background: pkg.tab, color: pkg.tabText, minWidth: isMobile ? 120 : 148 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.1em", opacity: 0.5, fontWeight: 700 }}>{pkg.num}</span>
          <span style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{pkg.label}</span>
        </div>
        <div style={{ flex: 1 }} />
        {pkg.tag && (
          <div className="h-[22px] rounded-t-md inline-flex items-center px-2.5"
            style={{ background: `${pkg.tab}88`, color: pkg.tabText, fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.75 }}>
            {pkg.tag}
          </div>
        )}
      </div>
      <div
        className="rounded-[2px_14px_14px_14px] relative overflow-hidden flex items-center"
        style={{
          background: pkg.body,
          padding: isMobile ? "16px" : "20px 24px",
          gap: isMobile ? 14 : 20,
          minHeight: isMobile ? 100 : 110,
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(135deg,transparent,transparent 4px,rgba(255,255,255,0.05) 4px,rgba(255,255,255,0.05) 5px)" }} />
        <div className="shrink-0 relative" style={{ width: isMobile ? 68 : 86, height: isMobile ? 68 : 86 }}>
          <div className="absolute rounded-lg" style={{ top: isMobile ? 6 : 8, left: isMobile ? 6 : 8, width: isMobile ? 56 : 70, height: isMobile ? 56 : 70, background: "rgba(0,0,0,0.12)", transform: "rotate(7deg)" }} />
          <div className="absolute top-0 left-0 rounded-lg overflow-hidden flex items-center justify-center"
            style={{ width: isMobile ? 58 : 72, height: isMobile ? 58 : 72, background: "rgba(255,255,255,0.10)", border: "1.5px solid rgba(255,255,255,0.15)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <img src={pkg.img} alt={pkg.label} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: isMobile ? 16 : 19, fontWeight: 900, color: pkg.bodyText, marginBottom: 2, lineHeight: 1.1 }}>{pkg.label}</div>
          <div style={{ fontSize: isMobile ? 10 : 11, color: pkg.bodyText, opacity: 0.7, marginBottom: isMobile ? 8 : 12 }}>{pkg.tagline}</div>
          <div className="flex flex-wrap gap-1 mb-2.5">
            {pkg.chips.map(c => <span key={c} style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: pkg.chipBg, color: pkg.chipText }}>{c}</span>)}
          </div>
          <div className="inline-flex items-center gap-1.5" style={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, color: pkg.bodyText, opacity: 0.65 }}>
            <FolderOpen size={12} /> Open package details
          </div>
        </div>
        {!isMobile && (
          <div className="flex flex-col items-end justify-between shrink-0" style={{ minWidth: 52, height: 84 }}>
            <div style={{ background: "rgba(0,0,0,0.20)", borderRadius: 5, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: pkg.bodyText, opacity: 0.85, letterSpacing: "0.1em", textTransform: "uppercase" }}>{pkg.sticker}</div>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 12, color: pkg.bodyText, opacity: 0.45, transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>{pkg.hw}</div>
          </div>
        )}
        <div className="absolute bottom-0 right-0" style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "0 0 20px 20px", borderColor: "transparent transparent rgba(0,0,0,0.08) transparent" }} />
        {pkg.hasSticky && (
          <div style={{ position: "absolute", right: isMobile ? 10 : 58, top: isMobile ? 10 : "auto", bottom: isMobile ? "auto" : 10, background: "#F7E96A", borderRadius: 3, padding: isMobile ? "3px 6px" : "5px 8px", fontFamily: "'Caveat',cursive", fontSize: isMobile ? 10 : 11, color: "#5A4A10", transform: isMobile ? "rotate(2deg)" : "rotate(-2deg)", zIndex: 2, boxShadow: "2px 2px 6px rgba(0,0,0,0.08)", lineHeight: 1.3 }}>
            {isMobile ? "Best seller!" : <><span>Best</span><br /><span>seller!</span></>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ pkg, onClose, onOpenCatalog, isMobile }: { pkg: Pkg | null; onClose: () => void; onOpenCatalog: () => void; isMobile: boolean }) {
  if (!pkg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: "rgba(15,30,28,0.75)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ scale: isMobile ? 1 : 0.9, y: isMobile ? 80 : 14, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="rounded-t-3xl sm:rounded-2xl overflow-hidden w-full sm:max-w-2xl"
        style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.22)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 px-5 py-4 sm:px-8 sm:py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="rounded-xl overflow-hidden shrink-0" style={{ width: 44, height: 44, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
              <img src={pkg.img} alt={pkg.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B7280", marginBottom: 3, fontWeight: 600 }}>{pkg.ey}</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 900, color: "#111827" }}>{pkg.label}</div>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 30, height: 30, background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.10)", color: "#374151", cursor: "pointer" }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 sm:px-8 sm:py-6 overflow-y-auto" style={{ maxHeight: isMobile ? "60vh" : "58vh" }}>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 18, paddingBottom: 18, borderBottom: "1px dashed rgba(0,0,0,0.10)" }}>{pkg.desc}</p>
          <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>Best for</div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.pills.map(p => <span key={p} style={{ fontSize: 11, fontWeight: 500, padding: "4px 11px", borderRadius: 99, background: pkg.pillColor, color: pkg.pillText }}>{p}</span>)}
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>Included products</div>
          <div className="mb-4">
            {pkg.prods.map((pr, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < pkg.prods.length - 1 ? "1px dashed rgba(0,0,0,0.08)" : "none" }}>
                {/* Product logo or icon fallback */}
                <div className="rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{
                    width: 40, height: 40,
                    background: (pr as any).fill ? "transparent" : pr.logo ? "#fff" : pkg.btnBg,
                    border: pr.logo && !(pr as any).fill ? "1px solid rgba(0,0,0,0.07)" : "none",
                    padding: pr.logo && !(pr as any).fill ? 5 : 0,
                  }}>
                  {pr.logo
                    ? <img src={pr.logo} alt={pr.nm} style={{ width: "100%", height: "100%", objectFit: (pr as any).fill ? "cover" : "contain", mixBlendMode: (pr as any).removeBg ? "multiply" : "normal" }} />
                    : <pr.Icon size={18} color="#fff" />
                  }
                </div>
                <div className="flex-1">
                  <div className="mb-1">
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{pr.nm}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.55, marginBottom: pr.lk || (pr as any).catalog ? 5 : 0 }}>{pr.d}</p>
                  {(pr as any).catalog && (
                    <button onClick={onOpenCatalog} className="inline-flex items-center gap-1"
                      style={{ fontSize: 11, fontWeight: 600, color: pkg.btnBg, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
                      <Gamepad2 size={11} /> {pr.ll}
                    </button>
                  )}
                  {pr.lk && (
                    <a href={pr.lk} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1"
                      style={{ fontSize: 11, fontWeight: 500, color: pkg.btnBg, textDecoration: "none" }}>
                      <ExternalLink size={10} /> {pr.ll}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>What you get</div>
          <div className="grid grid-cols-2 gap-2">
            {pkg.bens.map(b => (
              <div key={b} className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: pkg.benColor, fontSize: 12, color: "#111827" }}>
                <Check size={13} color={pkg.btnBg} strokeWidth={2.5} /> {b}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 sm:px-8" style={{ borderTop: "1px solid rgba(0,0,0,0.08)", background: "#F9FAFB" }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(0,0,0,0.15)", padding: "11px 16px", borderRadius: 10, fontSize: 12, color: "#374151", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Close</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Background ───────────────────────────────────────────────────────────────
function GridBackground() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#FBF7EF" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(27,58,110,0.10) 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,210,63,0.12) 0%, transparent 70%)" }} />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function BundlePortal() {
  const { isMobile, isTablet } = useBreakpoint();
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", minHeight: "100vh", position: "relative" }}>
      <GridBackground />
      <FloatingAssets isMobile={isMobile} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40" style={{ padding: "28px 32px" }}>
        <div className="max-w-5xl mx-auto">
          <img src={linkitLogo} alt="LinkIT 360" style={{ height: 22, display: "block", filter: "invert(1)", mixBlendMode: "multiply" }} />
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-24 pb-8 sm:pt-32 sm:pb-12 px-5 text-center" style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontSize: isMobile ? 28 : isTablet ? 38 : 46, fontWeight: 900, color: "#1B3A6E", lineHeight: 1.18, marginBottom: 14, letterSpacing: "-0.02em" }}>
            Level Up with{" "}
            <span style={{ color: "#1B3A6E", position: "relative", display: "inline-block" }}>
              Smart Play
              <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 3, borderRadius: 99, background: "#FFD23F" }} />
            </span>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 15, color: "#374151", lineHeight: 1.72, maxWidth: 480, margin: "0 auto" }}>
            Quiz practice, speaking, and games — three apps working together as your daily learning habit.
          </p>
        </motion.div>
      </div>

      {/* Single card — centered */}
      <div className="px-4 sm:px-8 pb-20" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          className="w-full mx-auto"
          style={{ maxWidth: 760 }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <FolderFull pkg={SMART_PLAY} onOpen={() => setModalOpen(true)} isMobile={isMobile} />
        </motion.div>
      </div>

      {modalOpen && <Modal pkg={SMART_PLAY} onClose={() => setModalOpen(false)} onOpenCatalog={() => setCatalogOpen(true)} isMobile={isMobile} />}
      {catalogOpen && <PlayVerseCatalog logo={logoCandy} onClose={() => setCatalogOpen(false)} isMobile={isMobile} />}
    </div>
  );
}
