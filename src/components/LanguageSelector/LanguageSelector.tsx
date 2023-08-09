import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DownChevronArrow from '@icon/DownChevronArrow';
import { languageCodeToName, selectableLanguages } from '@constants/language';
import FileTextIcon from '@icon/FileTextIcon';
import LanguageIcon from '@icon/LanguageIcon';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [dropDown, setDropDown] = useState<boolean>(false);
  return (
    <div className='prose relative pb-4'>
      <button
        className='btn btn-neutral btn-small flex justify-between p-2 gap-3' 
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
        aria-label='language selector'
      >
        <LanguageIcon className='w-4 h-4' />
        {languageCodeToName[i18n.language as keyof typeof languageCodeToName] ??
          i18n.language}
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10/50 text-neutral-dark group opacity-95 w-36`}
      >
        <ul
          className='text-sm text-neutral-base p-0 m-0 max-h-72 overflow-auto'
          aria-labelledby='dropdownDefaultButton'
        >
          {selectableLanguages.map((lang) => (
            <li
              className='px-4 py-2 hover:bg-custom-white cursor-pointer'
              onClick={() => {
                i18n.changeLanguage(lang);
                setDropDown(false);
              }}
              key={lang}
              lang={lang}
            >
              {languageCodeToName[lang]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
