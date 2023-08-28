import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import useStore from '@store/store';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface } from '@type/chat';
import { ModelChoice } from '@type/chat';
import {
  _defaultChatConfig,
  modelMaxToken,
  modelOptions,
} from '@constants/chat';
import { ModelSelect } from '@components/ConfigMenu/ModelSelect';

const ModelConfigBar = React.memo(() => {
  const { t } = useTranslation('model');
  const config = useStore(
    (state) =>
      state.chats &&
      state.chats.length > 0 &&
      state.currentChatIndex >= 0 &&
      state.currentChatIndex < state.chats.length
        ? state.chats[state.currentChatIndex].config
        : undefined,
    shallow
  );
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [_model, _setModel] = useState<ModelChoice>(
    config?.model || 'gpt-3.5-turbo'
  );

  const setConfig = (config: ConfigInterface) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    updatedChats[currentChatIndex].config = config;
    setChats(updatedChats);
  };

  // for migrating from old ChatInterface to new ChatInterface (with config)
  useEffect(() => {
    const chats = useStore.getState().chats;
    if (chats && chats.length > 0 && currentChatIndex !== -1 && !config) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      updatedChats[currentChatIndex].config = { ..._defaultChatConfig };
      setChats(updatedChats);
    }
  }, [currentChatIndex]);

  return config ? (
    <>
      <div className='sticky p-1 pb-0.5  mb-19 top-0 flex gap-x-3 gap-y-1 flex-wrap w-full items-center justify-center border-b-2 border-neutral-base bg-neutral-dark text-custom-white z-50'>
        <div className='sticky top-0 flex gap-x-1 gap-y-0 flex-wrap w-full items-center justify-center pt-0 pb-1'>
          <div className='flex -mb-3 mr-1 mt-1'>
            <ModelSelect
              _model={config.model}
              _setModel={(ac) => {
                const newModel = ac.valueOf();

                let newMaxTokens = config.max_tokens;
                if (newMaxTokens > modelMaxToken[newModel as ModelChoice]) {
                  newMaxTokens = modelMaxToken[newModel as ModelChoice];
                }

                const updatedConfig = {
                  ...config,
                  max_tokens: Number(newMaxTokens.valueOf()),
                  model: newModel as ModelChoice,
                };

                setConfig(updatedConfig);
              }}
            />
          </div>
          <div
            className='text-center p-1.5 rounded-md btn-neutral cursor-pointer'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {t('token.label')}: {config.max_tokens}
          </div>
          <div
            className='text-center p-1.5 rounded-md btn-neutral cursor-pointer'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {t('context.label')}: {config.max_context}
          </div>
          <div
            className='text-center p-1.5 rounded-md btn-neutral cursor-pointer'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {t('temperature.label')}: {config.temperature}
          </div>
          <div
            className='text-center p-1.5 rounded-md btn-neutral cursor-pointer'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {t('topP.label')}: {config.top_p}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ConfigMenu
          setIsModalOpen={setIsModalOpen}
          config={config}
          setConfig={setConfig}
        />
      )}
    </>
  ) : (
    <></>
  );
});

export default ModelConfigBar;
