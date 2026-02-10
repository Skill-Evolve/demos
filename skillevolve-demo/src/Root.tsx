import { Composition } from "remotion";
import { SkillEvolveDemo } from "./SkillEvolveDemo";
import { AgentEvolution } from "./AgentEvolution";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkillEvolveDemo"
        component={SkillEvolveDemo}
        durationInFrames={1165}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AgentEvolution"
        component={AgentEvolution}
        durationInFrames={1101}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
