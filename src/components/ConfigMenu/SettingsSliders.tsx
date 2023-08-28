import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import { ConfigInterface, ModelChoice } from '@type/chat';
import { modelMaxToken } from '@constants/chat';
import { ModelSelect } from './ModelSelect';

export const MaxTokenSlider = ({
  _maxToken,
  _setMaxToken,
  _model,
}: {
  _maxToken: number;
  _setMaxToken: React.Dispatch<React.SetStateAction<number>>;
  _model: ModelChoice;
}) => {
  const { t } = useTranslation('model');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef &&
      inputRef.current &&
      _setMaxToken(Number(inputRef.current.value));
  }, [_model]);

  return (
    <div>
      <label className='block text-sm font-medium text-custom-white'>
        {t('token.label')}: {_maxToken}
      </label>
      <input
        type='range'
        ref={inputRef}
        value={_maxToken}
        onChange={(e) => {
          _setMaxToken(Number(e.target.value));
        }}
        min={0}
        max={modelMaxToken[_model]}
        step={1}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('token.description')}
      </div>
    </div>
  );
};

export const MaxContextSlider = ({
  _maxContext,
  _setMaxContext,
  _model,
}: {
  _maxContext: number;
  _setMaxContext: React.Dispatch<React.SetStateAction<number>>;
  _model: ModelChoice;
}) => {
  const { t } = useTranslation('model');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef &&
      inputRef.current &&
      _setMaxContext(Number(inputRef.current.value));
  }, [_model]);

  return (
    <div className='mt-5 pt-5 border-t border-neutral-base'>
      <label className='block text-sm font-medium text-custom-white'>
        {t('context.label')}: {_maxContext}
      </label>
      <input
        type='range'
        ref={inputRef}
        value={_maxContext}
        onChange={(e) => {
          _setMaxContext(Number(e.target.value));
        }}
        min={0}
        max={modelMaxToken[_model]}
        step={1}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('context.description')}
      </div>
    </div>
  );
};

export const TemperatureSlider = ({
  _temperature,
  _setTemperature,
}: {
  _temperature: number;
  _setTemperature: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation('model');

  return (
    <div className='mt-5 pt-5 border-t border-neutral-base'>
      <label className='block text-sm font-medium text-custom-white'>
        {t('temperature.label')}: {_temperature}
      </label>
      <input
        id='default-range'
        type='range'
        value={_temperature}
        onChange={(e) => {
          _setTemperature(Number(e.target.value));
        }}
        min={0}
        max={2}
        step={0.1}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('temperature.description')}
      </div>
    </div>
  );
};

export const TopPSlider = ({
  _topP,
  _setTopP,
}: {
  _topP: number;
  _setTopP: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation('model');

  return (
    <div className='mt-5 pt-5 border-t border-neutral-base'>
      <label className='block text-sm font-medium text-custom-white'>
        {t('topP.label')}: {_topP}
      </label>
      <input
        id='default-range'
        type='range'
        value={_topP}
        onChange={(e) => {
          _setTopP(Number(e.target.value));
        }}
        min={0}
        max={1}
        step={0.05}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('topP.description')}
      </div>
    </div>
  );
};

export const PresencePenaltySlider = ({
  _presencePenalty,
  _setPresencePenalty,
}: {
  _presencePenalty: number;
  _setPresencePenalty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation('model');

  return (
    <div className='mt-5 pt-5 border-t border-neutral-base'>
      <label className='block text-sm font-medium text-custom-white'>
        {t('presencePenalty.label')}: {_presencePenalty}
      </label>
      <input
        id='default-range'
        type='range'
        value={_presencePenalty}
        onChange={(e) => {
          _setPresencePenalty(Number(e.target.value));
        }}
        min={-2}
        max={2}
        step={0.1}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('presencePenalty.description')}
      </div>
    </div>
  );
};

export const FrequencyPenaltySlider = ({
  _frequencyPenalty,
  _setFrequencyPenalty,
}: {
  _frequencyPenalty: number;
  _setFrequencyPenalty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation('model');

  return (
    <div className='mt-5 pt-5 border-t border-neutral-base'>
      <label className='block text-sm font-medium text-custom-white'>
        {t('frequencyPenalty.label')}: {_frequencyPenalty}
      </label>
      <input
        id='default-range'
        type='range'
        value={_frequencyPenalty}
        onChange={(e) => {
          _setFrequencyPenalty(Number(e.target.value));
        }}
        min={-2}
        max={2}
        step={0.1}
        className='w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer'
      />
      <div className='min-w-fit text-custom-white text-sm mt-2'>
        {t('frequencyPenalty.description')}
      </div>
    </div>
  );
};
