import React from 'react';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '@icon/DownloadIcon';

const DesktopLink = () => {
  const { t } = useTranslation();
  return (
    <a
      className='flex py-2 px-1.5 items-center gap-2.5 rounded-md hover:bg-custom-white/20 transition-colors duration-200 text-custom-white cursor-pointer text-sm'
      href='https://github.com/jackschedel/KoalaClient/releases'
      target='_blank'
    >
      <DownloadIcon />
      {t('desktop')}
    </a>
  );
};

export default DesktopLink;
