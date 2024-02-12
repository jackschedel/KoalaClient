import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from '@components/PopupModal';
import { ConfigInterface } from '@type/chat';
import { ModelSelect } from './ModelSelect';
import {
  FrequencyPenaltySlider,
  MaxTokenSlider,
  PresencePenaltySlider,
  TemperatureSlider,
  TopPSlider,
} from './SettingsSliders';

const ConfigMenu = ({
  setIsModalOpen,
  config,
  setConfig,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: ConfigInterface;
  setConfig: (config: ConfigInterface) => void;
}) => {
  const [_maxTokens, _setMaxTokens] = useState<number>(config.max_tokens);
  const [_modelSelection, _setModelSelection] = useState<number>(
    config.model_selection
  );
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty
  );
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    config.frequency_penalty
  );
  const { t } = useTranslation('model');

  const handleConfirm = () => {
    setConfig({
      model_selection: _modelSelection,
      temperature: _temperature,
      presence_penalty: _presencePenalty,
      top_p: _topP,
      frequency_penalty: _frequencyPenalty,
      max_tokens: _maxTokens,
    });
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title={t('configuration') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleConfirm}
    >
      <div className='p-6 border-b bg-neutral-base'>
        <label className='block text-sm font-medium text-custom-white pb-2'>
          {t('model')}:
        </label>
        <ModelSelect
          _model={_modelSelection}
          _setModel={_setModelSelection}
          showHidden={true}
        />
        <MaxTokenSlider
          _maxToken={_maxTokens}
          _setMaxToken={_setMaxTokens}
          _model={_modelSelection}
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
      </div>
    </PopupModal>
  );
};

export default ConfigMenu;
