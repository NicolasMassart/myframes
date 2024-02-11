import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { DEBUG_HUB_OPTIONS } from "../debug/constants";

type State = {
  answered: boolean;
};

const initialState: State = { answered: false };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    answered: true,
  };
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...DEBUG_HUB_OPTIONS,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  // then, when done, return next frame
  return (
    <div>
      <FrameContainer
        pathname="/privacy-frame"
        postUrl="/privacy-frame/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          {frameMessage ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                  style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'flex-start'
              }}
              >
                Results:
                <div style={{ display: "flex", width: '100%', backgroundColor: 'green' }}>Yes: 100%</div>
                <div style={{ display: "flex" }}>No: 0</div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Do you accept to be tracked by this frame?
            </div>
          )}
        </FrameImage>
        {!state.answered ? <FrameButton>Yes</FrameButton> : null}
        {!state.answered ? <FrameButton>No</FrameButton> : null}
      </FrameContainer>
    </div>
  );
}
