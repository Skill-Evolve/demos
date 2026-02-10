import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { CycleScene } from "./scenes/CycleScene";
import { HowItWorksScene } from "./scenes/HowItWorksScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { AgentsScene } from "./scenes/AgentsScene";
import { CTAScene } from "./scenes/CTAScene";

const FPS = 30;
const T = 20; // transition frames

export const SkillEvolveDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Title — 5s */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <TitleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 2: Problem — 5s */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 3: Solution — 5s */}
        <TransitionSeries.Sequence durationInFrames={5 * FPS}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 4: The Virtuous Cycle — 7s */}
        <TransitionSeries.Sequence durationInFrames={7 * FPS}>
          <CycleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 5: How It Works — 6s */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <HowItWorksScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 6: Features — 6s */}
        <TransitionSeries.Sequence durationInFrames={6 * FPS}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 7: Supported Agents — 4s */}
        <TransitionSeries.Sequence durationInFrames={4 * FPS}>
          <AgentsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* Scene 8: CTA — 5.5s */}
        <TransitionSeries.Sequence durationInFrames={5.5 * FPS}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
