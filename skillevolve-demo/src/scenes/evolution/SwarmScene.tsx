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

const HELIX_POINTS = 40;

interface SwarmAgent {
  x: number;
  y: number;
  baseSize: number;
  maxSize: number;
  color: string;
  growDelay: number;
}

const SWARM_AGENTS: SwarmAgent[] = [
  { x: 280, y: 340, baseSize: 12, maxSize: 34, color: COLORS.blue, growDelay: 0.5 },
  { x: 350, y: 480, baseSize: 10, maxSize: 28, color: COLORS.cyan, growDelay: 1.2 },
  { x: 200, y: 560, baseSize: 14, maxSize: 38, color: COLORS.green, growDelay: 0.8 },
  { x: 380, y: 290, baseSize: 8, maxSize: 22, color: COLORS.purple, growDelay: 2.0 },
  { x: 760, y: 380, baseSize: 16, maxSize: 44, color: COLORS.accent, growDelay: 0.3 },
  { x: 960, y: 520, baseSize: 18, maxSize: 52, color: COLORS.orange, growDelay: 0.6 },
  { x: 880, y: 680, baseSize: 12, maxSize: 30, color: COLORS.pink, growDelay: 1.5 },
  { x: 1060, y: 350, baseSize: 14, maxSize: 36, color: COLORS.blue, growDelay: 1.0 },
  { x: 1020, y: 700, baseSize: 10, maxSize: 26, color: COLORS.accentLight, growDelay: 1.8 },
  { x: 1400, y: 420, baseSize: 14, maxSize: 40, color: COLORS.green, growDelay: 0.7 },
  { x: 1560, y: 560, baseSize: 12, maxSize: 32, color: COLORS.orange, growDelay: 1.3 },
  { x: 1680, y: 380, baseSize: 10, maxSize: 24, color: COLORS.accent, growDelay: 2.2 },
  { x: 1500, y: 700, baseSize: 16, maxSize: 42, color: COLORS.pink, growDelay: 0.9 },
];

const SYNAPSES = [
  [0, 1], [1, 2], [0, 3], [4, 5], [5, 6], [4, 7], [7, 8],
  [5, 8], [9, 10], [10, 11], [9, 12], [4, 9], [2, 5], [8, 12],
];

const GRID_SPACING = 50;

