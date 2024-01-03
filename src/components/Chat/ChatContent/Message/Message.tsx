import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { ChatInterface, Role } from '@type/chat';
import RoleSelector from './RoleSelector';
import CommandPrompt from './CommandPrompt';

const backgroundStyle = ['bg-neutral-light', 'bg-neutral-base'];

const Message = React.memo(
  ({
    role,
    content,
    messageIndex,
    sticky = false,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const [_content, _setContent] = useState<string>('');
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const [isEdit, setIsEdit] = useState<boolean>(sticky);

    useEffect(() => {
      if (_content === '' || useStore.getState().generating) return;
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const updatedMessages = updatedChats[currentChatIndex].messages;
      updatedMessages[messageIndex].content = _content;
      _setContent('');
      setChats(updatedChats);
    }, [_content]);

    return (
      <div
        className={`w-full border-b border-neutral-dark group ${
          backgroundStyle[messageIndex % 2]
        }`}
      >
        <div
          className='text-base gap-3 md:gap-5 p-3 md:py-6 flex transition-all ease-in-out 
                     md:mx-1 lg:mx-2'
        >
          <Avatar role={role} />
          <div className='w-[calc(100%-50px)] '>
            <div className='flex justify-between'>
              <div className='flex-grow-0'>
                <RoleSelector
                  role={role}
                  messageIndex={messageIndex}
                  sticky={sticky}
                />
              </div>

              {role === 'system' && !sticky && !isEdit && (
                <div className='flex-grow-0'>
                  <CommandPrompt
                    cursorPosition={0}
                    _setContent={_setContent}
                    messageIndex={messageIndex}
                  />
                </div>
              )}
            </div>

            <MessageContent
              role={role}
              content={content}
              messageIndex={messageIndex}
              sticky={sticky}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;
