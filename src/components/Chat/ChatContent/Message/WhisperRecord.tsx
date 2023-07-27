import React, { useEffect, useRef, useState } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import useStore from '@store/store';
import StopIcon from '@icon/StopIcon';
import MicrophoneIcon from '@icon/MicrophoneIcon';

const WhisperRecord = ({
  _setContent,
}: {
  _setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  let apiKey = useStore((state) => state.apiKey);

  apiKey = apiKey || '0';

  const {
    transcript,
    startRecording,
    stopRecording,
  } = useWhisper({ apiKey });


  useEffect(() => {
    if (transcript.text) {
      _setContent((prev) => prev + transcript.text);
    }
  }, [transcript.text]);

  const [isRecording, setIsRecording] = useState(false);

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className='relative max-wd-sm'>
      <button
        className='btn btn-neutral btn-small mr-5'
        aria-label='whisper record'
        onClick={handleRecording}>
        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
      </button>
    </div>
  );
};

export default WhisperRecord;
