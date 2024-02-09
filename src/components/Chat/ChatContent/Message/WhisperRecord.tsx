import React, { useEffect } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import useStore from '@store/store';
import StopIcon from '@icon/StopIcon';
import MicrophoneIcon from '@icon/MicrophoneIcon';
import { useTranslation } from 'react-i18next';

const WhisperRecord = ({
  cursorPosition,
  _setContent,
  messageIndex,
}: {
  cursorPosition: number;
  _setContent: React.Dispatch<React.SetStateAction<string>>;
  messageIndex: number;
}) => {
  const { t } = useTranslation('api');
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const setError = useStore((state) => state.setError);
  const setIsRecording = useStore((state) => state.setIsRecording);
  const isRecording = useStore((state) => state.isRecording);
  const apiAuth = useStore((state) => state.apiAuth);

  const apiKey = apiAuth[0].apiKey || '0';

  const { transcript, startRecording, stopRecording } = useWhisper({
    apiKey,
  });

  useEffect(() => {
    if (generating) {
      if (transcript.text != null) {
        _setContent((prev) => {
          return prev.replace('◯', transcript.text || '');
        });
        setGenerating(false);
      }
    }
  }, [transcript.text]);

  useEffect(() => {
    if (!generating) {
      _setContent((prev) => {
        return prev.replace('◯', '');
      });
    }
  }, [generating]);

  const handleRecording = () => {
    if (apiKey != '0') {
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
            startContent &&
            !startContent.endsWith(' ') &&
            !startContent.endsWith('\n') &&
            startContent.length > 0
              ? ' '
              : '';
          const paddedEnd =
            endContent &&
            !endContent.startsWith(' ') &&
            !endContent.startsWith('\n')
              ? ' '
              : '';

          return startContent + paddedStart + '◉' + paddedEnd + endContent;
        });
        startRecording();
        setGenerating(true);
      }
      setIsRecording(!isRecording);
    } else {
      setError(t('noApiKeyWarning') as string);
      _setContent((prev) => {
        return prev.replace('◯', transcript.text || '');
      });
    }
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
        } btn-small inline-flex p-0 h-8 w-8 items-center justify-center mr-3 ${
          generating && !isRecording
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }

`}
        aria-label='whisper'
        onClick={() => {
          if (!generating || isRecording) {
            handleRecording();
          }
        }}
      >
        {isRecording ? <StopIcon /> : <MicrophoneIcon />}
      </button>
    </div>
  );
};

export default WhisperRecord;
