import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoScale = spring({ frame, fps, config: { damping: 200 } });

  // Typewriter
  const cmd = "npx @skill-evolve/meta-skill";
  const typedLen = Math.min(
    cmd.length,
    Math.floor(
      interpolate(frame, [1.5 * fps, 3 * fps], [0, cmd.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const typedCmd = cmd.slice(0, typedLen);
  const showCursor = Math.floor(frame / 15) % 2 === 0;

  const cmdOpacity = interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomOpacity = interpolate(frame, [3.2 * fps, 3.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const creditOpacity = interpolate(frame, [4 * fps, 4.5 * fps], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow
  const glowOpacity = 0.1 + Math.sin(frame / 40) * 0.03;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}, transparent 70%)`,
          opacity: glowOpacity,
          top: 180,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontFamily: FONTS.heading,
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -3,
          marginBottom: 56,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.accentLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SkillEvolve
      </div>

      {/* Terminal */}
      <div style={{ opacity: cmdOpacity, marginBottom: 48 }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            color: COLORS.green,
            background: COLORS.bgCard,
            padding: "18px 40px",
            borderRadius: 14,
            border: `1px solid ${COLORS.bgCardBorder}`,
          }}
        >
          <span style={{ color: COLORS.textSecondary }}>$ </span>
          {typedCmd}
          {showCursor && <span style={{ color: COLORS.accent }}>|</span>}
        </div>
      </div>

      {/* URL + tagline */}
      <div
        style={{
          opacity: bottomOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.accentLight,
          }}
        >
          skill-evolve.com
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 17,
            color: COLORS.textSecondary,
          }}
        >
          Where AI Skills Evolve Together
        </div>
      </div>

      {/* Credit */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          opacity: creditOpacity,
          fontFamily: FONTS.body,
          fontSize: 14,
          color: COLORS.textMuted,
        }}
      >
        Built by Orchestra Research
      </div>
    </AbsoluteFill>
  );
};
