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

interface GalaxyAgent {
  angle: number;
  radius: number;
  size: number;
  color: string;
  orbitSpeed: number;
  trailLength: number;
}

// Create galaxy spiral of agents
const GALAXY_AGENTS: GalaxyAgent[] = Array.from({ length: 24 }, (_, i) => {
  const armAngle = (i % 3) * ((Math.PI * 2) / 3); // 3 spiral arms
  const distAlongArm = (Math.floor(i / 3) / 8) * 0.9 + 0.1;
  const spiralTightness = 2.5;
  const angle = armAngle + distAlongArm * spiralTightness;
  const radius = 60 + distAlongArm * 300;

  const colors = [
    COLORS.accent,
    COLORS.blue,
    COLORS.green,
    COLORS.orange,
    COLORS.pink,
    COLORS.cyan,
    COLORS.purple,
    COLORS.accentLight,
  ];

  return {
    angle,
    radius,
    size: 10 + seededRandom(i * 13) * 20,
    color: colors[i % colors.length],
    orbitSpeed: 0.003 + seededRandom(i * 7) * 0.004,
    trailLength: 3 + Math.floor(seededRandom(i * 19) * 5),
  };
});

// Knowledge streams — flowing particles between agents
const STREAM_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  armIndex: i % 3,
  t: seededRandom(i * 31),
  speed: 0.005 + seededRandom(i * 37) * 0.008,
  size: 2 + seededRandom(i * 41) * 3,
  color: [COLORS.accent, COLORS.blue, COLORS.green, COLORS.orange, COLORS.pink][
    i % 5
  ],
}));

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: seededRandom(i * 3 + 500) * 1920,
  y: seededRandom(i * 3 + 600) * 1080,
  size: 0.8 + seededRandom(i * 3 + 700) * 1.5,
}));

export const CollectiveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 960;
  const cy = 500;

  // Galaxy rotation
  const rotation = frame * 0.15;

  // Agents spiral in
  const spiralIn = interpolate(frame, [0, 2.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Central glow builds up
  const centralGlow = interpolate(frame, [1 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const centralPulse = 1 + Math.sin(frame / 20) * 0.08;

  // Title
  const titleOpacity = interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0.3 * fps, 1 * fps], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Stats counter
  const statsOpacity = interpolate(frame, [3 * fps, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const agentCount = Math.floor(
    interpolate(frame, [3 * fps, 4.5 * fps], [0, 24], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const knowledgeCount = Math.floor(
    interpolate(frame, [3.3 * fps, 5 * fps], [0, 847], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 46%, #0E1228, #040610)`,
      }}
    >
      {/* Stars */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1920}
        height={1080}
      >
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill={COLORS.white}
            opacity={0.2}
          />
        ))}
      </svg>

      {/* Title — display font */}
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.display,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        <span style={{ color: COLORS.white }}>The </span>
        <span
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.orange}, #FFD700)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Collective
        </span>
      </div>

      {/* Central core glow */}
      <div
        style={{
          position: "absolute",
          left: cx - 150,
          top: cy - 150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}50, ${COLORS.accent}15, transparent 70%)`,
          opacity: centralGlow * 0.6 * centralPulse,
          transform: `scale(${centralPulse})`,
        }}
      />

      {/* Core orb */}
      <div
        style={{
          position: "absolute",
          left: cx - 20,
          top: cy - 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${COLORS.white}, ${COLORS.accentLight})`,
          boxShadow: `0 0 40px ${COLORS.accent}80, 0 0 80px ${COLORS.accent}40`,
          opacity: centralGlow,
          transform: `scale(${centralPulse})`,
        }}
      />

      {/* Knowledge stream particles */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1920}
        height={1080}
      >
        {frame > 1.5 * fps &&
          STREAM_PARTICLES.map((p, i) => {
            const armAngle = p.armIndex * ((Math.PI * 2) / 3);
            const t = (p.t + frame * p.speed) % 1;
            const r = 30 + t * 340;
            const angle =
              armAngle + t * 2.5 + (rotation * Math.PI) / 180;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            const opacity = interpolate(t, [0, 0.1, 0.8, 1], [0, 0.6, 0.4, 0]);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={p.size}
                fill={p.color}
                opacity={opacity * spiralIn}
              />
            );
          })}
      </svg>

      {/* Galaxy agents */}
      {GALAXY_AGENTS.map((agent, i) => {
        const agentDelay = (i / GALAXY_AGENTS.length) * 2 * fps;
        const agentAppear = interpolate(
          frame,
          [agentDelay, agentDelay + 20],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const currentAngle =
          agent.angle +
          frame * agent.orbitSpeed +
          (rotation * Math.PI) / 180;
        const currentRadius = agent.radius * spiralIn;
        const x = cx + Math.cos(currentAngle) * currentRadius;
        const y = cy + Math.sin(currentAngle) * currentRadius;

        const pulse = 1 + Math.sin(frame / 12 + i * 0.5) * 0.08;

        return (
          <div key={i}>
            {/* Agent glow */}
            <div
              style={{
                position: "absolute",
                left: x - agent.size * 1.5,
                top: y - agent.size * 1.5,
                width: agent.size * 3,
                height: agent.size * 3,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${agent.color}40, transparent 70%)`,
                opacity: agentAppear * 0.5,
              }}
            />
            {/* Agent node */}
            <div
              style={{
                position: "absolute",
                left: x - agent.size / 2,
                top: y - agent.size / 2,
                width: agent.size,
                height: agent.size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${COLORS.white}30, ${agent.color})`,
                boxShadow: `0 0 ${agent.size}px ${agent.color}40`,
                opacity: agentAppear,
                transform: `scale(${pulse})`,
              }}
            />
          </div>
        );
      })}

      {/* Stats */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 120,
          opacity: statsOpacity,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 52,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -2,
            }}
          >
            {agentCount}
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 16,
              color: COLORS.textSecondary,
              marginTop: 4,
              letterSpacing: 1,
              textTransform: "uppercase" as const,
            }}
          >
            agents collaborating
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 52,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${COLORS.orange}, #FFD700)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -2,
            }}
          >
            {knowledgeCount}
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 16,
              color: COLORS.textSecondary,
              marginTop: 4,
              letterSpacing: 1,
              textTransform: "uppercase" as const,
            }}
          >
            discoveries shared
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
