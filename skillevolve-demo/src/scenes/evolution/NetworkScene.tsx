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

interface Agent {
  x: number;
  y: number;
  size: number;
  color: string;
}

const AGENTS: Agent[] = [
  { x: 960, y: 480, size: 44, color: COLORS.accent },
  { x: 620, y: 320, size: 28, color: COLORS.blue },
  { x: 1300, y: 360, size: 32, color: COLORS.green },
  { x: 540, y: 640, size: 24, color: COLORS.orange },
  { x: 1360, y: 680, size: 30, color: COLORS.pink },
  { x: 760, y: 760, size: 26, color: COLORS.cyan },
  { x: 1140, y: 260, size: 22, color: COLORS.purple },
  { x: 1160, y: 740, size: 20, color: COLORS.accentLight },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6],
  [3, 5], [4, 7], [1, 6], [5, 7], [2, 4],
];

const PARTICLES = CONNECTIONS.map((conn, i) => ({
  conn,
  speed: 0.8 + seededRandom(i * 7) * 0.6,
  offset: seededRandom(i * 11) * Math.PI * 2,
  color: i % 2 === 0 ? AGENTS[conn[0]].color : AGENTS[conn[1]].color,
}));

// Grid lines for subtle background texture
const GRID_SPACING = 50;
const GRID_LINES_H = Math.ceil(1080 / GRID_SPACING);
const GRID_LINES_V = Math.ceil(1920 / GRID_SPACING);

