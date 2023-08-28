import React from 'react';
import { ModelChoice } from '@type/chat';
import DownChevronArrow from '@icon/DownChevronArrow';
import { modelOptions } from '@constants/chat';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

export const ModelSelect = ({
  _model,
  _setModel,
}: {
  _model: ModelChoice;
  _setModel: React.Dispatch<React.SetStateAction<ModelChoice>>;
}) => {
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  return (
    <div className='mb-4'>
      <button
        className='btn btn-neutral btn-small flex gap-1 p-1.5 rounded-md'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
        aria-label='model'
      >
        {_model}
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        ref={dropDownRef}
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-neutral-light shadow-xl rounded-lg border border-neutral-base group w-36`}
      >
        <ul
          className='text-sm p-0 m-0 max-h-72 overflow-auto'
          aria-labelledby='dropdownDefaultButton'
        >
          {modelOptions.map((m) => (
            <li
              className='px-4 py-2 hover:bg-neutral-dark cursor-pointer text-custom-white'
              onClick={() => {
                switch (m) {
                  case 'gpt-4':
                  case 'gpt-4-32k':
                  case 'gpt-3.5-turbo':
                  case 'gpt-3.5-turbo-16k':
                    break;
                }
                _setModel(m);
                setDropDown(false);
              }}
              key={m}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
