import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import ContentView from './View/ContentView';
import EditView from './View/EditView';

const MessageContent = ({
  role,
  content,
  messageIndex,
  sticky,
  editingMessageIndex,
  setEditingMessageIndex,
}: {
  role: string;
  content: string;
  messageIndex: number;
  sticky: boolean;
  editingMessageIndex: number | null;
  setEditingMessageIndex: Dispatch<SetStateAction<number | null>>;
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);

  useEffect(() => {
    if (messageIndex !== editingMessageIndex) {
      setIsEdit(false);
    }
  }, [editingMessageIndex]);

  if (isEdit) {
    setEditingMessageIndex(messageIndex);
  }

  return (
    <div className='relative flex flex-col gap-2 md:gap-3 lg:w-[calc(100%-5px)]'>
      <div className='flex flex-grow flex-col gap-3'></div>
      {isEdit ? (
        <EditView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
          role={role}
          setEditingMessageIndex={setEditingMessageIndex}
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

export default MessageContent;
