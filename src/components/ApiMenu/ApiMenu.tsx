import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

import PopupModal from '@components/PopupModal';

import { availableEndpoints, defaultAPIEndpoint } from '@constants/auth';

import DownChevronArrow from '@icon/DownChevronArrow';

const ApiMenu = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);

  const apiKeys = useStore((state) => state.apiKeys);
  const setApiKeys = useStore((state) => state.setApiKeys);
  const apiEndpoints = useStore((state) => state.apiEndpoints);
  const setApiEndpoints = useStore((state) => state.setApiEndpoints);

  const [_apiKeys, _setApiKeys] = useState<string[]>(apiKeys);
  const [_apiEndpoints, _setApiEndpoints] = useState<string[]>(apiEndpoints);

  const handleSave = () => {
    setApiKeys(_apiKeys);
    setApiEndpoints(_apiEndpoints);
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-custom-white text-custom-white'>
        <div className='min-w-fit text-custom-white text-sm flex flex-col gap-3 leading-relaxed'>
          <p>
            <Trans
              i18nKey='apiKey.howTo'
              ns='api'
              components={[
                <a
                  key={null}
                  href='https://platform.openai.com/account/api-keys'
                  className='link'
                  target='_blank'
                  rel='noreferrer'
                />,
              ]}
            />
          </p>

          <p>{t('securityMessage', { ns: 'api' })}</p>
        </div>
      </div>
    </PopupModal>
  );
};

export default ApiMenu;
