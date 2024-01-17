import { defaultAPIEndpoint } from '@constants/auth';
import { StoreSlice } from './store';

export interface AuthSlice {
  apiKeys: string[];
  apiEndpoints: string[];
  firstVisit: boolean;
  setApiKeys: (apiKey: string[]) => void;
  setApiEndpoints: (apiEndpoint: string[]) => void;
  setFirstVisit: (firstVisit: boolean) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
  apiKeys: [import.meta.env.VITE_OPENAI_API_KEY] || [],
  apiEndpoints: [defaultAPIEndpoint],
  firstVisit: true,
  setApiKeys: (apiKeys: string[]) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiKeys: apiKeys,
    }));
  },
  setApiEndpoints: (apiEndpoints: string[]) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiEndpoints: apiEndpoints,
    }));
  },
  setFirstVisit: (firstVisit: boolean) => {
    set((prev: AuthSlice) => ({
      ...prev,
      firstVisit: firstVisit,
    }));
  },
});
