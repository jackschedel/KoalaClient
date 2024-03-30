import CrossIcon from '@icon/CrossIcon';
import DownChevronArrow from '@icon/DownChevronArrow';
import HiddenIcon from '@icon/HiddenIcon';
import VisibleIcon from '@icon/VisibleIcon';
import { EndpointAuth } from '@type/api';
import { ModelDefinition } from '@type/chat';
import React, { useState } from 'react';

interface ModelInputProps {
    modelDef: ModelDefinition;
    index: number;
    apiAuth: EndpointAuth[];
    setModelDefs: React.Dispatch<React.SetStateAction<ModelDefinition[]>>;
    setHideModel: (index: number, value: boolean) => void;
    deleteModel: (index: number) => void;
    setModelEndpoint: (index: number, value: number) => void;
}


export const ModelInput: React.FC<ModelInputProps> = ({
    modelDef,
    index,
    apiAuth,
    setModelDefs,
    setHideModel,
    deleteModel,
    setModelEndpoint,
}) => {
    const [_modelDef, _setModelDef] = useState<ModelDefinition>(modelDef);
    const [_activeDropdown, _setActiveDropdown] = useState<boolean>(false);

    const handleModelChange = (field: string, value: string | number | boolean) => {
        _setModelDef(prev => ({ ...prev, [field]: value }));
    };
    return (
        <div key={`model${index}`} className='mb-4 p-1 pb-4 border-b border-gray-600/50 shadow-inner'>
            <div className='flex items-center border-b border-neutral-base/50 mb-1 p-1'>
                <div className='flex-1'>
                    <input
                        type='text'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Nickname'
                        value={_modelDef.name}
                        onChange={e => handleModelChange('name', e.target.value)}
                        title='Nickname'
                    />
                </div>
                <div className='flex-1 px-1'>
                    <input
                        type='text'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Model'
                        value={_modelDef.model}
                        onChange={e => handleModelChange('model', e.target.value)}
                        title='Model'
                    />
                </div>
                <div className='flex-1'>
                    <button
                        className='btn bg-custom-white text-custom-black btn-small overflow-clip relative pr-6 w-80'
                        type='button'
                        onClick={() => _setActiveDropdown(!_activeDropdown)}
                        title='Endpoint Dropdown'
                    >
                        <span className='inline-block truncate max-w-full'>
                            {_modelDef.endpoint !== undefined && apiAuth[_modelDef.endpoint]
                                ? apiAuth[_modelDef.endpoint].endpoint.replace(/^https?:\/\//, '')
                                : 'Endpoint Undefined'}
                        </span>
                        <DownChevronArrow className='absolute right-0 mr-1 flex items-center' />
                    </button>
                    <div
                        id='dropdown'
                        className={`${_activeDropdown ? '' : 'hidden'
                            } absolute top-100 bottom-100 z-10 w-80 bg-custom-white text-custom-black shadow-xl rounded-lg border border-neutral-base group`}>
                        <ul className='text-sm p-0 m-0 max-h-72 overflow-clip' aria-labelledby='dropdownDefaultButton'>
                            {apiAuth.map((auth, authIndex) => (
                                <li
                                    className='btn btn-small w-full overflow-clip hover:bg-neutral-light hover:text-custom-white cursor-pointer'
                                    onClick={() => {
                                        setModelEndpoint(index, authIndex);
                                        _setActiveDropdown(false);
                                    }}
                                    key={`dropdown${authIndex}`}
                                >
                                    {auth.endpoint.replace(/^https?:\/\//, '')}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='p-1 ml-2 hover:text-neutral-dark hover:bg-custom-white hover:rounded' onClick={() => deleteModel(index)}>
                    {index !== 0 && <CrossIcon />}
                </div>
            </div>
            <div className='flex items-center border-b border-neutral-base/50 px-1'>
                <div className='flex-1 pr-1'>
                    <input
                        type='text'
                        pattern='[0-9]*'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Max Tokens'
                        value={_modelDef.model_max_tokens || ''}
                        onChange={e => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) handleModelChange('model_max_tokens', value);
                        }}
                        title='Max Tokens'
                    />
                </div>
                <div className='flex-1 pr-1'>
                    <input
                        type='text'
                        pattern='[0-9]*'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Max Context'
                        value={_modelDef.model_max_context || ''}
                        onChange={e => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) handleModelChange('model_max_context', value);
                        }}
                        title='Max Context'
                    />
                </div>
                <div className='flex-1 pr-1'>
                    <input
                        type='text'
                        pattern='[0-9]*'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Prompt Cost*'
                        value={_modelDef?.prompt_cost_1000 || ''}
                        onChange={e => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) handleModelChange('prompt_cost_1000', value);
                        }}
                        title='Prompt Cost'
                    />
                </div>
                <div className='flex-1'>
                    <input
                        type='text'
                        pattern='[0-9]*'
                        className='text-custom-black p-2 text-sm border-none bg-custom-white rounded-md m-0 w-full mr-0 h-8 focus:outline-none'
                        placeholder='Completion Cost*'
                        value={_modelDef.completion_cost_1000 || ''}
                        onChange={e => {
                            const value = Number(e.target.value);
                            if (!isNaN(value)) handleModelChange('completion_cost_1000', value);
                        }}
                        title='Completion Cost'
                    />
                </div>
                <div className='p-1 ml-2 hover:text-custom-black hover:bg-custom-white hover:rounded'>
                    {_modelDef.swap_visible ? <VisibleIcon onClick={() => setHideModel(index, false)} /> : <HiddenIcon onClick={() => setHideModel(index, true)} />}
                </div>
            </div>
        </div>
    );

};