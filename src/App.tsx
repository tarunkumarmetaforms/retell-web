//@ts-nocheck

import { useEffect, useRef, useState } from "react";

import "./App.css";
import { RetellWebClient } from "./client";

function App() {
  const [count, setCount] = useState("");
  const [retellWebClient, setRetellWebClient] =
    useState<RetellWebClient | null>(null);
  const [state, setstate] = useState();
  const transcriptRef = useRef("");
  // const client = new Retell({
  //   apiKey: "f144d96e-eef5-443e-b534-3984e54499ce",
  // });

  async function main() {
    const data = await fetch(
      "https://api.dev.metaforms.ai/www/retell/create-web-call"
    );
    const webCallResponse = await data.json();
    console.log(webCallResponse.agent_id);
    setCount(webCallResponse.access_token);
    return webCallResponse;
  }

  useEffect(() => {
    const client = new RetellWebClient();
    setRetellWebClient(client);
    main();

    return () => {
      if (client) {
        client.stopCall();
      }
    };
  }, []);

  const startCall = async () => {
    if (!retellWebClient) return;
    await retellWebClient.startCall({
      accessToken: count,
      sampleRate: 24000, // (Optional) set sample rate of the audio capture and playback
      // (Optional) device id of the mic.
      captureDeviceId: "default",
      // (Optional) device id of the speaker
      playbackDeviceId:
        "0ec1807fd0fe6e51b990660ec4e2ebb78sdfcba51e279815d00c423ce03407ff",
      // (Optional) Whether to emit "audio" events that contain raw pcm audio bytes represented by Float32Array
      emitRawAudioSamples: false,
    });
    retellWebClient.on("update", (update) => {
      console.log(update.ranscript);
      if (update.transcript[update.transcript.length - 1].role == "agent") {
        transcriptRef.current =
          update.transcript[update.transcript.length - 1].content;
        setstate(transcriptRef.current);
      }
    });
  };

  return (
    <>
      {count ? (
        <>
          <div>
            <div>{state}</div>
            <button className="pt-5" onClick={startCall}>
              startCall
            </button>
          </div>
        </>
      ) : (
        <div>Loading.....</div>
      )}
    </>
  );
}

export default App;
