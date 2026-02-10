import { Composition } from "remotion";
import { SkillEvolveDemo } from "./SkillEvolveDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SkillEvolveDemo"
      component={SkillEvolveDemo}
      durationInFrames={1165}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
