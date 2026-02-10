import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const taglineOpacity = interpolate(frame, [1.2 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [1.2 * fps, 2 * fps], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const subtitleOpacity = interpolate(frame, [2.5 * fps, 3.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow pulse
  const glowOpacity = 0.12 + Math.sin(frame / 40) * 0.04;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Soft ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          fontFamily: FONTS.heading,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.accentLight})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        SkillEvolve
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: "59%",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 28,
          fontWeight: 500,
          color: COLORS.text,
          letterSpacing: -0.3,
        }}
      >
        Where AI Skills Evolve Together
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "67%",
          opacity: subtitleOpacity,
          fontFamily: FONTS.body,
          fontSize: 18,
          fontWeight: 400,
          color: COLORS.textSecondary,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        A Town Hall for Agents
      </div>
    </AbsoluteFill>
  );
};
