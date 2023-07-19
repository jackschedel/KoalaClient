import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import useStore from '@store/store';
import ConfigMenu from '@components/ConfigMenu';
import { ChatInterface, ConfigInterface, ModelOptions } from '@type/chat';
import { _defaultChatConfig, modelOptions } from '@constants/chat';
import { ModelSelector } from '@components/ConfigMenu/ConfigMenu';

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
   const advancedMode = useStore((state) => state.advancedMode);
   const currentChatIndex = useStore((state) => state.currentChatIndex);
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [_model, _setModel] = useState<ModelOptions>(config?.model || 'gpt-3.5-turbo');





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

         <div className='sticky p-1 pb-0.5  mb-19 top-0 flex gap-x-3 gap-y-1 flex-wrap w-full items-center justify-center border-b border-black/20 bg-gray-50/80 dark:border-gray-900 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 z-50'>
            {advancedMode &&
               <div className='sticky top-0 flex gap-x-3 gap-y-1 flex-wrap w-full items-center justify-center p-1 pb-0'>



                  <div className='flex -mb-3 mr-1 '>
                     <span className='w-11 top-1 relative'>Model: &nbsp;</span>
                     <ModelSelector _model={config.model} _setModel={(ac) => {
                        const updatedConfig = { ...config, model: ac.valueOf() as ModelOptions };
                        setConfig(updatedConfig);
                     }} />
                  </div>
                  <div className='text-center p-1.5 opacity-100 rounded-md bg-gray-300/90 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer'
                     onClick={() => {
                        setIsModalOpen(true);
                     }}>
                     {t('token.label')}: {config.max_tokens}
                  </div>
                  <div className='text-center p-1.5 rounded-md bg-gray-300/90 dark:bg-gray-800/90 hover:bg-gray-300/90 dark:hover:bg-gray-900 cursor-pointer'
                     onClick={() => {
                        setIsModalOpen(true);
                     }}>
                     {t('temperature.label')}: {config.temperature}
                  </div>
                  <div className='text-center p-1.5 rounded-md bg-gray-300/90 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer'
                     onClick={() => {
                        setIsModalOpen(true);
                     }}>
                     {t('topP.label')}: {config.top_p}
                  </div>
                  <div className='text-center p-1.5 rounded-md bg-gray-300/90 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer'
                     onClick={() => {
                        setIsModalOpen(true);
                     }}>
                     {t('presencePenalty.label')}: {config.presence_penalty}
                  </div>
                  <div className='text-center p-1.5 rounded-md bg-gray-300/90 dark:bg-gray-800/90 hover:bg-gray-300 dark:hover:bg-gray-900 cursor-pointer'
                     onClick={() => {
                        setIsModalOpen(true);
                     }}>
                     {t('frequencyPenalty.label')}: {config.frequency_penalty}
                  </div>
               </div>}
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