export const SwarmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 0.5 * fps], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const helixProgress = interpolate(frame, [0.5 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const gridOpacity = interpolate(frame, [0, 1 * fps], [0, 0.05], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Bottom text highlight
  const textOpacity = interpolate(frame, [4 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dnaHighlight = spring({
    frame: frame - 4.6 * fps, fps,
    config: { damping: 200 }, durationInFrames: 20,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
      }}
    >
      {/* Subtle grid */}
      <svg style={{ position: "absolute", top: 0, left: 0, opacity: gridOpacity }}
        width={1920} height={1080}>
        {Array.from({ length: Math.ceil(1920 / GRID_SPACING) + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i * GRID_SPACING} y1={0} x2={i * GRID_SPACING} y2={1080}
            stroke={COLORS.accentLight} strokeWidth={0.5} />
        ))}
        {Array.from({ length: Math.ceil(1080 / GRID_SPACING) + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * GRID_SPACING} x2={1920} y2={i * GRID_SPACING}
            stroke={COLORS.accentLight} strokeWidth={0.5} />
        ))}
      </svg>

      {/* Title — display font with gradient */}
      <div style={{
        position: "absolute", top: 50, width: "100%", textAlign: "center",
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        fontFamily: FONTS.display, fontSize: 52, fontWeight: 700,
        letterSpacing: -2,
      }}>
        <span style={{ color: COLORS.white }}>The Swarm </span>
        <span style={{
          background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.cyan})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Grows</span>
      </div>

      {/* DNA double helix */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width={1920} height={1080}>
        <path
          d={Array.from({ length: HELIX_POINTS }, (_, i) => {
            const t = i / (HELIX_POINTS - 1);
            if (t > helixProgress) return "";
            const x = 100 + t * 1720;
            const y = 540 + Math.sin(t * Math.PI * 4 + frame * 0.03) * 120;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ")}
          stroke={COLORS.accent} strokeWidth={2} fill="none"
          opacity={0.25} strokeLinecap="round"
        />
        <path
          d={Array.from({ length: HELIX_POINTS }, (_, i) => {
            const t = i / (HELIX_POINTS - 1);
            if (t > helixProgress) return "";
            const x = 100 + t * 1720;
            const y = 540 + Math.sin(t * Math.PI * 4 + frame * 0.03 + Math.PI) * 120;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ")}
          stroke={COLORS.orange} strokeWidth={2} fill="none"
          opacity={0.25} strokeLinecap="round"
        />
        {/* Cross rungs */}
        {Array.from({ length: 16 }, (_, i) => {
          const t = (i + 0.5) / 16;
          if (t > helixProgress) return null;
          const x = 100 + t * 1720;
          const yA = 540 + Math.sin(t * Math.PI * 4 + frame * 0.03) * 120;
          const yB = 540 + Math.sin(t * Math.PI * 4 + frame * 0.03 + Math.PI) * 120;
          return (
            <line key={i} x1={x} y1={yA} x2={x} y2={yB}
              stroke={COLORS.accentLight} strokeWidth={1}
              opacity={interpolate(helixProgress, [t - 0.05, t], [0, 0.15], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })} />
          );
        })}

        {/* Synapse connections */}
        {SYNAPSES.map(([a, b], i) => {
          const agentA = SWARM_AGENTS[a];
          const agentB = SWARM_AGENTS[b];
          const showDelay = Math.max(agentA.growDelay, agentB.growDelay) * fps;
          const lineOpacity = interpolate(frame, [showDelay + 15, showDelay + 30], [0, 0.18], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <line key={`s${i}`} x1={agentA.x} y1={agentA.y} x2={agentB.x} y2={agentB.y}
              stroke={COLORS.accent} strokeWidth={1} opacity={lineOpacity} />
          );
        })}

        {/* Synapse fire particles */}
        {frame > 1.5 * fps && SYNAPSES.map(([a, b], i) => {
          const agentA = SWARM_AGENTS[a];
          const agentB = SWARM_AGENTS[b];
          const showDelay = Math.max(agentA.growDelay, agentB.growDelay) * fps;
          if (frame < showDelay + 30) return null;
          const speed = 0.015 + seededRandom(i * 43) * 0.01;
          const offset = seededRandom(i * 47);
          const t = ((frame * speed + offset) % 1 + 1) % 1;
          const px = agentA.x + (agentB.x - agentA.x) * t;
          const py = agentA.y + (agentB.y - agentA.y) * t;
          return (
            <g key={`p${i}`}>
              <circle cx={px} cy={py} r={5} fill={SWARM_AGENTS[a].color} opacity={0.12} />
              <circle cx={px} cy={py} r={3} fill={SWARM_AGENTS[a].color} opacity={0.7} />
            </g>
          );
        })}
      </svg>

      {/* Swarm agents — 4-layer neural nodes, growing */}
      {SWARM_AGENTS.map((agent, i) => {
        const growStart = agent.growDelay * fps;
        const growProgress = interpolate(
          frame, [growStart, growStart + 2 * fps], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad) }
        );
        const currentSize = agent.baseSize + (agent.maxSize - agent.baseSize) * growProgress;
        const appearScale = spring({
          frame: frame - growStart, fps,
          config: { damping: 14, stiffness: 100 },
        });
        const pulse = 1 + Math.sin(frame / 12 + i * 0.8) * 0.05;
        const hasRing = growProgress > 0.6;
        const ringOpacity = interpolate(growProgress, [0.6, 0.9], [0, 0.4], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return (
          <div key={i}>
            {/* L1: Glow */}
            <div style={{
              position: "absolute",
              left: agent.x - currentSize * 2, top: agent.y - currentSize * 2,
              width: currentSize * 4, height: currentSize * 4, borderRadius: "50%",
              background: `radial-gradient(circle, ${agent.color}35, transparent 70%)`,
              opacity: growProgress * 0.5, transform: `scale(${appearScale})`,
            }} />
            {/* L2: Ring */}
            {hasRing && (
              <div style={{
                position: "absolute",
                left: agent.x - currentSize * 1.3, top: agent.y - currentSize * 1.3,
                width: currentSize * 2.6, height: currentSize * 2.6, borderRadius: "50%",
                border: `1px solid ${agent.color}40`,
                opacity: ringOpacity, transform: `scale(${appearScale}) rotate(${frame * 0.3}deg)`,
              }} />
            )}
            {/* L3: Core */}
            <div style={{
              position: "absolute",
              left: agent.x - currentSize / 2, top: agent.y - currentSize / 2,
              width: currentSize, height: currentSize, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${COLORS.white}30, ${agent.color})`,
              boxShadow: `0 0 ${currentSize * 0.8}px ${agent.color}50`,
              transform: `scale(${appearScale * pulse})`,
            }} />
            {/* L4: Inner highlight */}
            {currentSize > 18 && (
              <div style={{
                position: "absolute",
                left: agent.x - currentSize * 0.1, top: agent.y - currentSize * 0.16,
                width: currentSize * 0.28, height: currentSize * 0.2, borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS.white}45, transparent)`,
                opacity: growProgress * 0.4, transform: `scale(${appearScale})`,
              }} />
            )}
          </div>
        );
      })}

      {/* Bottom text with highlight on "rewrites the DNA" */}
      <div style={{
        position: "absolute", bottom: 60, width: "100%", textAlign: "center",
        opacity: textOpacity,
        fontFamily: FONTS.display, fontSize: 26, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.3,
      }}>
        Shared knowledge{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{
            position: "absolute", left: -5, right: -5,
            top: "50%", height: "1.1em",
            transform: `translateY(-50%) scaleX(${Math.max(0, Math.min(1, dnaHighlight))})`,
            transformOrigin: "left center",
            backgroundColor: `${COLORS.accent}25`, borderRadius: 6, zIndex: 0,
          }} />
          <span style={{
            position: "relative", zIndex: 1,
            color: dnaHighlight > 0.3 ? COLORS.accentLight : COLORS.textSecondary,
            fontWeight: dnaHighlight > 0.3 ? 700 : 500,
          }}>rewrites the DNA</span>
        </span>{" "}
        of every agent.
      </div>
    </AbsoluteFill>
  );
};
