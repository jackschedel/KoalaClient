import React, { useState } from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import ChatIcon from '@icon/ChatIcon';

import PopupModal from '@components/PopupModal';
import {
  FrequencyPenaltySlider,
  MaxContextSlider,
  MaxTokenSlider,
  PresencePenaltySlider,
  TemperatureSlider,
  TopPSlider,
} from '@components/ConfigMenu/SettingsSliders';

import { ModelSelect } from '@components/ConfigMenu/ModelSelect';

import { ModelChoice } from '@type/chat';
import { _defaultChatConfig, _defaultSystemMessage } from '@constants/chat';

const ChatConfigMenu = () => {
  const { t } = useTranslation('model');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        className='btn btn-neutral bg-neutral-light'
        onClick={() => setIsModalOpen(true)}
        aria-label={t('defaultChatConfig') as string}
      >
        {t('defaultChatConfig')}
      </button>
      {isModalOpen && <ChatConfigPopup setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

const ChatConfigPopup = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const config = useStore.getState().defaultChatConfig;
  const setDefaultChatConfig = useStore((state) => state.setDefaultChatConfig);
  const setDefaultSystemMessage = useStore(
    (state) => state.setDefaultSystemMessage
  );

  const [_systemMessage, _setSystemMessage] = useState<string>(
    useStore.getState().defaultSystemMessage
  );
  const [_model, _setModel] = useState<ModelChoice>(config.model);
  const [_maxToken, _setMaxToken] = useState<number>(config.max_tokens);
  const [_maxContext, _setMaxContext] = useState<number>(config.max_context);
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty
  );
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    config.frequency_penalty
  );

  const { t } = useTranslation('model');

  const handleSave = () => {
    setDefaultChatConfig({
      model: _model,
      max_tokens: _maxToken,
      max_context: _maxContext,
      temperature: _temperature,
      top_p: _topP,
      presence_penalty: _presencePenalty,
      frequency_penalty: _frequencyPenalty,
    });
    setDefaultSystemMessage(_systemMessage);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    _setModel(_defaultChatConfig.model);
    _setMaxToken(_defaultChatConfig.max_tokens);
    _setMaxContext(_defaultChatConfig.max_context);
    _setTemperature(_defaultChatConfig.temperature);
    _setTopP(_defaultChatConfig.top_p);
    _setPresencePenalty(_defaultChatConfig.presence_penalty);
    _setFrequencyPenalty(_defaultChatConfig.frequency_penalty);
    _setSystemMessage(_defaultSystemMessage);
  };

  return (
    <PopupModal
      title={t('defaultChatConfig') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-custom-white w-[90vw] max-w-full text-sm text-custom-white'>
        <label className='block text-sm font-medium text-custom-white pb-2'>
          {t('model')}:
        </label>
        <ModelSelect _model={_model} _setModel={_setModel} />
        <DefaultSystemChat
          _systemMessage={_systemMessage}
          _setSystemMessage={_setSystemMessage}
        />
        <MaxTokenSlider
          _maxToken={_maxToken}
          _setMaxToken={_setMaxToken}
          _model={_model}
        />
        <MaxContextSlider
          _maxContext={_maxContext}
          _setMaxContext={_setMaxContext}
          _model={_model}
        />
        <TemperatureSlider
          _temperature={_temperature}
          _setTemperature={_setTemperature}
        />
        <TopPSlider _topP={_topP} _setTopP={_setTopP} />
        <PresencePenaltySlider
          _presencePenalty={_presencePenalty}
          _setPresencePenalty={_setPresencePenalty}
        />
        <FrequencyPenaltySlider
          _frequencyPenalty={_frequencyPenalty}
          _setFrequencyPenalty={_setFrequencyPenalty}
        />
        <div
          className='btn btn-neutral cursor-pointer mt-5'
          onClick={handleReset}
        >
          {t('resetToDefault')}
        </div>
      </div>
    </PopupModal>
  );
};

const DefaultSystemChat = ({
  _systemMessage,
  _setSystemMessage,
}: {
  _systemMessage: string;
  _setSystemMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation('model');

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  return (
    <div>
      <div className='block text-sm font-medium text-custom-white'>
        {t('defaultSystemMessage')}
      </div>
      <textarea
        className='my-2 mx-0 px-2 resize-none rounded-lg bg-custom-white/10 leading-7 p-1 border border-neutral-dark w-full transition-all'
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          _setSystemMessage(e.target.value);
        }}
        onInput={handleInput}
        value={_systemMessage}
        rows={3}
      ></textarea>
    </div>
  );
};

export default ChatConfigMenu;
