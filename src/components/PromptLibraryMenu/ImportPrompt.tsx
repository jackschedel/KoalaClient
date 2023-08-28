import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import useStore from '@store/store';

import { importPromptCSV } from '@utils/prompt';

const ImportPrompt = () => {
  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleFileUpload = () => {
    if (!inputRef || !inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const csvString = event.target?.result as string;

        try {
          const results = importPromptCSV(csvString);

          const prompts = useStore.getState().prompts;
          const setPrompts = useStore.getState().setPrompts;

          const newPrompts = results.map((data) => {
            const columns = Object.values(data);
            return {
              id: uuidv4(),
              name: columns[0],
              prompt: columns[1],
            };
          });

          setPrompts(prompts.concat(newPrompts));

          setAlert({ message: 'Succesfully imported!', success: true });
        } catch (error: unknown) {
          setAlert({ message: (error as Error).message, success: false });
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <label className='block mb-2 text-sm font-medium text-custom-white'>
        {t('import')} (CSV):
      </label>
      <input
        className='w-full text-sm file:p-2 text-custom-white file:text-custom-white rounded-md cursor-pointer focus:outline-none bg-neutral-light file:bg-neutral-dark file:border-0 placeholder-neutral-dark file:cursor-pointer'
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
      {alert && (
        <div
          className={`relative py-2 px-3 w-full mt-3 border rounded-md text-custom-white text-sm whitespace-pre-wrap ${
            alert.success
              ? 'border-green-500 bg-green-500/10'
              : 'border-red-500 bg-red-500/10'
          }`}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default ImportPrompt;
