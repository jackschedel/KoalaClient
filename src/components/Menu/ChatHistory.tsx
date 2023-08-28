import React, { useEffect, useRef, useState } from 'react';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';

import ChatIcon from '@icon/ChatIcon';
import CrossIcon from '@icon/CrossIcon';
import DeleteIcon from '@icon/DeleteIcon';
import EditIcon from '@icon/EditIcon';
import TickIcon from '@icon/TickIcon';
import useStore from '@store/store';

const ChatHistoryClass = {
  normal:
    'flex py-2 px-2 items-center gap-3 relative rounded-md bg-opacity-0 hover:bg-opacity-20 hover:bg-custom-white break-all hover:pr-4 group transition-opacity',
  active:
    'flex py-2 px-2 items-center gap-3 relative rounded-md break-all pr-14 bg-accent-dark bg-opacity-40 group hover:bg-opacity-100 transition-opacity',
};

const ChatHistory = React.memo(
  ({ title, chatIndex }: { title: string; chatIndex: number }) => {
    const initialiseNewChat = useInitialiseNewChat();
    const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
    const setChats = useStore((state) => state.setChats);
    const active = useStore((state) => state.currentChatIndex === chatIndex);
    const generating = useStore((state) => state.generating);

    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [_title, _setTitle] = useState<string>(title);
    const inputRef = useRef<HTMLInputElement>(null);

    const editTitle = () => {
      const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats[chatIndex].title = _title;
      setChats(updatedChats);
      setIsEdit(false);
    };

    const deleteChat = () => {
      const updatedChats = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      updatedChats.splice(chatIndex, 1);
      if (updatedChats.length > 0) {
        setCurrentChatIndex(0);
        setChats(updatedChats);
      } else {
        initialiseNewChat();
      }
      setIsDelete(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        editTitle();
      }
    };

    const handleTick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (isEdit) editTitle();
      else if (isDelete) deleteChat();
    };

    const handleCross = () => {
      setIsDelete(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData('chatIndex', String(chatIndex));
      }
    };

    useEffect(() => {
      if (inputRef && inputRef.current) inputRef.current.focus();
    }, [isEdit]);

    return (
      <a
        className={`${
          active ? ChatHistoryClass.active : ChatHistoryClass.normal
        } ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating) setCurrentChatIndex(chatIndex);
        }}
        draggable={!isEdit}
        onDragStart={handleDragStart}
      >
        <ChatIcon />
        <div
          className='flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative'
          title={title}
        >
          {isEdit ? (
            <input
              type='text'
              className='focus:outline-blue-600 text-sm border-none bg-transparent p-0 m-0 w-full'
              value={_title}
              onChange={(e) => {
                _setTitle(e.target.value);
              }}
              onBlur={(e) => {
                setIsEdit(false);
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            _title
          )}

          {isEdit && (
            <div
              className={
                active ? ChatHistoryClass.active : ChatHistoryClass.normal
              }
            />
          )}
        </div>
        {active && (
          <div className='absolute flex pr-1 right-1 z-10 text-custom-white/60 visible'>
            {isDelete ? (
              <>
                <button
                  className='p-1 hover:text-neutral-dark hover:bg-custom-white/70 hover:rounded'
                  onClick={handleTick}
                  aria-label='confirm'
                >
                  <TickIcon />
                </button>
                <button
                  className='p-1 hover:text-neutral-dark hover:bg-custom-white/70 hover:rounded'
                  onClick={handleCross}
                  aria-label='cancel'
                >
                  <CrossIcon />
                </button>
              </>
            ) : (
              <>
                {!isEdit && (
                  <button
                    className='p-1 hover:text-neutral-dark hover:bg-custom-white/70 hover:rounded'
                    onClick={() => setIsEdit(true)}
                    aria-label='edit chat title'
                  >
                    <EditIcon />
                  </button>
                )}
                <button
                  className='p-1 hover:text-neutral-dark hover:bg-custom-white/70 hover:rounded'
                  onClick={() => setIsDelete(true)}
                  aria-label='delete chat'
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        )}
      </a>
    );
  }
);

export default ChatHistory;
