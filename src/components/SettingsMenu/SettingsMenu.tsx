import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import isElectron from '@utils/electron';
import PopupModal from '@components/PopupModal';
import SettingIcon from '@icon/SettingIcon';
import LanguageSelector from '@components/LanguageSelector';
import AutoTitleToggle from './AutoTitleToggle';
import CloseToTrayToggle from './CloseToTrayToggle';
import InlineLatexToggle from './InlineLatexToggle';
import HeartIcon from '@icon/HeartIcon';
import PromptLibraryMenu from '@components/PromptLibraryMenu';
import ChatConfigMenu from '@components/ChatConfigMenu';
import EnterToSubmitToggle from './EnterToSubmitToggle';
import TotalTokenCost, { TotalTokenCostToggle } from './TotalTokenCost';
import ClearConversation from '@components/Menu/MenuOptions/ClearConversation';
import ImportExportChat from '@components/ImportExportChat/ImportExportChat';
import Api from '@components/Menu/MenuOptions/Api';
import ConfirmEditSubmissionToggle from './ConfirmEditSubmission';

const SettingsMenu = () => {
  const { t } = useTranslation();

  const theme = useStore.getState().theme;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-custom-white/20 transition-colors duration-200 text-custom-white cursor-pointer text-sm'
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <SettingIcon className='w-4 h-4' /> {t('setting') as string}
      </a>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('setting') as string}
          cancelButton={false}
        >
          <div className='px-10 pt-3 mx-5 flex flex-col items-center gap-2'>
            <LanguageSelector />
            <ImportExportChat />
            <Api />
            <ClearConversation />
            <PromptLibraryMenu />
            <ChatConfigMenu />
            <div className='pt-4 flex flex-col gap-2'>
              {isElectron() && <CloseToTrayToggle />}
              <AutoTitleToggle />
              <EnterToSubmitToggle />
              <ConfirmEditSubmissionToggle />
              <InlineLatexToggle />
              <TotalTokenCostToggle />
            </div>
            <TotalTokenCost />
            <a
              className='flex p-2 mb-2 items-center gap-2 rounded-md hover:bg-neutral-dark transition-colors duration-200 text-custom-white/20 cursor-pointer text-sm'
              href='https://github.com/ztjhz/BetterChatGPT'
              target='_blank'
              rel='noreferrer'
            >
              <div className='opacity-20'>
                <HeartIcon />
              </div>
              {t('originalRepo')}
            </a>
          </div>
        </PopupModal>
      )}
    </>
  );
};

export default SettingsMenu;
