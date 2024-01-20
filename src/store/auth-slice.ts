import { defaultAPIEndpoint } from '@constants/auth';
import { EndpointAuth } from '@type/api';
import { ModelDefinition } from '@type/chat';
import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  apiEndpoint: string;
  firstVisit: boolean;
  apiAuth: EndpointAuth[];
  modelDefs: ModelDefinition[];
  setApiKey: (apiKey: string) => void;
  setApiEndpoint: (apiEndpoint: string) => void;
  setFirstVisit: (firstVisit: boolean) => void;
  setApiAuth: (apiAuth: EndpointAuth[]) => void;
  setModelDefs: (modelDefs: ModelDefinition[]) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || undefined,
  apiEndpoint: defaultAPIEndpoint,
  firstVisit: true,
  apiAuth: [{ endpoint: defaultAPIEndpoint, apiKey: '' }],
  modelDefs: [
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
  ],
  setApiKey: (apiKey: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiKey: apiKey,
    }));
  },
  setApiEndpoint: (apiEndpoint: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiEndpoint: apiEndpoint,
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
