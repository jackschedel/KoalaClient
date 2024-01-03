import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';

import CrossIcon from '@icon/CrossIcon';

const ChatSearch = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [_filter, _setFilter] = useState<string>(filter);
  const generating = useStore((state) => state.generating);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setFilter(e.target.value);
  };

  const debouncedUpdateFilter = useRef(
    debounce((f) => {
      setFilter(f);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(_filter);
  }, [_filter]);

  const { t } = useTranslation();

  return (
    <div className='relative h-10 mb-2'>
      <input
        disabled={generating}
        type='text'
        className='text-custom-white p-3 text-sm bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-opacity m-0 w-full h-full focus:outline-none rounded border focus:bg-custom-black/25 border-custom-white/20'
        placeholder={t('search') as string}
        value={_filter}
        onChange={(e) => {
          handleChange(e);
        }}
      />
      {_filter && (
        <div
          className='absolute top-0 right-0 h-full flex items-center pr-3 cursor-pointer'
          onClick={() => {
            _setFilter('');
          }}
        >
          <CrossIcon className='text-custom-white hover:text-neutral-light' />
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
