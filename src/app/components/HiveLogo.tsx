/**
 * HIVE logo as SVG – transparent background, no box.
 * Use className to set size and color (e.g. h-8 text-white for dark nav).
 * Red fill + black stroke so both are visible; use text-white for dark backgrounds.
 */
export function HiveLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <text
        x="2"
        y="28"
        fontFamily="var(--font-sans)"
        fontWeight="500"
        fontSize="32"
        letterSpacing="0.02em"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      >
        HIVE
      </text>
    </svg>
  );
}
