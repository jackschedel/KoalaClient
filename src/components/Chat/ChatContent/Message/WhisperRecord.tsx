import React, { useEffect, useState } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import useStore from '@store/store';
import StopIcon from '@icon/StopIcon';
import MicrophoneIcon from '@icon/MicrophoneIcon';

const WhisperRecord = ({
  cursorPosition,
  _setContent,
  messageIndex,
}: {
  cursorPosition: number;
  _setContent: React.Dispatch<React.SetStateAction<string>>;
  messageIndex: number;
}) => {
  let apiKey = useStore((state) => state.apiKey);

  apiKey = apiKey || '0';

  const { transcript, startRecording, stopRecording } = useWhisper({ apiKey });

  useEffect(() => {
    if (transcript.text) {
      _setContent((prev) => {
        return prev.replace('◯', transcript.text || '');
      });
    }
  }, [transcript.text]);

  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = () => {
    if (isRecording) {
      _setContent((prev) => {
        return prev.replace('◉', '◯' || '');
      });
      stopRecording();
    } else {
      _setContent((prev) => {
        const startContent = prev.slice(0, cursorPosition);
        const endContent = prev.slice(cursorPosition);

        const paddedStart =
          !startContent.endsWith(' ') &&
          !startContent.endsWith('\n') &&
          startContent.length > 0
            ? ' '
            : '';
        const paddedEnd =
          !endContent.startsWith(' ') && !endContent.startsWith('\n')
            ? ' '
            : '';

        return startContent + paddedStart + '◉' + paddedEnd + endContent;
      });
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className='relative max-wd-sm'>
      <button
        className={`btn ${
          isRecording
            ? messageIndex % 2
              ? 'btn-primary'
              : 'btn-neutral-dark'
            : 'btn-primary'
        } btn-small inline-flex p-0 h-8 w-8 items-center justify-center mr-3`}
        aria-label='whisper'
        onClick={handleRecording}
      >
        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
      </button>
    </div>
  );
};

export default WhisperRecord;
