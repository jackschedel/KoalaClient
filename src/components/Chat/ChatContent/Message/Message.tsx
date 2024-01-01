import React from 'react';
import useStore from '@store/store';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { Role } from '@type/chat';
import RoleSelector from './RoleSelector';

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
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    //const advancedMode = useStore((state) => state.advancedMode);

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
            <RoleSelector
              role={role}
              messageIndex={messageIndex}
              sticky={sticky}
            />
            <MessageContent
              role={role}
              content={content}
              messageIndex={messageIndex}
              sticky={sticky}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;
