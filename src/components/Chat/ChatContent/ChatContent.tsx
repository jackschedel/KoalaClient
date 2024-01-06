import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';
import CrossIcon from '@icon/CrossIcon';

import useSubmit from '@hooks/useSubmit';

const ChatContent = () => {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const generating = useStore.getState().generating;
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(
    null
  );

  const saveRef = useRef<HTMLDivElement>(null);

  // clear error at the start of generating new messages
  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  const { error } = useSubmit();

  return (
    <div className='flex-1 overflow-hidden bg-neutral-dark'>
      <ScrollToBottom className='h-full' followButtonClassName='hidden'>
        <div className='flex flex-col items-center text-sm'>
          <div
            className='flex flex-col items-center text-sm w-full'
            ref={saveRef}
          >
            {!generating && <NewMessageButton messageIndex={-1} />}
            {messages?.map((message, index) => (
              <React.Fragment key={index}>
                <Message
                  role={message.role}
                  content={message.content}
                  messageIndex={index}
                  isBottomChat={false}
                  editingMessageIndex={editingMessageIndex}
                  setEditingMessageIndex={setEditingMessageIndex}
                />
                {!generating && <NewMessageButton messageIndex={index} />}
              </React.Fragment>
            ))}
          </div>

          <Message
            role={inputRole}
            content=''
            messageIndex={messages.length}
            isBottomChat={true}
            editingMessageIndex={editingMessageIndex}
            setEditingMessageIndex={setEditingMessageIndex}
          />
          {error !== '' && (
            <div className='relative py-2 px-3 w-3/5 mt-3 max-md:w-11/12 border rounded-md border-red-500 bg-red-500/10'>
              <div className='text-custom-white text-sm whitespace-pre-wrap'>
                {error}
              </div>
              <div
                className='text-custom-white absolute top-1 right-1 cursor-pointer'
                onClick={() => {
                  setError('');
                }}
              >
                <CrossIcon />
              </div>
            </div>
          )}
        </div>
      </ScrollToBottom>
    </div>
  );
};

export default ChatContent;
