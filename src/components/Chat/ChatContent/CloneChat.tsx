import React, { useState } from 'react';
import useStore from '@store/store';

import { ChatInterface } from '@type/chat';

import TickIcon from '@icon/TickIcon';
import CloneIcon from '@icon/CloneIcon';

const CloneChat = React.memo(() => {
  const setChats = useStore((state) => state.setChats);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const generating = useStore((state) => state.generating);

  const [cloned, setCloned] = useState<boolean>(false);

  const cloneChat = () => {
    if (generating) {
      return;
    }
    const chats = useStore.getState().chats;

    if (chats) {
      const index = useStore.getState().currentChatIndex;
      let title = `Copy of ${chats[index].title}`;
      let i = 0;

      while (chats.some((chat) => chat.title === title)) {
        i += 1;
        title = `Copy ${i} of ${chats[index].title}`;
      }

      const clonedChat = JSON.parse(JSON.stringify(chats[index]));
      clonedChat.title = title;

      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats.unshift(clonedChat);

      setChats(updatedChats);
      setCurrentChatIndex(useStore.getState().currentChatIndex + 1);
      setCloned(true);

      window.setTimeout(() => {
        setCloned(false);
      }, 3000);
    }
  };

  return (
    <button
      type='button'
      className={`text-custom-white transition-opacity ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      }`}
      onClick={cloneChat}
    >
      <div className='-ml-0.5 -mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-light'>
        {cloned ? (
          <TickIcon className='h-6 w-6' />
        ) : (
          <CloneIcon className='h-6 w-6' />
        )}
      </div>
    </button>
  );
});

export default CloneChat;
