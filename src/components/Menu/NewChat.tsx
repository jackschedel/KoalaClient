import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';

import useAddChat from '@hooks/useAddChat';

const NewChat = ({ folder }: { folder?: string }) => {
  const { t } = useTranslation();
  const addChat = useAddChat();
  const bottomMessageRef = useStore((state) => state.bottomMessageRef);
  const generating = useStore((state) => state.generating);

  return (
    <a
      className={`flex flex-1 items-center rounded-md hover:bg-neutral-light transition-all duration-200 flex-shrink-0 p-2 ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      } ${
        folder
          ? 'justify-start gap-3 text-custom-white/50 hover:text-custom-white'
          : 'text-custom-white gap-2 mb-2 border border-custom-white/20'
      }`}
      onClick={() => {
        if (!generating) {
          addChat(folder);
          bottomMessageRef?.current?.focus();
        }
      }}
      title={String(t('newChat'))}
    >
      <PlusIcon />
      <span className='inline-flex text-sm'>{t('newChat')}</span>
    </a>
  );
};

export default NewChat;
