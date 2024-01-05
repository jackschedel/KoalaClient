import React, { Dispatch, memo, SetStateAction } from 'react';

import EditIcon2 from '@icon/EditIcon2';

import BaseButton from './BaseButton';

const EditButton = memo(
  ({
    setEditingMessageIndex,
    messageIndex,
  }: {
    setEditingMessageIndex: Dispatch<SetStateAction<number | null>>;
    messageIndex: number;
  }) => {
    return (
      <BaseButton
        icon={<EditIcon2 />}
        buttonProps={{ 'aria-label': 'edit message' }}
        onClick={() => setEditingMessageIndex(messageIndex)}
      />
    );
  }
);

export default EditButton;
