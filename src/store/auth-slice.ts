import { defaultAPIEndpoint } from '@constants/auth';
import { EndpointAuth } from '@type/api';
import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  apiEndpoint: string;
  firstVisit: boolean;
  apiAuth: EndpointAuth[];
  setApiKey: (apiKey: string) => void;
  setApiEndpoint: (apiEndpoint: string) => void;
  setFirstVisit: (firstVisit: boolean) => void;
  setApiAuth: (apiAuth: EndpointAuth[]) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || undefined,
  apiEndpoint: defaultAPIEndpoint,
  firstVisit: true,
  apiAuth: [{ endpoint: defaultAPIEndpoint, apiKey: '' }],
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
});
