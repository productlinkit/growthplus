import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { X, Search, Play } from "lucide-react";
import { PLAYVERSE_GAMES, type PlayVerseGame } from "../data/playverse";

const GENRE_HUES: Record<string, number> = {
  Puzzle: 265, Arcade: 145, Action: 5, Adventure: 30, Sports: 200, Racing: 340,
  Casual: 45, Strategy: 185, Casino: 320, PVP: 15, Horror: 0,
};

function initials(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2)).toUpperCase();
}

function GameTile({ game }: { game: PlayVerseGame }) {
  const [broken, setBroken] = useState(!game.thumb);
  const hue = GENRE_HUES[game.genre] ?? 210;
  return (
    <a href={game.url} target="_blank" rel="noopener noreferrer" className="group block rounded-xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="relative" style={{ aspectRatio: "1 / 1", background: `linear-gradient(160deg,hsl(${hue} 60% 55%),hsl(${hue} 55% 36%))` }}>
        {broken
          ? <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#fff", fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28 }}>{initials(game.name)}</div>
          : <img src={game.thumb} alt={game.name} loading="lazy" onError={() => setBroken(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        }
        {game.service === "g360" && (
          <span style={{ position: "absolute", top: 6, left: 6, background: "#FFD23F", color: "#1B3A6E", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>GAME360</span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(27,58,110,0.45)" }}>
          <span className="inline-flex items-center gap-1" style={{ background: "#FFD23F", color: "#1B3A6E", fontSize: 11, fontWeight: 800, padding: "6px 12px", borderRadius: 99 }}>
            <Play size={11} fill="#1B3A6E" /> Play
          </span>
        </div>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <div title={game.name} style={{ fontSize: 12, fontWeight: 700, color: "#111827", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{game.name}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: `hsl(${hue} 45% 38%)`, marginTop: 2 }}>{game.genre}</div>
      </div>
    </a>
  );
}

export function PlayVerseCatalog({ logo, onClose, isMobile }: { logo?: string; onClose: () => void; isMobile: boolean }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("ALL");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const genres = useMemo(() => {
    const counts: Record<string, number> = {};
    PLAYVERSE_GAMES.forEach(g => { counts[g.genre] = (counts[g.genre] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const q = query.trim().toLowerCase();
  const shown = PLAYVERSE_GAMES.filter(g => (genre === "ALL" || g.genre === genre) && (!q || g.name.toLowerCase().includes(q)));

  const chip = (active: boolean) => ({
    fontSize: 11, fontWeight: 600, padding: "5px 11px", borderRadius: 99, whiteSpace: "nowrap" as const, cursor: "pointer",
    background: active ? "#1B3A6E" : "#FFF3B0", color: active ? "#fff" : "#5A4000", border: "none", fontFamily: "Inter,sans-serif",
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: "rgba(15,30,28,0.75)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ scale: isMobile ? 1 : 0.94, y: isMobile ? 80 : 14, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="rounded-t-3xl sm:rounded-2xl overflow-hidden w-full sm:max-w-4xl flex flex-col"
        style={{ background: "#fff", maxHeight: isMobile ? "92vh" : "88vh", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 sm:px-7 sm:pt-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="rounded-xl overflow-hidden shrink-0" style={{ width: 40, height: 40 }}>
                  <img src={logo} alt="PlayVerse" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 900, color: "#111827", lineHeight: 1.1 }}>PlayVerse</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{PLAYVERSE_GAMES.length} games · tap any game to play in your browser</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 30, height: 30, background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.10)", color: "#374151", cursor: "pointer" }}>
              <X size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3 px-3 rounded-xl" style={{ background: "#F3F4F6", height: 38 }}>
            <Search size={14} color="#6B7280" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search games"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#111827", fontFamily: "Inter,sans-serif" }} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <button onClick={() => setGenre("ALL")} style={chip(genre === "ALL")}>All {PLAYVERSE_GAMES.length}</button>
            {genres.map(([g, n]) => (
              <button key={g} onClick={() => setGenre(g)} style={chip(genre === g)}>{g} {n}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto px-5 py-4 sm:px-7" style={{ background: "#FAFAFB" }}>
          {shown.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {shown.map(g => <GameTile key={g.name} game={g} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", fontSize: 13, color: "#6B7280" }}>No games match "{query}".</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
