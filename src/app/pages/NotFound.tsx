import { Link } from "react-router";
import { usePageMeta } from "../hooks/usePageMeta";

export function NotFound() {
  usePageMeta("Page not found | Sonic Hive Acoustics");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-overlay text-on-surface">
      <h1 className="text-[120px] text-[#DC2626]" style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-display)" }}>404</h1>
      <p className="text-[18px] mt-4 uppercase tracking-widest text-on-surface/50" style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}>Page Not Found</p>
      <Link
        to="/"
        className="mt-8 px-8 py-3 bg-[#DC2626] text-white rounded-full hover:bg-[#DC2626]/90 transition-colors text-[14px] tracking-wide"
        style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--font-weight-medium)" }}
      >
        Return Home
      </Link>
    </div>
  );
}
