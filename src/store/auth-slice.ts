import { defaultAPIEndpoint } from '@constants/auth';
import { EndpointAuth } from '@type/api';
import { ModelDefinition } from '@type/chat';
import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  firstVisit: boolean;
  apiAuth: EndpointAuth[];
  modelDefs: ModelDefinition[];
  setApiKey: (apiKey: string) => void;
  setFirstVisit: (firstVisit: boolean) => void;
  setApiAuth: (apiAuth: EndpointAuth[]) => void;
  setModelDefs: (modelDefs: ModelDefinition[]) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  firstVisit: true,
  apiAuth: [{ endpoint: defaultAPIEndpoint, apiKey: '' }],
  modelDefs: [
    {
      name: 'gpt-3',
      model: 'gpt-3.5-turbo',
      endpoint: 0,
      model_max_context: 16385,
      model_max_tokens: 4096,
      prompt_cost_1000: 0.0005,
      completion_cost_1000: 0.0005,
      swap_visible: true,
    },
    {
      name: 'gpt-4',
      model: 'gpt-4-turbo-preview',
      endpoint: 0,
      model_max_context: 128000,
      model_max_tokens: 4096,
      prompt_cost_1000: 0.01,
      completion_cost_1000: 0.03,
      swap_visible: true,
    },
  ],
  setApiKey: (apiKey: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiKey: apiKey,
    }));
  },
  setFirstVisit: (firstVisit: boolean) => {
    set((prev: AuthSlice) => ({
      ...prev,
      firstVisit: firstVisit,
    }));
  },
  setApiAuth: (apiAuth: EndpointAuth[]) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiAuth,
    }));
  },
  setModelDefs: (modelDefs: ModelDefinition[]) => {
    set((prev: AuthSlice) => ({
      ...prev,
      modelDefs,
    }));
  },
});