export const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = (index: number) => {
    const delay = 0.3 * fps + index * 8;
    return interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  };

  const agentGrowth = (index: number) => {
    if (index === 0) return 1;
    const connectionsToAgent = CONNECTIONS.filter(
      (c) => c[0] === index || c[1] === index
    );
    const firstConnectionIdx = CONNECTIONS.indexOf(connectionsToAgent[0]);
    const delay = 0.3 * fps + firstConnectionIdx * 8 + 15;
    return spring({
      frame: frame - delay, fps,
      config: { damping: 14, stiffness: 100 },
    });
  };

  const agentPulseExtra = (index: number) => {
    let extra = 0;
    PARTICLES.forEach((p) => {
      if (p.conn[0] === index || p.conn[1] === index) {
        const t = ((frame * 0.02 * p.speed + p.offset) % 1 + 1) % 1;
        if (t > 0.9 || t < 0.1) extra = Math.max(extra, 0.3);
      }
    });
    return extra;
  };

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 0.5 * fps], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Grid fade in
  const gridOpacity = interpolate(frame, [0, 1 * fps], [0, 0.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Bottom text with highlight
  const textOpacity = interpolate(frame, [3.5 * fps, 4.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bothHighlight = spring({
    frame: frame - 4.2 * fps, fps,
    config: { damping: 200 }, durationInFrames: 18,
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        justifyContent: "center", alignItems: "center",
      }}
    >
      {/* Subtle grid overlay */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, opacity: gridOpacity }}
        width={1920} height={1080}
      >
        {Array.from({ length: GRID_LINES_V + 1 }, (_, i) => (
          <line key={`v${i}`}
            x1={i * GRID_SPACING} y1={0} x2={i * GRID_SPACING} y2={1080}
            stroke={COLORS.accentLight} strokeWidth={0.5} />
        ))}
        {Array.from({ length: GRID_LINES_H + 1 }, (_, i) => (
          <line key={`h${i}`}
            x1={0} y1={i * GRID_SPACING} x2={1920} y2={i * GRID_SPACING}
            stroke={COLORS.accentLight} strokeWidth={0.5} />
        ))}
      </svg>

      {/* Title — display font */}
      <div style={{
        position: "absolute", top: 60,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        fontFamily: FONTS.display, fontSize: 52, fontWeight: 700,
        background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.accentLight})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        letterSpacing: -2,
      }}>
        Connections Form
      </div>

      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1920} height={1080}
      >
        {/* Connection lines */}
        {CONNECTIONS.map(([a, b], i) => {
          const progress = lineProgress(i);
          const ax = AGENTS[a].x, ay = AGENTS[a].y;
          const bx = AGENTS[b].x, by = AGENTS[b].y;
          const endX = ax + (bx - ax) * progress;
          const endY = ay + (by - ay) * progress;
          return (
            <line key={i}
              x1={ax} y1={ay} x2={endX} y2={endY}
              stroke={COLORS.accent} strokeWidth={1.5}
              opacity={0.25 + progress * 0.2} />
          );
        })}

        {/* Knowledge particles */}
        {frame > 2 * fps &&
          PARTICLES.map((p, i) => {
            const progress = lineProgress(CONNECTIONS.indexOf(p.conn));
            if (progress < 1) return null;
            const [a, b] = p.conn;
            const t = ((frame * 0.02 * p.speed + p.offset) % 1 + 1) % 1;
            const px = AGENTS[a].x + (AGENTS[b].x - AGENTS[a].x) * t;
            const py = AGENTS[a].y + (AGENTS[b].y - AGENTS[a].y) * t;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={7} fill={p.color} opacity={0.12} />
                <circle cx={px} cy={py} r={3.5} fill={p.color} opacity={0.8} />
              </g>
            );
          })}
      </svg>

      {/* Agent nodes — 4-layer neural node */}
      {AGENTS.map((agent, i) => {
        const growth = agentGrowth(i);
        const extraPulse = agentPulseExtra(i);
        const size = agent.size * growth;
        const pulse = 1 + Math.sin(frame / 15 + i) * 0.04;
        return (
          <div key={i}>
            {/* L1: Glow */}
            <div style={{
              position: "absolute",
              left: agent.x - size * 2, top: agent.y - size * 2,
              width: size * 4, height: size * 4, borderRadius: "50%",
              background: `radial-gradient(circle, ${agent.color}40, transparent 70%)`,
              opacity: (0.2 + extraPulse) * growth,
            }} />
            {/* L2: Outer ring */}
            <div style={{
              position: "absolute",
              left: agent.x - size * 0.75, top: agent.y - size * 0.75,
              width: size * 1.5, height: size * 1.5, borderRadius: "50%",
              border: `1px solid ${agent.color}40`,
              opacity: growth * 0.5,
            }} />
            {/* L3: Core */}
            <div style={{
              position: "absolute",
              left: agent.x - size / 2, top: agent.y - size / 2,
              width: size, height: size, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${COLORS.white}35, ${agent.color})`,
              boxShadow: `0 0 ${20 + extraPulse * 40}px ${agent.color}60`,
              opacity: growth,
              transform: `scale(${pulse})`,
            }} />
            {/* L4: Inner highlight */}
            {size > 15 && (
              <div style={{
                position: "absolute",
                left: agent.x - size * 0.12, top: agent.y - size * 0.18,
                width: size * 0.3, height: size * 0.22, borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS.white}50, transparent)`,
                opacity: growth * 0.45,
              }} />
            )}
            {/* Label for center node */}
            {i === 0 && growth > 0.5 && (
              <div style={{
                position: "absolute",
                left: agent.x - 40, top: agent.y + size / 2 + 14,
                width: 80, textAlign: "center",
                fontFamily: FONTS.mono, fontSize: 11, fontWeight: 500,
                color: COLORS.text, opacity: growth * 0.8,
              }}>
                you
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom text with highlight on "both" */}
      <div style={{
        position: "absolute", bottom: 80,
        opacity: textOpacity,
        fontFamily: FONTS.display, fontSize: 28, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.3,
      }}>
        Every connection makes{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{
            position: "absolute", left: -4, right: -4,
            top: "50%", height: "1.1em",
            transform: `translateY(-50%) scaleX(${Math.max(0, Math.min(1, bothHighlight))})`,
            transformOrigin: "left center",
            backgroundColor: `${COLORS.green}30`, borderRadius: 6, zIndex: 0,
          }} />
          <span style={{
            position: "relative", zIndex: 1,
            color: bothHighlight > 0.3 ? COLORS.green : COLORS.textSecondary,
            fontWeight: bothHighlight > 0.3 ? 700 : 500,
          }}>both</span>
        </span>{" "}
        agents stronger.
      </div>
    </AbsoluteFill>
  );
};
