import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import TokenCount from '@components/TokenCount';
import CommandPrompt from '../CommandPrompt';

import WhisperRecord from '../WhisperRecord';

const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
  role,
  setEditingMessageIndex,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
  role: string;
  setEditingMessageIndex: (index: number | null) => void;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setBottomMessageRef = useStore((state) => state.setBottomMessageRef);
  const { t } = useTranslation();

  useEffect(() => {
    if (sticky) {
      setBottomMessageRef(textareaRef);
    }
  }, [textareaRef]);

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;
      if (sticky) {
        if (enterToSubmit && !e.shiftKey) {
          e.preventDefault();
          handleGenerate();
          resetTextAreaHeight();
        }
      }
    }
  };

  const handleSave = () => {
    if (sticky && (_content === '' || useStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      updatedMessages.push({ role: inputRole, content: _content });
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
    setEditingMessageIndex(null);
  };

  const { handleSubmit } = useSubmit();
  const handleGenerate = () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      if (_content !== '') {
        updatedMessages.push({ role: inputRole, content: _content });
      }
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    setEditingMessageIndex(null);
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <div
        className={`w-full ${
          sticky
            ? 'py-2 md:py-3 px-2 md:px-4 border border-custom-black/10  bg-custom-black/20 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)][0_0_15px_rgba(0,0,0,0.10)]'
            : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full text-custom-white placeholder:text-custom-white/10'
          onChange={(e) => {
            _setContent(e.target.value);
          }}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setCursorPosition(target.selectionStart || 0);
          }}
          value={_content}
          placeholder={t('submitPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
        ></textarea>
      </div>
      <EditViewButtons
        sticky={sticky}
        handleGenerate={handleGenerate}
        handleSave={handleSave}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        cursorPosition={cursorPosition}
        _setContent={_setContent}
        messageIndex={messageIndex}
        role={role}
        content={content}
        setEditingMessageIndex={setEditingMessageIndex}
      />
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleGenerate}
        />
      )}
    </>
  );
};

const EditViewButtons = memo(
  ({
    sticky = false,
    handleGenerate,
    handleSave,
    setIsModalOpen,
    setIsEdit,
    cursorPosition,
    _setContent,
    messageIndex,
    role,
    content,
    setEditingMessageIndex,
  }: {
    sticky?: boolean;
    handleGenerate: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    cursorPosition: number;
    _setContent: React.Dispatch<React.SetStateAction<string>>;
    messageIndex: number;
    role: string;
    content: string;
    setEditingMessageIndex: (index: number | null) => void;
  }) => {
    const { t } = useTranslation();
    const generating = useStore.getState().generating;
    const confirmEditSubmission = useStore(
      (state) => state.confirmEditSubmission
    );

    const handleCancel = () => {
      setIsEdit(false);
      setEditingMessageIndex(null);
    };

    const handleEditGenerate = () => {
      if (generating) {
        return;
      }

      if (confirmEditSubmission) {
        setIsModalOpen(true);
      } else {
        handleGenerate();
      }
    };

    return (
      <div className='flex'>
        <div className='flex-1' />
        <div className='flex-3 text-center mt-2'>
          {sticky && (
            <button
              className={`btn relative mr-2 btn-primary ${
                generating ? 'cursor-not-allowed opacity-40' : ''
              }`}
              onClick={handleGenerate}
              aria-label={t('generate') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          {!sticky && role === 'user' && content != '' && (
            <button
              className='btn relative mr-2 btn-primary'
              onClick={() => {
                handleEditGenerate();
              }}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          <button
            className={`btn relative mr-2 ${
              messageIndex % 2 ? 'btn-neutral' : 'btn-neutral-dark'
            } ${
              sticky
                ? `${generating ? 'cursor-not-allowed opacity-40' : ''}`
                : ''
            }`}
            onClick={handleSave}
            aria-label={t('save') as string}
          >
            <div className='flex items-center justify-center gap-2'>
              {t('save')}
            </div>
          </button>

          {sticky || (
            <button
              className={`btn relative ${
                messageIndex % 2 ? 'btn-neutral' : 'btn-neutral-dark'
              }`}
              onClick={() => handleCancel()}
              aria-label={t('cancel') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('cancel')}
              </div>
            </button>
          )}
        </div>
        <div className='flex-1 flex items-center justify-end'>
          {sticky && <TokenCount />}
          <WhisperRecord
            cursorPosition={cursorPosition}
            _setContent={_setContent}
            messageIndex={messageIndex}
          />
          <CommandPrompt
            cursorPosition={cursorPosition}
            _setContent={_setContent}
            messageIndex={messageIndex}
          />
        </div>
      </div>
    );
  }
);

export default EditView;
