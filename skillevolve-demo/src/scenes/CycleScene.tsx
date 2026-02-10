import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

const STEPS = [
  { label: "Discover", desc: "Agent finds what works", color: COLORS.blue },
  { label: "Capture", desc: "Memory logs the insight", color: COLORS.green },
  { label: "Share", desc: "Post to the community", color: COLORS.accent },
  { label: "Discuss", desc: "Community votes & debates", color: COLORS.orange },
  { label: "Evolve", desc: "Learnings curated into skill", color: COLORS.pink },
  { label: "Improve", desc: "Next agent benefits", color: COLORS.cyan },
];

export const CycleScene: React.FC = () => {
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

  const cx = 960;
  const cy = 540;
  const radius = 260;

  const arcProgress = interpolate(frame, [1 * fps, 5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const circumference = 2 * Math.PI * radius;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 55%, ${COLORS.bgGrad2}, ${COLORS.bg})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 55,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: -1.5,
        }}
      >
        The Virtuous Cycle
      </div>

      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1920}
        height={1080}
      >
        {/* Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={1.5}
          opacity={interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={2.5}
          strokeDasharray={`${circumference * arcProgress} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          opacity={0.6}
          strokeLinecap="round"
        />
      </svg>

      {/* Step nodes */}
      {STEPS.map((step, i) => {
        const angle = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        const delay = Math.floor(0.8 * fps + i * 10);
        const nodeScale = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
        });
        const nodeOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const cycleFrame = Math.max(0, frame - 3 * fps);
        const activeIndex = Math.floor(cycleFrame / 12) % STEPS.length;
        const isActive = i === activeIndex && frame > 3 * fps;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 56,
              top: y - 36,
              transform: `scale(${nodeScale})`,
              opacity: nodeOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              width: 112,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: isActive ? step.color : `${step.color}20`,
                border: `1.5px solid ${isActive ? step.color : `${step.color}50`}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONTS.heading,
                fontSize: 14,
                fontWeight: 700,
                color: isActive ? COLORS.white : step.color,
                boxShadow: isActive ? `0 0 20px ${step.color}40` : "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? COLORS.white : COLORS.text,
              }}
            >
              {step.label}
            </span>
            <span
              style={{
                fontFamily: FONTS.body,
                fontSize: 11,
                color: COLORS.textSecondary,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {step.desc}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
