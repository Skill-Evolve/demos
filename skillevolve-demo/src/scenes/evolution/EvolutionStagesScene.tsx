import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../../styles";

interface Stage {
  label: string;
  description: string;
  size: number;
  glowSize: number;
  rings: number;
  orbits: number;
  color: string;
  secondaryColor: string;
}

const STAGES: Stage[] = [
  {
    label: "Isolated",
    description: "No shared knowledge",
    size: 16, glowSize: 40, rings: 0, orbits: 0,
    color: COLORS.textMuted, secondaryColor: COLORS.textMuted,
  },
  {
    label: "Connected",
    description: "First contributions",
    size: 32, glowSize: 100, rings: 1, orbits: 0,
    color: COLORS.blue, secondaryColor: COLORS.cyan,
  },
  {
    label: "Experienced",
    description: "Rich craft knowledge",
    size: 48, glowSize: 180, rings: 2, orbits: 3,
    color: COLORS.accent, secondaryColor: COLORS.accentLight,
  },
  {
    label: "Evolved",
    description: "Collective intelligence",
    size: 72, glowSize: 300, rings: 3, orbits: 6,
    color: "#E8A030", secondaryColor: "#FFD700",
  },
];

const Arrow: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => (
  <svg style={{ position: "absolute", left: x, top: 480 }}
    width={60} height={40} opacity={opacity}>
    <path d="M5 20 L45 20 M35 10 L45 20 L35 30"
      stroke={COLORS.textMuted} strokeWidth={2} fill="none" strokeLinecap="round" />
  </svg>
);

export const EvolutionStagesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 0.5 * fps], [12, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const stageX = [240, 600, 960, 1320];
  const stageY = 480;

  const timelineProgress = interpolate(frame, [0.8 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 55%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
      }}
    >
      {/* Title — display font with gradient */}
      <div style={{
        position: "absolute", top: 80, width: "100%", textAlign: "center",
        opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        fontFamily: FONTS.display, fontSize: 52, fontWeight: 700, letterSpacing: -2,
      }}>
        <span style={{
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.accentLight}, ${COLORS.orange})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          The Evolution of an Agent
        </span>
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", top: 148, width: "100%", textAlign: "center",
        opacity: titleOpacity * 0.7,
        fontFamily: FONTS.body, fontSize: 20, color: COLORS.textSecondary,
      }}>
        From isolation to collective intelligence
      </div>

      {/* Timeline bar — gradient */}
      <div style={{
        position: "absolute", left: stageX[0], top: stageY,
        width: (stageX[3] - stageX[0]) * timelineProgress, height: 2,
        background: `linear-gradient(90deg, ${COLORS.textMuted}, ${COLORS.blue}, ${COLORS.accent}, #E8A030)`,
        opacity: 0.4,
      }} />

      {/* Arrows */}
      {[0, 1, 2].map((i) => {
        const arrowDelay = 1.5 * fps + i * fps;
        const arrowOpacity = interpolate(frame, [arrowDelay, arrowDelay + 15], [0, 0.5], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return <Arrow key={i} x={(stageX[i] + stageX[i + 1]) / 2 - 30} opacity={arrowOpacity} />;
      })}

      {/* Stages — 4-layer nodes */}
      {STAGES.map((stage, i) => {
        const delay = Math.floor(1 * fps + i * 0.9 * fps);
        const stageScale = spring({
          frame: frame - delay, fps,
          config: { damping: 12, stiffness: 100, mass: 0.5 + i * 0.2 },
        });
        const stageOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const pulse = 1 + Math.sin(frame / (12 + i * 3) + i) * 0.03;
        const x = stageX[i];
        const y = stageY;

        return (
          <div key={i}>
            {/* L1: Glow */}
            <div style={{
              position: "absolute",
              left: x - stage.glowSize / 2, top: y - stage.glowSize / 2,
              width: stage.glowSize, height: stage.glowSize, borderRadius: "50%",
              background: `radial-gradient(circle, ${stage.color}40, transparent 70%)`,
              opacity: stageOpacity * 0.4, transform: `scale(${stageScale * pulse})`,
            }} />

            {/* L2: Orbital rings */}
            {Array.from({ length: stage.rings }, (_, r) => {
              const ringSize = stage.size * (2 + r * 0.9);
              const ringRotation = frame * (0.3 + r * 0.2) * (r % 2 === 0 ? 1 : -1);
              return (
                <div key={r} style={{
                  position: "absolute",
                  left: x - ringSize / 2, top: y - ringSize / 2,
                  width: ringSize, height: ringSize, borderRadius: "50%",
                  border: `1px solid ${stage.color}30`,
                  opacity: stageOpacity * (0.45 - r * 0.1),
                  transform: `scale(${stageScale}) rotate(${ringRotation}deg)`,
                }} />
              );
            })}

            {/* Orbiting knowledge particles */}
            {Array.from({ length: stage.orbits }, (_, o) => {
              const orbitRadius = stage.size * (1.2 + o * 0.5);
              const orbitAngle = frame * (0.04 + o * 0.01) + (o * Math.PI * 2) / stage.orbits;
              const ox = x + Math.cos(orbitAngle) * orbitRadius;
              const oy = y + Math.sin(orbitAngle) * orbitRadius;
              return (
                <div key={o}>
                  <div style={{
                    position: "absolute", left: ox - 5, top: oy - 5,
                    width: 10, height: 10, borderRadius: "50%",
                    background: stage.secondaryColor, opacity: stageOpacity * 0.15,
                    transform: `scale(${stageScale})`,
                  }} />
                  <div style={{
                    position: "absolute", left: ox - 3, top: oy - 3,
                    width: 6, height: 6, borderRadius: "50%",
                    background: stage.secondaryColor, opacity: stageOpacity * 0.8,
                    transform: `scale(${stageScale})`,
                    boxShadow: `0 0 8px ${stage.secondaryColor}60`,
                  }} />
                </div>
              );
            })}

            {/* L3: Core orb */}
            <div style={{
              position: "absolute",
              left: x - stage.size / 2, top: y - stage.size / 2,
              width: stage.size, height: stage.size, borderRadius: "50%",
              background: i === 0
                ? stage.color
                : `radial-gradient(circle at 35% 35%, ${stage.secondaryColor}, ${stage.color})`,
              boxShadow: i > 0 ? `0 0 ${stage.size}px ${stage.color}50` : "none",
              opacity: stageOpacity, transform: `scale(${stageScale * pulse})`,
            }} />

            {/* L4: Inner highlight */}
            {i >= 2 && (
              <div style={{
                position: "absolute",
                left: x - stage.size * 0.12, top: y - stage.size * 0.18,
                width: stage.size * 0.28, height: stage.size * 0.22, borderRadius: "50%",
                background: `radial-gradient(circle, ${COLORS.white}50, transparent)`,
                opacity: stageOpacity * 0.5, transform: `scale(${stageScale})`,
              }} />
            )}

            {/* Label — display font */}
            <div style={{
              position: "absolute",
              left: x - 80, top: y + stage.size / 2 + stage.glowSize * 0.15 + 20,
              width: 160, textAlign: "center",
              opacity: stageOpacity, transform: `scale(${stageScale})`,
            }}>
              <div style={{
                fontFamily: FONTS.display, fontSize: 20, fontWeight: 700,
                color: stage.color === COLORS.textMuted ? COLORS.text : stage.color,
                marginBottom: 6,
              }}>
                {stage.label}
              </div>
              <div style={{
                fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary,
              }}>
                {stage.description}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
