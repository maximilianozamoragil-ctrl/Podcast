import { Composition } from "remotion";
import { PodcastVideo } from "./podcast/PodcastVideo";

// Audio length is 317.77 s
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Podcast"
        component={PodcastVideo}
        durationInFrames={9534}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
