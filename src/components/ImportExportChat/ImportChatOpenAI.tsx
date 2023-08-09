import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';

import { importOpenAIChatExport } from '@utils/import';

import { ChatInterface } from '@type/chat';

const ImportChatOpenAI = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const setToastStatus = useStore((state) => state.setToastStatus);
  const setToastMessage = useStore((state) => state.setToastMessage);
  const setToastShow = useStore((state) => state.setToastShow);
  const setChats = useStore.getState().setChats;

  const handleFileUpload = () => {
    if (!inputRef || !inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result as string;

      try {
        const parsedData = JSON.parse(data);
        const chats = importOpenAIChatExport(parsedData);
        const prevChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        setChats(chats.concat(prevChats));

        setToastStatus('success');
        setToastMessage('Imported successfully!');
        setIsModalOpen(false);
      } catch (error: unknown) {
        setToastStatus('error');
        setToastMessage(`Invalid format! ${(error as Error).message}`);
      }
      setToastShow(true);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className='text-lg font-bold text-neutral-dark text-center mb-3'>
        {t('import')} OpenAI ChatGPT {t('export')}
      </div>
      <label className='block mb-2 text-sm font-medium text-neutral-dark'>
        {t('import')} (JSON)
      </label>
      <input
        className='w-full text-sm file:p-2 text-neutral-dark file:text-neutral-base rounded-md cursor-pointer focus:outline-none bg-custom-white file:bg-custom-white file:border-0 border border-gray-300 placeholder-neutral-dark file:cursor-pointer'
        type='file'
        ref={inputRef}
      />
      <button
        className='btn btn-small btn-primary mt-3'
        onClick={handleFileUpload}
        aria-label={t('import') as string}
      >
        {t('import')}
      </button>
    </>
  );
};

export default ImportChatOpenAI;
