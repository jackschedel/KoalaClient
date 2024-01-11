import React from 'react';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import { ChatInterface } from '@type/chat';
import { generateDefaultChat } from '@constants/chat';

const NewMessageButton = React.memo(
  ({ messageIndex }: { messageIndex: number }) => {
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
    const autoTitle = useStore((state) => state.autoTitle);

    const addChat = () => {
      const chats = useStore.getState().chats;
      if (chats) {
        const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
        let titleIndex = 1;
        let title: string;
        if (!autoTitle) {
          title = `New Chat ${titleIndex}`;
        } else {
          title = `New Chat`;
        }

        if (!autoTitle) {
          while (chats.some((chat) => chat.title === title)) {
            titleIndex += 1;
            title = `New Chat ${titleIndex}`;
          }
        }

        updatedChats.unshift(generateDefaultChat(title));
        setChats(updatedChats);
        setCurrentChatIndex(0);
      }
    };

    const addMessage = () => {
      if (currentChatIndex === -1) {
        addChat();
      } else {
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        updatedChats[currentChatIndex].messages.splice(messageIndex + 1, 0, {
          content: '',
          role: 'user',
        });
        setChats(updatedChats);
      }
    };

    return (
      <div
        className='h-0 w-0 relative'
        key={messageIndex}
        aria-label='insert message'
      >
        <div
          className='absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] text-custom-white cursor-pointer bg-neutral-dark rounded-full p-1 text-sm hover:bg-custom-black hover:text-custom-white hover:text-transition-bg duration-200'
          onClick={addMessage}
        >
          <PlusIcon />
        </div>
      </div>
    );
  }
);

export default NewMessageButton;
