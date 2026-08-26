import { BundlePortal } from "./components/BundlePortal";
import gridBg from "../imports/image-5.png";

export default function App() {
  return (
    <div style={{ background: "#F8F4EA", minHeight: "100vh", position: "relative" }}>
      {/* Full-page grid texture — low opacity so it's subtle, not distracting */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `url(${gridBg})`,
          backgroundSize: "auto",
          backgroundRepeat: "repeat",
          opacity: 0.18,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <BundlePortal />
      </div>
    </div>
  );
}
