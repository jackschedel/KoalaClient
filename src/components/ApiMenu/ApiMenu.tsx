import React, { useState, useRef } from 'react';
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

  const dropdownRef = useRef<HTMLButtonElement>(null);

  const handleSave = () => {
    setApiAuth(_apiAuth);
    setModelDefs(_modelDefs);
    setTotalTokenUsed(_totalTokenUsed);
    setIsModalOpen(false);
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
      newApiAuth.splice(index, 1);
      return newApiAuth;
    });
    _modelDefs.forEach((modelDef, ind) => {
      if (modelDef.endpoint === index) {
        deleteModel(ind);
      } else if (modelDef.endpoint > index) {
        _setModelDefs((prevDefs) => {
          const newDefs = [...prevDefs];
          newDefs[ind].endpoint--;
          return newDefs;
        });
      }
    });
  };

  const addModel = () => {
    _setModelDefs((prev) => {
      const newModelDefs = [...prev];
      newModelDefs.push({
        name: '',
        model: '',
        endpoint: 0,
        model_max_context: 0,
        model_max_tokens: 0,
        prompt_cost_1000: 0,
        completion_cost_1000: 0,
        swap_visible: true,
      });
      return newModelDefs;
    });
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
        className='p-4 border-b border-custom-white text-custom-white overflow-x-auto'
        onClick={() => {
          if (activeDropdown != null) {
            setActiveDropdown(null);
          }
        }}
      >
        <div className='w-full text-custom-white text-sm flex flex-col gap-2 leading-relaxed'>
          <p className='text-xs sm:text-sm'>
            Deleting an endpoint will delete all associated models.
          </p>
          <p className='text-xs sm:text-sm'>
            Whisper record always uses the first endpoint.
          </p>
          <div className='flex flex-col'>
            <div className='flex items-center border-b border-neutral-base/50 mb-1 p-2'>
              <div className='flex-[3] text-center font-bold p-2 min-w-0'>
                Endpoint URL
              </div>
              <div className='flex-1 text-center font-bold p-2 min-w-0'>
                API Key
              </div>
              <div className='p-1 ml-2 h-4 w-4'></div>
            </div>
            {_apiAuth.map((auth, index) => (
              <div
                key={'api' + index}
                className='flex flex-wrap sm:flex-nowrap items-center border-b border-neutral-base/50 mb-1 p-2'
              >
                <div className='flex-[3] pr-2 min-w-0'>
                  <input
                    type='text'
                    className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full h-8 focus:outline-none'
                    value={auth.endpoint}
                    onChange={(e) => {
                      _setApiAuth((prev) => {
                        const newApiKeys = [...prev];
                        newApiKeys[index].endpoint = e.target.value;
                        return newApiKeys;
                      });
                    }}
                    placeholder='https://api.endpoint.com'
                  />
                </div>
                <div className='flex-1 pl-2 min-w-0'>
                  <input
                    type='password'
                    className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 h-8 focus:outline-none w-full'
                    value={auth.apiKey}
                    onChange={(e) => {
                      _setApiAuth((prev) => {
                        const newApiKeys = [...prev];
                        newApiKeys[index].apiKey = e.target.value;
                        return newApiKeys;
                      });
                    }}
                    placeholder='API Key'
                  />
                </div>
                <div
                  className='p-1 ml-2 hover:text-neutral-dark hover:bg-custom-white hover:rounded cursor-pointer'
                  onClick={() => deleteApi(index)}
                >
                  <CrossIcon
                    className={`${_apiAuth.length > 1 ? '' : 'invisible'}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-4 mb-8'>
            <button
              className='cursor-pointer p-2 mt-0 rounded-xl btn btn-neutral w-full sm:w-auto'
              onClick={addApi}
            >
              <PlusIcon />
              <span className='ml-2'>Add API</span>
            </button>
          </div>

          <div className='flex flex-col'>
            <div className='text-center font-bold items-center border-b border-neutral-base/50 mb-1 p-2'>
              Models
            </div>
            {_modelDefs.map((modelDef, index) => (
              <div key={'model' + index} className='mb-4'>
                <div className='flex flex-wrap sm:flex-nowrap items-center border-b border-neutral-base/50 mb-1 p-1'>
                  <div className='flex-1 min-w-0'>
                    <input
                      type='text'
                      className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full h-8 focus:outline-none'
                      placeholder='Nickname'
                      value={modelDef.name}
                      onChange={(e) => {
                        _setModelDefs((prev) => {
                          const newModelDefs = [...prev];
                          newModelDefs[index].name = e.target.value;
                          return newModelDefs;
                        });
                      }}
                    />
                  </div>
                  <div className='flex-1 px-1 min-w-0'>
                    <input
                      type='text'
                      className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full h-8 focus:outline-none'
                      placeholder='Model'
                      value={modelDef.model}
                      onChange={(e) => {
                        _setModelDefs((prev) => {
                          const newModelDefs = [...prev];
                          newModelDefs[index].model = e.target.value;
                          return newModelDefs;
                        });
                      }}
                    />
                  </div>
                  <div className='flex-[2] min-w-0'>
                    <button
                      ref={dropdownRef}
                      className='btn bg-custom-white text-custom-black btn-small overflow-clip relative pr-6 w-full'
                      type='button'
                      onClick={() => {
                        if (activeDropdown === index) {
                          setActiveDropdown(null);
                        } else {
                          setActiveDropdown(index);
                        }
                      }}
                    >
                      <span className='inline-block truncate max-w-full'>
                        {_apiAuth[modelDef.endpoint]
                          ? _apiAuth[modelDef.endpoint].endpoint.replace(
                              /^https?:\/\//,
                              ''
                            )
                          : 'Endpoint Undefined'}
                      </span>

                      <DownChevronArrow className='absolute right-0 mr-1 flex items-center' />
                    </button>

                    <div
                      id='dropdown'
                      className={`${
                        activeDropdown != null && activeDropdown == index
                          ? ''
                          : 'hidden'
                      } absolute top-100 bottom-100 z-10 bg-custom-white text-custom-black shadow-xl rounded-lg border border-neutral-base group`}
                      style={{ width: dropdownRef.current?.offsetWidth + 'px' }}
                    >
                      <ul
                        className='text-sm p-0 m-0 max-h-72 w-full overflow-y-scroll'
                        aria-labelledby='dropdownDefaultButton'
                      >
                        {_apiAuth.map((auth, authIndex) => (
                          <li
                            className='btn btn-small w-full overflow-clip hover:bg-neutral-light hover:text-custom-white cursor-pointer overflow-clip'
                            onClick={() => {
                              setModelEndpoint(index, authIndex);
                              setActiveDropdown(null);
                            }}
                            key={'dropdown' + authIndex}
                          >
                            {auth.endpoint.replace(/^https?:\/\//, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div
                    className='p-1 ml-2 hover:text-neutral-dark hover:bg-custom-white hover:rounded'
                    onClick={() => deleteModel(index)}
                  >
                    <CrossIcon
                      className={`${_modelDefs.length > 1 ? '' : 'invisible'}`}
                    />
                  </div>
                </div>
                <div className='flex items-center border-b border-neutral-base/50 px-1'>
                  <div className='flex-1  pr-1'>
                    <input
                      type='text'
                      pattern='[0-9]*'
                      className='text-custom-black p-3 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                      placeholder='Max Tokens'
                      value={modelDef.model_max_tokens || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (!isNaN(value)) {
                          _setModelDefs((prev) => {
                            const newModelDefs = [...prev];
                            newModelDefs[index].model_max_tokens = value;
                            return newModelDefs;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className='flex-1  pr-1'>
                    <input
                      type='text'
                      pattern='[0-9]*'
                      className='text-custom-black p-3 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                      placeholder='Max Context'
                      value={modelDef.model_max_context || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (!isNaN(value)) {
                          _setModelDefs((prev) => {
                            const newModelDefs = [...prev];
                            newModelDefs[index].model_max_context = value;
                            return newModelDefs;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className='flex-1  pr-1'>
                    <input
                      type='text'
                      pattern='[0-9]*'
                      className='text-custom-black p-3 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                      placeholder='Prompt Cost*'
                      value={modelDef?.prompt_cost_1000 || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (!isNaN(value)) {
                          _setModelDefs((prev) => {
                            const newModelDefs = [...prev];
                            newModelDefs[index].prompt_cost_1000 = value;
                            return newModelDefs;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <input
                      type='number'
                      className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full h-8 focus:outline-none'
                      placeholder='Completion Cost*'
                      value={modelDef.completion_cost_1000 || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (!isNaN(value)) {
                          _setModelDefs((prev) => {
                            const newModelDefs = [...prev];
                            newModelDefs[index].completion_cost_1000 = value;
                            return newModelDefs;
                          });
                        }
                      }}
                    />
                  </div>
                  <div className='p-1 ml-2 hover:text-custom-black hover:bg-custom-white hover:rounded cursor-pointer'>
                    {_modelDefs[index].swap_visible ? (
                      <VisibleIcon onClick={() => setHideModel(index, false)} />
                    ) : (
                      <HiddenIcon onClick={() => setHideModel(index, true)} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-4 mb-8'>
            <button
              className='cursor-pointer p-2 mt-0 rounded-xl btn btn-neutral w-full sm:w-auto'
              onClick={addModel}
            >
              <PlusIcon />
              <span className='ml-2'>Add Model</span>
            </button>
          </div>
          <p className='text-xs sm:text-sm'>
            * Prompt costs are in dollars per 1000 tokens.
          </p>
          <p className='text-xs sm:text-sm'>
            Title generation always uses the first model.
          </p>
          <p className='text-xs sm:text-sm'>
            Hiding a model option will only remove it from the top-bar dropdown.
          </p>
          <p className='text-xs sm:text-sm'>
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
