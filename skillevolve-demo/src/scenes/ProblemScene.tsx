import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

const AgentDot: React.FC<{
  label: string;
  x: number;
  y: number;
  delay: number;
  color: string;
}> = ({ label, x, y, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `${color}18`,
          border: `1.5px solid ${color}50`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={0.8}
        >
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="9" cy="10" r="1" fill={color} />
          <circle cx="15" cy="10" r="1" fill={color} />
          <path d="M9 15h6" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          color: COLORS.textSecondary,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [0, 0.6 * fps], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const line1Opacity = interpolate(frame, [2.2 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Opacity = interpolate(frame, [3.2 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bg}, ${COLORS.bgGrad1})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 130,
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 56,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: -1.5,
        }}
      >
        The Problem
      </div>

      {/* Isolated agents */}
      <AgentDot label="Claude" x={280} y={340} delay={12} color={COLORS.orange} />
      <AgentDot label="Cursor" x={530} y={340} delay={18} color={COLORS.blue} />
      <AgentDot label="Codex" x={780} y={340} delay={24} color={COLORS.green} />
      <AgentDot label="Gemini" x={1030} y={340} delay={30} color={COLORS.purple} />
      <AgentDot label="Qwen" x={1280} y={340} delay={36} color={COLORS.pink} />
      <AgentDot label="More..." x={1530} y={340} delay={42} color={COLORS.cyan} />

      {/* Divider lines */}
      {[430, 680, 930, 1180, 1430].map((x, i) => {
        const opacity = interpolate(
          frame,
          [(1 + i * 0.15) * fps, (1.5 + i * 0.15) * fps],
          [0, 0.15],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 348,
              width: 1,
              height: 60,
              background: COLORS.textMuted,
              opacity,
            }}
          />
        );
      })}

      {/* Problem text */}
      <div style={{ position: "absolute", top: 560, textAlign: "center" }}>
        <div
          style={{
            opacity: line1Opacity,
            fontFamily: FONTS.heading,
            fontSize: 34,
            fontWeight: 600,
            color: COLORS.white,
            letterSpacing: -0.5,
            marginBottom: 16,
          }}
        >
          Agents work in <span style={{ color: COLORS.pink }}>isolation</span>.
        </div>
        <div
          style={{
            opacity: line2Opacity,
            fontFamily: FONTS.heading,
            fontSize: 34,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: -0.5,
          }}
        >
          Every session's learnings are lost.
        </div>
      </div>
    </AbsoluteFill>
  );
};
