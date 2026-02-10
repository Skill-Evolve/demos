import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../../styles";

// Seeded random for deterministic star positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: seededRandom(i * 3 + 1) * 1920,
  y: seededRandom(i * 3 + 2) * 1080,
  size: 0.8 + seededRandom(i * 3 + 3) * 2.5,
  twinkleSpeed: 20 + seededRandom(i * 7) * 60,
  twinkleOffset: seededRandom(i * 11) * Math.PI * 2,
}));

// Typewriter text
const FULL_TEXT = "Every agent starts alone.";
const CHAR_FRAMES = 3;
const CURSOR_BLINK_FRAMES = 16;

export const GenesisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stars fade in
  const starsOpacity = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Agent node appears
  const nodeDelay = Math.floor(0.8 * fps);
  const nodeScale = spring({
    frame: frame - nodeDelay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.8 },
  });
  const nodeOpacity = interpolate(frame, [nodeDelay, nodeDelay + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle pulse
  const pulse = 1 + Math.sin(frame / 15) * 0.06;
  const glowPulse = 0.3 + Math.sin(frame / 15) * 0.15;

  // Typewriter text starting at 2.5s
  const textStart = Math.floor(2.5 * fps);
  const typedFrame = Math.max(0, frame - textStart);
  const typedCount = Math.min(
    FULL_TEXT.length,
    Math.floor(typedFrame / CHAR_FRAMES)
  );
  const typedText = FULL_TEXT.slice(0, typedCount);
  const cursorOpacity =
    frame >= textStart
      ? interpolate(
          frame % CURSOR_BLINK_FRAMES,
          [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
          [1, 0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  // "alone" word highlight wipe — triggers when the word is fully typed
  const aloneIndex = FULL_TEXT.indexOf("alone");
  const aloneTypedAt = textStart + (aloneIndex + 5) * CHAR_FRAMES;
  const highlightProgress = spring({
    frame: frame - aloneTypedAt,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  // Split text around "alone" for highlight rendering
  const preAlone = typedText.slice(0, Math.min(typedCount, aloneIndex));
  const aloneText = typedCount > aloneIndex
    ? typedText.slice(aloneIndex, Math.min(typedCount, aloneIndex + 5))
    : "";
  const postAlone = typedCount > aloneIndex + 5
    ? typedText.slice(aloneIndex + 5)
    : "";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #0A0E1A, #04060E)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Star field */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, opacity: starsOpacity }}
        width={1920}
        height={1080}
      >
        {STARS.map((star, i) => {
          const twinkle =
            0.3 +
            0.7 *
              ((Math.sin(frame / star.twinkleSpeed + star.twinkleOffset) + 1) /
                2);
          return (
            <circle
              key={i}
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill={COLORS.white}
              opacity={twinkle * 0.5}
            />
          );
        })}
      </svg>

      {/* Agent — 4-layer neural node recipe */}
      {/* Layer 1: Radial glow (ambient) */}
      <div
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}50, transparent 70%)`,
          opacity: nodeOpacity * glowPulse,
          transform: `scale(${nodeScale * pulse})`,
        }}
      />

      {/* Layer 2: Outer ring stroke */}
      <div
        style={{
          position: "absolute",
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: `1.5px solid ${COLORS.accentLight}50`,
          opacity: nodeOpacity * 0.7,
          transform: `scale(${nodeScale * pulse})`,
        }}
      />

      {/* Layer 3: Core fill */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${COLORS.accentLight}, ${COLORS.accent})`,
          boxShadow: `0 0 30px ${COLORS.accent}80, 0 0 60px ${COLORS.accent}30`,
          opacity: nodeOpacity,
          transform: `scale(${nodeScale * pulse})`,
        }}
      />

      {/* Layer 4: Inner highlight (3D depth) */}
      <div
        style={{
          position: "absolute",
          width: 12,
          height: 10,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.white}80, transparent)`,
          opacity: nodeOpacity * 0.6,
          transform: `scale(${nodeScale}) translate(-5px, -6px)`,
        }}
      />

      {/* Typewriter text with word highlight */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          fontFamily: FONTS.display,
          fontSize: 34,
          fontWeight: 500,
          color: COLORS.textSecondary,
          letterSpacing: -0.5,
        }}
      >
        <span>{preAlone}</span>
        {aloneText && (
          <span style={{ position: "relative", display: "inline-block" }}>
            {/* Highlight wipe behind "alone" */}
            <span
              style={{
                position: "absolute",
                left: -4,
                right: -4,
                top: "50%",
                height: "1.1em",
                transform: `translateY(-50%) scaleX(${Math.max(0, Math.min(1, highlightProgress))})`,
                transformOrigin: "left center",
                backgroundColor: `${COLORS.accent}35`,
                borderRadius: 6,
                zIndex: 0,
              }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                color:
                  highlightProgress > 0.3
                    ? COLORS.accentLight
                    : COLORS.textSecondary,
                fontWeight: highlightProgress > 0.3 ? 700 : 500,
              }}
            >
              {aloneText}
            </span>
          </span>
        )}
        <span>{postAlone}</span>
        {/* Blinking cursor */}
        <span
          style={{
            opacity: cursorOpacity,
            color: COLORS.accentLight,
            fontWeight: 300,
          }}
        >
          {"\u258C"}
        </span>
      </div>
    </AbsoluteFill>
  );
};
