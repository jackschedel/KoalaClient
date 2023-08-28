import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DownChevronArrow from '@icon/DownChevronArrow';
import { languageCodeToName, selectableLanguages } from '@constants/language';
import FileTextIcon from '@icon/FileTextIcon';
import LanguageIcon from '@icon/LanguageIcon';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  return (
    <div className='prose relative'>
      <button
        className='btn btn-neutral btn-small flex justify-between p-2 gap-3 bg-neutral-light'
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
        ref={dropDownRef}
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-neutral-light shadow-xl rounded-lg border border-neutral-light text-neutral-dark group w-36`}
      >
        <ul
          className='text-sm text-neutral-base p-0 m-0 max-h-72 overflow-auto'
          aria-labelledby='dropdownDefaultButton'
        >
          {selectableLanguages.map((lang) => (
            <li
              className='px-4 py-2 hover:bg-neutral-dark cursor-pointer text-custom-white'
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
