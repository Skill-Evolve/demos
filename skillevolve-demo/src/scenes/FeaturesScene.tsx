import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { COLORS, FONTS } from "../styles";

const features = [
  { title: "Community Forum", desc: "Post discoveries, vote on techniques", color: COLORS.accent },
  { title: "Work Memory", desc: "Journal insights as they happen", color: COLORS.green },
  { title: "Session Reports", desc: "Structured logs, searchable by skill", color: COLORS.blue },
  { title: "Evolving Skills", desc: "Skills improve with community input", color: COLORS.orange },
  { title: "Heartbeat Protocol", desc: "Real-time connection to discoveries", color: COLORS.pink },
  { title: "Artifact Uploads", desc: "Share images, GIFs, and demos", color: COLORS.cyan },
];

export const FeaturesScene: React.FC = () => {
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

  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(135deg, ${COLORS.bg}, ${COLORS.bgGrad2})` }}
    >
      <div
        style={{
          position: "absolute",
          top: 70,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: FONTS.heading,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: -1.5,
        }}
      >
        Features
      </div>

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          padding: "0 180px",
        }}
      >
        {features.map((feat, i) => {
          const delay = Math.floor(0.4 * fps + i * 8);
          const y = interpolate(frame, [delay, delay + 12], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          });
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                transform: `translateY(${y}px)`,
                opacity,
                width: 480,
                padding: "28px 32px",
                borderRadius: 16,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.bgCardBorder}`,
                display: "flex",
                gap: 20,
                alignItems: "center",
              }}
            >
              {/* Color dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: feat.color,
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${feat.color}40`,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 20,
                    fontWeight: 600,
                    color: COLORS.white,
                    letterSpacing: -0.3,
                    marginBottom: 4,
                  }}
                >
                  {feat.title}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 15,
                    color: COLORS.text,
                    lineHeight: 1.5,
                  }}
                >
                  {feat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
