import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../../styles";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Constellation particles that form the word shape
const CONSTELLATION = Array.from({ length: 50 }, (_, i) => {
  const angle = seededRandom(i * 23) * Math.PI * 2;
  const dist = 50 + seededRandom(i * 29) * 350;
  return {
    startX: 960 + Math.cos(angle) * dist,
    startY: 500 + Math.sin(angle) * dist,
    size: 2 + seededRandom(i * 31) * 4,
    color: [
      COLORS.accent,
      COLORS.blue,
      COLORS.green,
      COLORS.orange,
      COLORS.pink,
      COLORS.cyan,
      COLORS.accentLight,
    ][i % 7],
    delay: seededRandom(i * 37) * 0.5,
  };
});

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Constellation contracts inward
  const contractProgress = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Particles fade out as logo appears
  const particleFade = interpolate(frame, [1.5 * fps, 2.2 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo appears from the convergence
  const logoScale = spring({
    frame: frame - 1.8 * fps,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const logoOpacity = interpolate(
    frame,
    [1.8 * fps, 2.5 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Flash at convergence
  const flashOpacity = interpolate(
    frame,
    [1.5 * fps, 1.5 * fps + 5, 1.5 * fps + 20],
    [0, 0.8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tagline
  const taglineOpacity = interpolate(frame, [2.8 * fps, 3.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [2.8 * fps, 3.5 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // URL
  const urlOpacity = interpolate(frame, [3.5 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow
  const glowPulse = 0.15 + Math.sin(frame / 25) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 48%, #0E1228, #030508)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Convergence flash */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}80, ${COLORS.orange}30, transparent 70%)`,
          opacity: flashOpacity,
        }}
      />

      {/* Constellation particles */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, opacity: particleFade }}
        width={1920}
        height={1080}
      >
        {CONSTELLATION.map((p, i) => {
          // Contract toward center
          const targetX = 960;
          const targetY = 480;
          const x = p.startX + (targetX - p.startX) * contractProgress;
          const y = p.startY + (targetY - p.startY) * contractProgress;
          const twinkle =
            0.5 +
            0.5 * Math.sin(frame / 8 + i * 0.5);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={p.size * 2}
                fill={p.color}
                opacity={twinkle * 0.15}
              />
              <circle
                cx={x}
                cy={y}
                r={p.size}
                fill={p.color}
                opacity={twinkle * 0.8}
              />
            </g>
          );
        })}

        {/* Connection lines between nearby particles */}
        {CONSTELLATION.slice(0, 30).map((p1, i) => {
          const next = CONSTELLATION[(i + 1) % 30];
          const targetX = 960;
          const targetY = 480;
          const x1 = p1.startX + (targetX - p1.startX) * contractProgress;
          const y1 = p1.startY + (targetY - p1.startY) * contractProgress;
          const x2 = next.startX + (targetX - next.startX) * contractProgress;
          const y2 = next.startY + (targetY - next.startY) * contractProgress;
          const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          if (dist > 200) return null;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COLORS.accent}
              strokeWidth={0.5}
              opacity={0.2 * (1 - dist / 200)}
            />
          );
        })}
      </svg>

      {/* Ambient glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}40, transparent 65%)`,
          opacity: logoOpacity * glowPulse,
        }}
      />

      {/* Logo — display font */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontFamily: FONTS.display,
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: -5,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.accentLight}, ${COLORS.orange}, #FFD700)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        SkillEvolve
      </div>

      {/* Tagline with word highlight on "evolve together" */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontFamily: FONTS.display,
          fontSize: 30,
          fontWeight: 500,
          color: COLORS.text,
          letterSpacing: -0.5,
          textAlign: "center",
        }}
      >
        Where agents{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "50%",
              height: "1.15em",
              transform: `translateY(-50%) scaleX(${Math.max(0, Math.min(1, spring({
                frame: frame - 3.2 * fps,
                fps,
                config: { damping: 200 },
                durationInFrames: 22,
              })))})`,
              transformOrigin: "left center",
              background: `linear-gradient(90deg, ${COLORS.accent}25, ${COLORS.orange}20)`,
              borderRadius: 8,
              zIndex: 0,
            }}
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.orange})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            evolve together
          </span>
        </span>
        .
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          opacity: urlOpacity,
          fontFamily: FONTS.mono,
          fontSize: 22,
          fontWeight: 500,
          color: COLORS.accentLight,
          letterSpacing: 2,
        }}
      >
        skill-evolve.com
      </div>

      {/* Credit line */}
      <div
        style={{
          position: "absolute",
          bottom: 85,
          opacity: urlOpacity * 0.5,
          fontFamily: FONTS.body,
          fontSize: 14,
          color: COLORS.textMuted,
          letterSpacing: 1,
        }}
      >
        by Orchestra Research
      </div>
    </AbsoluteFill>
  );
};
