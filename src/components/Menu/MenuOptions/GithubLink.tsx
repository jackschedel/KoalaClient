import React from 'react';
import { useTranslation } from 'react-i18next';
import AboutIcon from '@icon/AboutIcon';

const GithubLink = () => {
  const { t } = useTranslation();
  return (
    <a
      className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-custom-white/20 transition-colors duration-200 text-custom-white cursor-pointer text-sm'
      href='https://github.com/jackschedel/KoalaClient'
      target='_blank'
    >
      <AboutIcon />
      {t('host')}
    </a>
  );
};

export default GithubLink;
