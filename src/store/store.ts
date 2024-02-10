import { create, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { createInputSlice, InputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { createPromptSlice, PromptSlice } from './prompt-slice';
import { createToastSlice, ToastSlice } from './toast-slice';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
  LocalStorageInterfaceV3ToV4,
  LocalStorageInterfaceV4ToV5,
  LocalStorageInterfaceV5ToV6,
  LocalStorageInterfaceV6ToV7,
  LocalStorageInterfaceV7ToV8,
  LocalStorageInterfaceV8ToV9,
} from '@type/chat';
import {
  migrateV0,
  migrateV1,
  migrateV2,
  migrateV3,
  migrateV4,
  migrateV5,
  migrateV6,
  migrateV7,
  migrateV8,
} from './migrate';

export type StoreState = ChatSlice &
  InputSlice &
  AuthSlice &
  ConfigSlice &
  PromptSlice &
  ToastSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  currentChatIndex: state.currentChatIndex,
  apiAuth: state.apiAuth,
  modelDefs: state.modelDefs,
  theme: state.theme,
  autoTitle: state.autoTitle,
  closeToTray: state.closeToTray,
  advancedMode: state.advancedMode,
  prompts: state.prompts,
  defaultChatConfig: state.defaultChatConfig,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  firstVisit: state.firstVisit,
  hideSideMenu: state.hideSideMenu,
  folders: state.folders,
  enterToSubmit: state.enterToSubmit,
  confirmEditSubmission: state.confirmEditSubmission,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
  totalTokenUsed: state.totalTokenUsed,
  countTotalTokens: state.countTotalTokens,
  costOfDeleted: state.costOfDeleted,
});

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createInputSlice(set, get),
      ...createAuthSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createToastSlice(set, get),
    }),
    {
      name: 'free-chat-gpt',
      partialize: (state) => createPartializedState(state),
      version: 9,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
          // falls through
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
          // falls through
          case 2:
            migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
          // falls through
          case 3:
            migrateV3(persistedState as LocalStorageInterfaceV3ToV4);
          // falls through
          case 4:
            migrateV4(persistedState as LocalStorageInterfaceV4ToV5);
          // falls through
          case 5:
            migrateV5(persistedState as LocalStorageInterfaceV5ToV6);
          // falls through
          case 6:
            migrateV6(persistedState as LocalStorageInterfaceV6ToV7);
          // falls through
          case 7:
            migrateV7(persistedState as LocalStorageInterfaceV7ToV8);
          // falls through
          case 8:
            migrateV8(persistedState as LocalStorageInterfaceV8ToV9);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);

export default useStore;
