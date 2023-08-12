import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { exportPrompts } from '@utils/prompt';

const ExportPrompt = () => {
  const { t } = useTranslation();
  const prompts = useStore.getState().prompts;

  return (
    <div className='mt-6'>
      <div className='block mb-2 text-sm font-medium text-custom-white'>
        {t('export')} (CSV):
      </div>
      <button
        className='btn btn-small btn-primary'
        onClick={() => {
          exportPrompts(prompts);
        }}
        aria-label={t('export') as string}
      >
        {t('export')}
      </button>
    </div>
  );
};

export default ExportPrompt;
