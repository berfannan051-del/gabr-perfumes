type BottleShape = "tall" | "round" | "faceted";

function BottleBody({ shape }: { shape: BottleShape }) {
  switch (shape) {
    case "round":
      return (
        <>
          <ellipse cx="200" cy="360" rx="108" ry="118" className="fill-[var(--bottle-glass)] stroke-[var(--color-border)]" strokeWidth="1.5" />
          <rect x="176" y="230" width="48" height="60" rx="6" className="fill-[var(--bottle-glass)] stroke-[var(--color-border)]" strokeWidth="1.5" />
          <ellipse cx="200" cy="392" rx="86" ry="60" className="fill-[var(--bottle-liquid)]" opacity="0.85" />
        </>
      );
    case "faceted":
      return (
        <>
          <polygon
            points="200,232 268,268 268,420 200,462 132,420 132,268"
            className="fill-[var(--bottle-glass)] stroke-[var(--color-border)]"
            strokeWidth="1.5"
          />
          <polygon
            points="200,320 268,352 268,420 200,462 132,420 132,352"
            className="fill-[var(--bottle-liquid)]"
            opacity="0.85"
          />
        </>
      );
    case "tall":
    default:
      return (
        <>
          <path
            d="M156 240 L156 220 Q156 200 176 200 L224 200 Q244 200 244 220 L244 240 Q268 260 268 300 L268 440 Q268 468 240 468 L160 468 Q132 468 132 440 L132 300 Q132 260 156 240 Z"
            className="fill-[var(--bottle-glass)] stroke-[var(--color-border)]"
            strokeWidth="1.5"
          />
          <path
            d="M133 340 L267 340 L267 440 Q267 467 240 467 L160 467 Q133 467 133 440 Z"
            className="fill-[var(--bottle-liquid)]"
            opacity="0.85"
          />
        </>
      );
  }
}

export function BottleArt({
  shape,
  liquidColor,
  className,
}: {
  shape: BottleShape;
  liquidColor: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 600"
      className={className}
      style={
        {
          "--bottle-glass": "color-mix(in srgb, var(--color-surface) 55%, transparent)",
          "--bottle-liquid": liquidColor,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="backdrop" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="var(--color-surface)" />
          <stop offset="100%" stopColor="var(--color-surface-muted)" />
        </radialGradient>
        <linearGradient id="capGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-highlight)" />
          <stop offset="100%" stopColor="var(--color-primary-deep)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="600" fill="url(#backdrop)" />

      {/* soft ground shadow */}
      <ellipse cx="200" cy="486" rx="110" ry="16" fill="var(--color-foreground)" opacity="0.08" />

      <BottleBody shape={shape} />

      {/* cap */}
      <rect x="178" y="158" width="44" height="46" rx="4" fill="url(#capGradient)" />
      <rect x="182" y="148" width="36" height="14" rx="3" fill="url(#capGradient)" />

      {/* label */}
      <line x1="150" y1="300" x2="250" y2="300" stroke="var(--color-primary)" strokeWidth="1" opacity="0.6" />
      <rect x="196" y="309" width="8" height="8" fill="var(--color-primary)" transform="rotate(45 200 313)" opacity="0.8" />
      <line x1="150" y1="322" x2="250" y2="322" stroke="var(--color-primary)" strokeWidth="1" opacity="0.6" />

      {/* glass highlight */}
      <line x1="150" y1="230" x2="140" y2="440" stroke="var(--color-surface)" strokeWidth="6" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}
