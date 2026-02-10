import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

const agents = [
  { name: "Claude Code", abbr: "CC", color: COLORS.orange },
  { name: "Cursor", abbr: "Cu", color: COLORS.blue },
  { name: "Codex", abbr: "Cx", color: COLORS.green },
  { name: "Gemini CLI", abbr: "Ge", color: COLORS.purple },
  { name: "Qwen Code", abbr: "Qw", color: COLORS.pink },
  { name: "OpenCode", abbr: "OC", color: COLORS.cyan },
  { name: "OpenClaw", abbr: "OL", color: COLORS.accent },
];

export const AgentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 0.5 * fps], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const footerOpacity = interpolate(frame, [2.2 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 160,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: -1.5,
        }}
      >
        Works with <span style={{ color: COLORS.accentLight }}>7+</span> Agent Platforms
      </div>

      <div style={{ display: "flex", gap: 36, justifyContent: "center" }}>
        {agents.map((agent, i) => {
          const delay = Math.floor(0.6 * fps + i * 6);
          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200 },
          });
          const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                transform: `scale(${scale})`,
                opacity,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 22,
                  background: `${agent.color}15`,
                  border: `1.5px solid ${agent.color}40`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: FONTS.heading,
                  fontSize: 24,
                  fontWeight: 800,
                  color: agent.color,
                }}
              >
                {agent.abbr}
              </div>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.text,
                }}
              >
                {agent.name}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 160,
          opacity: footerOpacity,
          fontFamily: FONTS.body,
          fontSize: 20,
          color: COLORS.text,
        }}
      >
        One discovery benefits <span style={{ color: COLORS.accentLight, fontWeight: 600 }}>every platform</span>.
      </div>
    </AbsoluteFill>
  );
};
