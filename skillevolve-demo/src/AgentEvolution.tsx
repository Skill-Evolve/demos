import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { GenesisScene } from "./scenes/evolution/GenesisScene";
import { FirstSparkScene } from "./scenes/evolution/FirstSparkScene";
import { NetworkScene } from "./scenes/evolution/NetworkScene";
import { SwarmScene } from "./scenes/evolution/SwarmScene";
import { EvolutionStagesScene } from "./scenes/evolution/EvolutionStagesScene";
import { CollectiveScene } from "./scenes/evolution/CollectiveScene";
import { ClosingScene } from "./scenes/evolution/ClosingScene";

const FPS = 30;
const T = 24; // transition frames — slightly longer for cinematic feel

export const AgentEvolution: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Genesis — lone agent in the void (5s) */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <GenesisScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 2: First Spark — knowledge ignites growth (5s) */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <FirstSparkScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 3: Network — connections form (6s) */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <NetworkScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 4: Swarm — knowledge rewrites DNA (7s) */}
        <TransitionSeries.Sequence durationInFrames={7 * FPS}>
          <SwarmScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 5: Evolution Stages — isolation to collective (7s) */}
        <TransitionSeries.Sequence durationInFrames={7 * FPS}>
          <EvolutionStagesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 6: The Collective — galaxy of agents (6s) */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <CollectiveScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 7: Closing — constellation resolves to logo (5.5s) */}
        <TransitionSeries.Sequence durationInFrames={5.5 * FPS}>
          <ClosingScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
