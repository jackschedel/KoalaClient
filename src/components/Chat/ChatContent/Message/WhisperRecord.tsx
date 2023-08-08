import React, { useEffect, useRef, useState } from "react";
import { useWhisper } from "@chengsokdara/use-whisper";
import useStore from "@store/store";
import StopIcon from "@icon/StopIcon";
import MicrophoneIcon from "@icon/MicrophoneIcon";

const WhisperRecord = ({
  cursorPosition,
  _setContent,
}: {
  cursorPosition: number;
  _setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  let apiKey = useStore((state) => state.apiKey);

  apiKey = apiKey || "0";

  const {
    transcript,
    startRecording,
    stopRecording,
  } = useWhisper({ apiKey });

  useEffect(() => {
    if (transcript.text) {
      _setContent((prev) => {
        return prev.replace("◯", transcript.text || "");
      });
    }
  }, [transcript.text]);

  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = () => {
    if (isRecording) {
      _setContent((prev) => {
        return prev.replace("◉", "◯" || "");
      });
      stopRecording();
    } else {
      _setContent((prev) => {
        let startContent = prev.slice(0, cursorPosition);
        let endContent = prev.slice(cursorPosition);

        let paddedStart =
          (!startContent.endsWith(" ") && !startContent.endsWith("\n") &&
              startContent.length > 0)
            ? " "
            : "";
        let paddedEnd =
          (!endContent.startsWith(" ") && !endContent.startsWith("\n") &&
              endContent.length > 0)
            ? " "
            : "";

        return startContent + paddedStart + "◉" + paddedEnd + endContent;
      });
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="relative max-wd-sm">
      <button
        className="btn btn-neutral btn-small mr-5"
        aria-label="whisper record"
        onClick={handleRecording}
      >
        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
      </button>
    </div>
  );
};

export default WhisperRecord;
