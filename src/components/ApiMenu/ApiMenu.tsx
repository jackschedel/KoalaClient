import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PopupModal from '@components/PopupModal';

import CrossIcon from '@icon/CrossIcon';
import PlusIcon from '@icon/PlusIcon';
import { EndpointAuth } from '@type/api';
import { ModelDefinition, TotalTokenUsed } from '@type/chat';
import HiddenIcon from '@icon/HiddenIcon';
import VisibleIcon from '@icon/VisibleIcon';

import DownChevronArrow from '@icon/DownChevronArrow';
import { tokenCostToCost } from '@utils/messageUtils';
import { ModelInput } from './ModelInput';

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
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const setTotalTokenUsed = useStore((state) => state.setTotalTokenUsed);
  const costOfDeleted = useStore((state) => state.costOfDeleted);
  const setCostOfDeleted = useStore((state) => state.setCostOfDeleted);

  const [_apiAuth, _setApiAuth] = useState<EndpointAuth[]>(apiAuth);
  const [_modelDefs, _setModelDefs] = useState<ModelDefinition[]>(modelDefs);
  const [_totalTokenUsed, _setTotalTokenUsed] =
    useState<TotalTokenUsed>(totalTokenUsed);

  const [activeDropdown, setActiveDropdown] = useState<null | number>(null);

  const handleSave = () => {
    setApiAuth(_apiAuth);
    setModelDefs(_modelDefs);
    setTotalTokenUsed(_totalTokenUsed);
    setIsModalOpen(false);
  };

  const addApi = () => {
    _setApiAuth((prev) => [...prev, { endpoint: '', apiKey: '' }]);
  };

  const deleteApi = (index: number) => {
    _setApiAuth((prev) => {
      const newApiAuth = [...prev];
      newApiAuth.splice(index, 1);
      return newApiAuth;
    });
    _modelDefs.forEach((modelDef, ind) => {
      if (modelDef.endpoint === index) {
        deleteModel(ind);
      } else if (modelDef.endpoint > index) {
        modelDef.endpoint--;
      }
    });
  };

  const addModel = () => {
    _setModelDefs((prev) => [
      ...prev,
      {
        name: '',
        model: '',
        endpoint: 0,
        model_max_context: 0,
        model_max_tokens: 0,
        prompt_cost_1000: 0,
        completion_cost_1000: 0,
        swap_visible: true,
      },
    ]);
  };

  const setHideModel = (index: number, value: boolean) => {
    _setModelDefs((prev) => {
      const newModelDefs = [...prev];
      newModelDefs[index].swap_visible = value;
      return newModelDefs;
    });
  };

  const setModelEndpoint = (index: number, value: number) => {
    _setModelDefs((prev) => {
      const newModelDefs = [...prev];
      newModelDefs[index].endpoint = value;
      return newModelDefs;
    });
  };

  const deleteModel = (index: number) => {
    const modelCostHistory = tokenCostToCost(
      _totalTokenUsed[index],
      index,
      modelDefs
    );

    setCostOfDeleted(costOfDeleted + modelCostHistory);

    _setTotalTokenUsed((prev) => {
      const newTotalTokenUsed = { ...prev };
      delete newTotalTokenUsed[index];
      return newTotalTokenUsed;
    });

    _setModelDefs((prev) => {
      const newModelDefs = [...prev];
      newModelDefs.splice(index, 1);
      return newModelDefs;
    });
  };

  return (
    <PopupModal
      title={t('api') as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleSave}
    >
      <div
        className='p-6 border-b border-custom-white text-custom-white'
        onClick={() => {
          if (activeDropdown != null) {
            setActiveDropdown(null);
          }
        }}
      >
        <div className='min-w-fit text-custom-white text-sm flex flex-col gap-2 leading-relaxed'>
          <p>Deleting an endpoint will delete all associated models.</p>
          <p>Whisper record always uses the first endpoint.</p>
          <div className='flex flex-col max-w-full'>
            <div className='flex items-center border-b border-neutral-base/50 mb-1 p-1'>
              <div className='w-3/4 text-center font-bold p-2'>
                Endpoint URL
              </div>
              <div className='w-1/4 text-center font-bold p-2'>API Key</div>
              <div className='p-1 ml-2 h-4 w-4'></div>
            </div>
            {_apiAuth.map((auth, index) => (
              <div
                key={'api' + index}
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
                  <CrossIcon
                    className={`${_apiAuth.length > 1 ? '' : 'invisible'}`}
                  />
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
          <div className='flex flex-col max-w-full'>
            <div className='text-center font-bold items-center border-b border-neutral-base/50 mb-1 p-1'>
              Models
            </div>
            {_modelDefs.map((modelDef, index) => (
              <ModelInput
                key={index}
                modelDef={modelDef}
                index={index}
                apiAuth={_apiAuth}
                setModelDefs={_setModelDefs}
                setHideModel={setHideModel}
                deleteModel={deleteModel}
                setModelEndpoint={setModelEndpoint}
              />
            ))}
          </div>
          <div className='flex justify-center mt-0 mb-8'>
            <div
              className='cursor-pointer p-2 mt-0 rounded-xl btn btn-neutral'
              onClick={addModel}
            >
              <PlusIcon />
            </div>
          </div>
          <p>* Prompt costs are in dollars per 1000 tokens.</p>
          <p>Title generation always uses the first model.</p>
          <p>
            Hiding a model option will only remove it from the top-bar dropdown.
          </p>
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
            />{' '}
            {t('securityMessage', { ns: 'api' })}
          </p>
        </div>
      </div>
    </PopupModal>
  );
};

export default ApiMenu;
