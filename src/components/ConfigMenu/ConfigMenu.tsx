import React, { useEffect, useRef, useState } from "react";
import useStore from "@store/store";
import { useTranslation } from "react-i18next";
import PopupModal from "@components/PopupModal";
import { ConfigInterface, ModelChoice } from "@type/chat";
import { modelMaxToken } from "@constants/chat";
import { ModelSelect } from "./ModelSelect";
import { FrequencyPenaltySlider, MaxContextSlider, MaxTokenSlider, PresencePenaltySlider, TemperatureSlider, TopPSlider } from "./SettingsSliders";

const ConfigMenu = ({
  setIsModalOpen,
  config,
  setConfig,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: ConfigInterface;
  setConfig: (config: ConfigInterface) => void;
}) => {
  const [_maxToken, _setMaxToken] = useState<number>(config.max_tokens);
  const [_maxContext, _setMaxContext] = useState<number>(config.max_context);
  const [_model, _setModel] = useState<ModelChoice>(config.model);
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty,
  );
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    config.frequency_penalty,
  );
  const { t } = useTranslation("model");

  const handleConfirm = () => {
    setConfig({
      max_tokens: _maxToken,
      max_context: _maxContext,
      model: _model,
      temperature: _temperature,
      presence_penalty: _presencePenalty,
      top_p: _topP,
      frequency_penalty: _frequencyPenalty,
    });
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title={t("configuration") as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleConfirm}
      handleClickBackdrop={handleConfirm}
    >
      <div className="p-6 border-b bg-neutral-base">
        <label className="block text-sm font-medium text-custom-white pb-2">
          {t("model")}:
        </label>
        <ModelSelect _model={_model} _setModel={_setModel} />
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
      </div>
    </PopupModal>
  );
};


export default ConfigMenu;
