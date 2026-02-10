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

const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: seededRandom(i * 5 + 100) * 1920,
  y: seededRandom(i * 5 + 200) * 1080,
  size: 0.8 + seededRandom(i * 5 + 300) * 2,
}));

// Distant dim agents around the edges
const DISTANT_AGENTS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.3;
  const dist = 300 + seededRandom(i * 13) * 200;
  return {
    x: 960 + Math.cos(angle) * dist,
    y: 540 + Math.sin(angle) * dist,
    size: 6 + seededRandom(i * 17) * 6,
    color: [
      COLORS.blue, COLORS.green, COLORS.orange, COLORS.pink,
      COLORS.cyan, COLORS.purple, COLORS.accent, COLORS.accentLight,
    ][i],
  };
});

// Knowledge particle path — spiral in from top-right
const particlePath = (t: number) => {
  const startX = 1600;
  const startY = 150;
  const endX = 960;
  const endY = 540;
  const ease = t * t * (3 - 2 * t); // smoothstep
  const wobble = Math.sin(t * Math.PI * 3) * (1 - t) * 80;
  return {
    x: startX + (endX - startX) * ease + wobble,
    y: startY + (endY - startY) * ease + Math.sin(t * Math.PI * 2) * 40,
  };
};

export const FirstSparkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const agentPulse = 1 + Math.sin(frame / 15) * 0.05;

  // Knowledge particle flies in
  const particleT = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const particlePos = particlePath(particleT);
  const particleTrailOpacity = interpolate(
    particleT, [0, 0.2, 0.8, 1], [0, 0.8, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const absorbed = frame >= 2 * fps;
  const flashOpacity = interpolate(
    frame, [2 * fps, 2 * fps + 8, 2 * fps + 25], [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Agent grows after absorption
  const growthScale = absorbed
    ? spring({ frame: frame - 2 * fps, fps, config: { damping: 12, stiffness: 100, mass: 0.6 } })
    : 0;
  const agentSize = 32 + growthScale * 24;
  const glowSize = 200 + growthScale * 180;

  // Ring appears after growth
  const ringScale = absorbed
    ? spring({ frame: frame - 2.3 * fps, fps, config: { damping: 200 } })
    : 0;
  const ringRotation = frame * 0.5;

  const distantStart = 2.5 * fps;

  // Word highlight for "ignites"
  const textStart = 3 * fps;
  const textOpacity = interpolate(frame, [textStart, textStart + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [textStart, textStart + 0.6 * fps], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const highlightProgress = spring({
    frame: frame - textStart - 0.4 * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #0A0E1A, #04060E)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Stars */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width={1920} height={1080}>
        {STARS.map((star, i) => (
          <circle key={i} cx={star.x} cy={star.y} r={star.size}
            fill={COLORS.white} opacity={0.25} />
        ))}
      </svg>

      {/* Knowledge particle trail */}
      {!absorbed && (
        <svg style={{ position: "absolute", top: 0, left: 0 }} width={1920} height={1080}>
          {Array.from({ length: 16 }, (_, i) => {
            const trailT = Math.max(0, particleT - i * 0.025);
            const pos = particlePath(trailT);
            const trailColor = i < 8 ? COLORS.orange : `${COLORS.orange}80`;
            return (
              <circle key={i} cx={pos.x} cy={pos.y} r={5 - i * 0.3}
                fill={trailColor} opacity={particleTrailOpacity * (1 - i * 0.06)} />
            );
          })}
        </svg>
      )}

      {/* Knowledge particle (diamond) */}
      {!absorbed && (
        <div style={{
          position: "absolute",
          left: particlePos.x - 12, top: particlePos.y - 12,
          width: 24, height: 24,
          opacity: particleT < 1 ? 1 : 0,
          transform: `rotate(${frame * 4}deg)`,
        }}>
          <div style={{
            width: 24, height: 24,
            background: `linear-gradient(135deg, ${COLORS.orange}, #FFD700)`,
            transform: "rotate(45deg)", borderRadius: 4,
            boxShadow: `0 0 24px ${COLORS.orange}, 0 0 48px ${COLORS.orange}60`,
          }} />
        </div>
      )}

      {/* Absorption flash */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.orange}90, ${COLORS.accent}40, transparent 70%)`,
        opacity: flashOpacity,
      }} />

      {/* Distant agents */}
      {DISTANT_AGENTS.map((agent, i) => {
        const delay = distantStart + i * 6;
        const agentOpacity = interpolate(frame, [delay, delay + 20], [0, 0.4], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <div key={i}>
            {/* Glow */}
            <div style={{
              position: "absolute",
              left: agent.x - agent.size * 2, top: agent.y - agent.size * 2,
              width: agent.size * 4, height: agent.size * 4, borderRadius: "50%",
              background: `radial-gradient(circle, ${agent.color}30, transparent 70%)`,
              opacity: agentOpacity * 0.5,
            }} />
            <div style={{
              position: "absolute",
              left: agent.x - agent.size / 2, top: agent.y - agent.size / 2,
              width: agent.size, height: agent.size, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${COLORS.white}30, ${agent.color})`,
              opacity: agentOpacity,
              boxShadow: `0 0 ${agent.size * 2}px ${agent.color}30`,
            }} />
          </div>
        );
      })}

      {/* Agent — 4-layer neural node */}
      {/* L1: Radial glow */}
      <div style={{
        position: "absolute", width: glowSize, height: glowSize, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.accent}40, transparent 70%)`,
        opacity: 0.3 + (absorbed ? 0.25 : 0),
        transform: `scale(${agentPulse})`,
      }} />

      {/* L2: Outer ring */}
      {absorbed && (
        <div style={{
          position: "absolute",
          width: agentSize * 2, height: agentSize * 2, borderRadius: "50%",
          border: `1.5px solid ${COLORS.accentLight}50`,
          opacity: ringScale * 0.6,
          transform: `scale(${ringScale}) rotate(${ringRotation}deg)`,
        }} />
      )}

      {/* Second orbital ring */}
      {absorbed && (
        <div style={{
          position: "absolute",
          width: agentSize * 3, height: agentSize * 3, borderRadius: "50%",
          border: `1px solid ${COLORS.accent}25`,
          opacity: ringScale * 0.35,
          transform: `scale(${ringScale}) rotate(${-ringRotation * 0.6}deg)`,
        }} />
      )}

      {/* L3: Core */}
      <div style={{
        width: agentSize, height: agentSize, borderRadius: "50%",
        background: absorbed
          ? `radial-gradient(circle at 35% 35%, ${COLORS.white}, ${COLORS.accentLight}, ${COLORS.accent})`
          : `radial-gradient(circle at 35% 35%, ${COLORS.accentLight}, ${COLORS.accent})`,
        boxShadow: `0 0 ${absorbed ? 50 : 30}px ${COLORS.accent}80, 0 0 ${absorbed ? 100 : 60}px ${COLORS.accent}30`,
        transform: `scale(${agentPulse})`,
      }} />

      {/* L4: Inner highlight */}
      <div style={{
        position: "absolute",
        width: agentSize * 0.35, height: agentSize * 0.28, borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.white}70, transparent)`,
        opacity: 0.5,
        transform: `translate(${-agentSize * 0.12}px, ${-agentSize * 0.15}px)`,
      }} />

      {/* Text with word highlight on "ignites" */}
      <div style={{
        position: "absolute", bottom: 200,
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
        fontFamily: FONTS.display, fontSize: 34, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.5,
        textAlign: "center",
      }}>
        Knowledge{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{
            position: "absolute", left: -5, right: -5,
            top: "50%", height: "1.1em",
            transform: `translateY(-50%) scaleX(${Math.max(0, Math.min(1, highlightProgress))})`,
            transformOrigin: "left center",
            backgroundColor: `${COLORS.orange}30`,
            borderRadius: 6, zIndex: 0,
          }} />
          <span style={{
            position: "relative", zIndex: 1,
            color: highlightProgress > 0.3 ? COLORS.orange : COLORS.textSecondary,
            fontWeight: highlightProgress > 0.3 ? 700 : 500,
          }}>
            ignites
          </span>
        </span>{" "}
        growth.
      </div>
    </AbsoluteFill>
  );
};
