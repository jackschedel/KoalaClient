import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';

import CrossIcon from '@icon/CrossIcon';
import PlusIcon from '@icon/PlusIcon';
import { EndpointAuth } from '@type/api';
import { ModelDefinition } from '@type/chat';

const ApiMenu = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(['main', 'api']);

  const apiAuth = useStore((state) => state.apiAuth);
  const setApiAuth = useStore((state) => state.setApiAuth);
  const modelDefs = useStore((state) => state.modelDefs);
  const setModelDefs = useStore((state) => state.setModelDefs);

  const [_apiAuth, _setApiAuth] = useState<EndpointAuth[]>(apiAuth);
  const [_modelDefs, _setModelDefs] = useState<ModelDefinition[]>(modelDefs);

  const handleSave = () => {
    setApiAuth(_apiAuth);
    setIsModalOpen(false);
    console.log(apiAuth);
  };

  const addApi = () => {
    _setApiAuth((prev) => {
      const newApiAuth = [...prev];
      newApiAuth.push({ endpoint: '', apiKey: '' });
      return newApiAuth;
    });
  };

  const deleteApi = (index: number) => {
    _setApiAuth((prev) => {
      const newApiAuth = [...prev];
      newApiAuth.splice(1, index);
      return newApiAuth;
    });
  };

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div className='p-6 border-b border-custom-white text-custom-white'>
        <div className='min-w-fit text-custom-white text-sm flex flex-col gap-3 leading-relaxed'>
          <div className='flex flex-col pt-6 max-w-full'>
            <div className='flex items-center border-b border-neutral-base/50 mb-1 p-1'>
              <div className='w-3/4'>
                <div className='text-center font-bold p-2'>Endpoint</div>
              </div>
              <div className='w-1/4'>
                <div className='text-center font-bold p-2'>Key</div>
              </div>
              <div className='p-1 ml-2 h-4 w-4'></div>
            </div>
            {_apiAuth.map((auth, index) => (
              <div
                key={index}
                className='flex items-center border-b border-neutral-base/50 mb-1 p-1'
              >
                <div className='w-3/4  pr-2'>
                  <input
                    type='text'
                    className='text-custom-black p-3 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                    value={auth.endpoint}
                    onChange={(e) => {
                      _setApiAuth((prev) => {
                        const newApiKeys = [...prev];
                        newApiKeys[index].endpoint = e.target.value;
                        return newApiKeys;
                      });
                    }}
                  />
                </div>
                <div className='w-1/4 pl-2'>
                  <input
                    type='password'
                    className='text-custom-black p-3 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                    value={auth.apiKey}
                    onChange={(e) => {
                      _setApiAuth((prev) => {
                        const newApiKeys = [...prev];
                        newApiKeys[index].apiKey = e.target.value;
                        return newApiKeys;
                      });
                    }}
                  />
                </div>
                <div
                  className='p-1 ml-2 hover:text-neutral-dark hover:bg-custom-white hover:rounded'
                  onClick={() => deleteApi(index)}
                >
                  <CrossIcon />
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-0 mb-8'>
            <div
              className='cursor-pointer p-2 mt-0 rounded-xl btn btn-neutral'
              onClick={addApi}
            >
              <PlusIcon />
            </div>
          </div>
          <p>
            <Trans
              i18nKey='apiKey.howTo'
              ns='api'
              components={[
                <a
                  key={null}
                  href='https://platform.openai.com/account/api-keys'
                  className='link'
                  target='_blank'
                  rel='noreferrer'
                />,
              ]}
            />
          </p>
          <p>{t('securityMessage', { ns: 'api' })}</p>
        </div>
      </div>
    </PopupModal>
  );
};

export default ApiMenu;
