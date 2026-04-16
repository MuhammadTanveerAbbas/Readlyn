"use client";

// Inline SVG icons  each represents what the collaborator is doing
const icons: Record<string, React.ReactNode> = {
  // Pencil  editing
  "Alex K.": (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path
        d="M8.5 1.5a1.2 1.2 0 0 1 1.7 1.7L3.8 9.6 1.5 10.2l.6-2.3L8.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // Sparkle  AI generating
  "Sara M.": (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 1v2M6 9v2M1 6h2M9 6h2M2.93 2.93l1.41 1.41M7.66 7.66l1.41 1.41M2.93 9.07l1.41-1.41M7.66 4.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Eye  reviewing / inspecting
  "Jin L.": (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
    </svg>
  ),
  // Chat bubble  commenting
  "Mila V.": (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 2h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4.5L2 11V3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// All positions use % relative to the section container.
// Y values stay between 5%–55% so cursors cluster around the headline text.
const CURSORS = [
  {
    name: "Alex K.",
    color: "#F5C518",
    textColor: "#0A0A0A",
    animName: "cursor-alex",
    duration: "18s",
    keyframes: `@keyframes cursor-alex {
      0%   { transform: translate(10%, 12%); }
      15%  { transform: translate(38%, 22%); }
      30%  { transform: translate(55%, 35%); }
      50%  { transform: translate(28%, 45%); }
      65%  { transform: translate(14%, 28%); }
      80%  { transform: translate(46%, 15%); }
      100% { transform: translate(10%, 12%); }
    }`,
  },
  {
    name: "Sara M.",
    color: "#FF6B35",
    textColor: "#FFFFFF",
    animName: "cursor-sara",
    duration: "22s",
    keyframes: `@keyframes cursor-sara {
      0%   { transform: translate(62%, 8%); }
      20%  { transform: translate(24%, 25%); }
      40%  { transform: translate(44%, 42%); }
      55%  { transform: translate(68%, 20%); }
      75%  { transform: translate(32%, 10%); }
      90%  { transform: translate(52%, 38%); }
      100% { transform: translate(62%, 8%); }
    }`,
  },
  {
    name: "Jin L.",
    color: "#4ADE80",
    textColor: "#0A0A0A",
    animName: "cursor-jin",
    duration: "26s",
    keyframes: `@keyframes cursor-jin {
      0%   { transform: translate(34%, 38%); }
      18%  { transform: translate(16%, 18%); }
      35%  { transform: translate(58%, 12%); }
      52%  { transform: translate(30%, 50%); }
      70%  { transform: translate(50%, 30%); }
      85%  { transform: translate(8%,  40%); }
      100% { transform: translate(34%, 38%); }
    }`,
  },
  {
    name: "Mila V.",
    color: "#818CF8",
    textColor: "#FFFFFF",
    animName: "cursor-mila",
    duration: "30s",
    keyframes: `@keyframes cursor-mila {
      0%   { transform: translate(70%, 42%); }
      12%  { transform: translate(40%, 14%); }
      30%  { transform: translate(12%, 32%); }
      48%  { transform: translate(56%, 48%); }
      65%  { transform: translate(44%, 20%); }
      82%  { transform: translate(22%, 42%); }
      100% { transform: translate(70%, 42%); }
    }`,
  },
];

export default function CollabCursors() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block"
      style={{ zIndex: 20 }}
    >
      <style>{CURSORS.map((c) => c.keyframes).join("\n")}</style>

      {CURSORS.map((cursor) => (
        <div
          key={cursor.name}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            animation: `${cursor.animName} ${cursor.duration} cubic-bezier(0.4, 0, 0.2, 1) infinite`,
            willChange: "transform",
          }}
        >
          {/* Cursor pointer */}
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            style={{
              filter: `drop-shadow(0 0 7px ${cursor.color}66) drop-shadow(0 2px 4px rgba(0,0,0,0.6))`,
            }}
          >
            <path d="M3 2L17 9.5L10.5 11.5L7.5 19.5L3 2Z" fill={cursor.color} />
            <path
              d="M3 2L17 9.5L10.5 11.5L7.5 19.5L3 2Z"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* Pill label */}
          <div
            style={{
              position: "absolute",
              left: "18px",
              top: "16px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: cursor.color,
              borderRadius: "999px",
              padding: "3px 10px 3px 5px",
              boxShadow: `0 2px 14px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)`,
              whiteSpace: "nowrap",
            }}
          >
            {/* Icon bubble */}
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: cursor.textColor,
                flexShrink: 0,
              }}
            >
              {icons[cursor.name]}
            </div>

            {/* Name */}
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: cursor.textColor,
                letterSpacing: "0.01em",
              }}
            >
              {cursor.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
