import React from 'react';
import DownChevronArrow from '@icon/DownChevronArrow';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import useStore from '@store/store';
import { StoreState } from '@store/store';

export const ModelSelect = ({
  _model,
  _setModel,
  showHidden,
}: {
  _model: number | undefined | null;
  _setModel: React.Dispatch<React.SetStateAction<number>>;
  showHidden: boolean;
}) => {
  let model = _model || 0;
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
  const modelDefs = useStore((state: StoreState) => state.modelDefs);

  if (model >= modelDefs.length) {
    model = 0;
  }

  if (typeof _model !== 'number') {
    _setModel(0);
  }

  return (
    <div className='mb-4'>
      <button
        className='btn btn-neutral btn-small flex gap-1 p-1.5 rounded-md'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
        aria-label='model'
      >
        {modelDefs[model]?.name || modelDefs[model]?.model}
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
          {modelDefs.map((modelDef, index) =>
            showHidden || modelDef.swap_visible || index == model ? (
              <li
                className='px-4 py-2 hover:bg-neutral-dark cursor-pointer text-custom-white'
                onClick={() => {
                  setDropDown(false);
                  _setModel(index);
                }}
                key={index}
              >
                {modelDef.name || modelDef.model || `Unnamed ${index + 1}`}
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
};
