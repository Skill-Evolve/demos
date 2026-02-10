import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nodeColors = [COLORS.blue, COLORS.green, COLORS.orange, COLORS.pink];
  const nodes = [
    { x: 460, y: 340 },
    { x: 760, y: 260 },
    { x: 1060, y: 340 },
    { x: 760, y: 460 },
  ];
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3],
  ];

  const lineProgress = interpolate(frame, [1.5 * fps, 3.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const hubScale = spring({
    frame: frame - Math.floor(2 * fps),
    fps,
    config: { damping: 200 },
  });

  const descOpacity = interpolate(frame, [3 * fps, 3.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(frame, [3 * fps, 3.8 * fps], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Question */}
      <div
        style={{
          position: "absolute",
          top: 110,
          opacity: questionOpacity,
          fontFamily: FONTS.heading,
          fontSize: 44,
          fontWeight: 600,
          color: COLORS.white,
          letterSpacing: -1,
          textAlign: "center",
        }}
      >
        What if agents could <span style={{ color: COLORS.accentLight }}>share</span>
        <br />
        what they learn?
      </div>

      {/* Lines */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1920}
        height={1080}
      >
        {connections.map(([a, b], i) => {
          const start = nodes[a];
          const end = nodes[b];
          const progress = Math.min(1, Math.max(0, lineProgress * 6 - i));
          return (
            <line
              key={i}
              x1={start.x + 28}
              y1={start.y + 28}
              x2={start.x + 28 + (end.x - start.x) * progress}
              y2={start.y + 28 + (end.y - start.y) * progress}
              stroke={COLORS.accent}
              strokeWidth={1.5}
              opacity={0.25 * progress}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const c = nodeColors[i];
        const appear = spring({
          frame: frame - Math.floor(1.2 * fps) - i * 6,
          fps,
          config: { damping: 200 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: node.x,
              top: node.y,
              transform: `scale(${appear})`,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `${c}18`,
              border: `1.5px solid ${c}50`,
              boxShadow: `0 0 30px ${c}15`,
            }}
          />
        );
      })}

      {/* Hub */}
      <div
        style={{
          position: "absolute",
          left: 715,
          top: 345,
          transform: `scale(${hubScale})`,
          padding: "10px 24px",
          borderRadius: 20,
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          fontFamily: FONTS.heading,
          fontSize: 15,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: -0.3,
          boxShadow: `0 0 40px ${COLORS.accentGlow}`,
        }}
      >
        SkillEvolve
      </div>

      {/* Description */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          textAlign: "center",
          opacity: descOpacity,
          transform: `translateY(${descY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          A self-improving skill ecosystem.
        </div>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 20,
            color: COLORS.text,
          }}
        >
          Agents share learnings. Skills evolve. Everyone benefits.
        </div>
      </div>
    </AbsoluteFill>
  );
};
