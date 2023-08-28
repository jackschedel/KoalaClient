import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';

import PopupModal from '@components/PopupModal';
import { Prompt } from '@type/prompt';
import PlusIcon from '@icon/PlusIcon';
import CrossIcon from '@icon/CrossIcon';
import { v4 as uuidv4 } from 'uuid';
import ImportPrompt from './ImportPrompt';
import ExportPrompt from './ExportPrompt';
import EditIcon from '@icon/EditIcon';

const PromptLibraryMenu = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        className='btn btn-neutral bg-neutral-light'
        onClick={() => setIsModalOpen(true)}
        aria-label={t('promptLibrary') as string}
      >
        {t('promptLibrary')}
      </button>
      {isModalOpen && (
        <PromptLibraryMenuPopUp setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

const PromptLibraryMenuPopUp = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const setPrompts = useStore((state) => state.setPrompts);
  const prompts = useStore((state) => state.prompts);

  const [_prompts, _setPrompts] = useState<Prompt[]>(
    JSON.parse(JSON.stringify(prompts))
  );
  const container = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    setPrompts(_prompts);
    setIsModalOpen(false);
  };

  const addPrompt = () => {
    const updatedPrompts: Prompt[] = JSON.parse(JSON.stringify(_prompts));
    updatedPrompts.push({
      id: uuidv4(),
      name: '',
      prompt: '',
    });
    _setPrompts(updatedPrompts);
  };

  const deletePrompt = (index: number) => {
    const updatedPrompts: Prompt[] = JSON.parse(JSON.stringify(_prompts));
    updatedPrompts.splice(index, 1);
    _setPrompts(updatedPrompts);
  };

  const clearPrompts = () => {
    _setPrompts([]);
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = '2.5rem';
  };

  useEffect(() => {
    _setPrompts(prompts);
  }, [prompts]);

  return (
    <PopupModal
      title={t('promptLibrary') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-4 pb-2 w-[90vw] max-w-full text-sm text-custom-white border-b-2'>
        <div className='border px-4 py-2 rounded border-custom-white'>
          <ImportPrompt />
          <ExportPrompt />
        </div>
        <div className='flex flex-col pt-6 max-w-full' ref={container}>
          <div className='flex font-bold border-b border-neutral-base mb-0 p-1'>
            <div className='sm:w-1/4 max-sm:flex-1'>{t('name')}</div>
            <div className='flex-1'>{t('prompt')}</div>
          </div>
          {_prompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className='flex items-center border-b border-neutral-base/50 mb-1 p-1'
            >
              <div className='sm:w-1/4 max-sm:flex-1'>
                <textarea
                  className='m-0 resize-none rounded-l-lg bg-neutral-light overflow-y-hidden leading-7 p-1 focus:bg-neutral-dark w-full max-h-10 border-r-2 border-neutral-base transition-all'
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  onChange={(e) => {
                    _setPrompts((prev) => {
                      const newPrompts = [...prev];
                      newPrompts[index].name = e.target.value;
                      return newPrompts;
                    });
                  }}
                  onInput={handleInput}
                  value={prompt.name}
                  rows={1}
                ></textarea>
              </div>
              <div className='flex-1'>
                <textarea
                  className='m-0 resize-none rounded-r-lg focus:rounded-lg bg-neutral-light focus:overflow-y-hidden leading-7 p-1 focus:bg-neutral-dark w-full max-h-10 transition-all'
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  onChange={(e) => {
                    _setPrompts((prev) => {
                      const newPrompts = [...prev];
                      newPrompts[index].prompt = e.target.value;
                      return newPrompts;
                    });
                  }}
                  onInput={handleInput}
                  value={prompt.prompt}
                  rows={1}
                ></textarea>
              </div>
              <div
                className='p-1 ml-2 hover:text-neutral-dark hover:bg-custom-white hover:rounded'
                onClick={() => deletePrompt(index)}
              >
                <CrossIcon />
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-center mt-0 mb-8'>
          <div
            className='cursor-pointer p-2 mt-0 rounded-xl btn btn-neutral'
            onClick={addPrompt}
          >
            <PlusIcon />
          </div>
        </div>
        <div className='flex justify-center mt-2'>
          <div
            className='btn btn-neutral cursor-pointer text-xs'
            onClick={clearPrompts}
          >
            {t('clearPrompts')}
          </div>
        </div>
        <div className='mt-6 px-2 text-center'>
          {t('morePrompts')}
          <a
            href='https://github.com/f/awesome-chatgpt-prompts'
            target='_blank'
            className='link'
          >
            awesome-chatgpt-prompts
          </a>
        </div>
      </div>
    </PopupModal>
  );
};

export default PromptLibraryMenu;
