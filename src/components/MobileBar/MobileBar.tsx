import React from 'react';
import useGStore from '@store/cloud-auth-store';
import useStore from '@store/store';
import PlusIcon from '@icon/PlusIcon';
import MenuIcon from '@icon/MenuIcon';
import useAddChat from '@hooks/useAddChat';
import { SyncIcon } from '@components/GoogleSync/GoogleSync';
import isElectron from '@utils/electron';
import CloneChat from '@components/Chat/ChatContent/CloneChat';
import BackIcon from '@icon/BackIcon';
import ForwardIcon from '@icon/ForwardIcon';

import useGoBack from '@hooks/useGoBack';
import useGoForward from '@hooks/useGoForward';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

const MobileBar = () => {
  const generating = useStore((state) => state.generating);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const chats = useStore((state) => state.chats);
  const bottomMessageRef = useStore((state) => state.bottomMessageRef);
  const cloudSync = useGStore((state) => state.cloudSync);
  const syncStatus = useGStore((state) => state.syncStatus);

  const chatTitle = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].title
      : 'New Chat'
  );

  const addChat = useAddChat();
  const goBack = useGoBack();
  const goForward = useGoForward();

  return (
    <div className='sticky top-0 left-0 w-full z-50 flex items-center border-b-2 border-neutral-base bg-neutral-dark px-2 pt-1.5 pb-1 text-custom-white sm:pl-3'>
      <button
        type='button'
        className='-mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-light mr-4'
        onClick={() => {
          setHideSideMenu(!hideSideMenu);
        }}
      >
        <span className='sr-only'>Open sidebar</span>
        <MenuIcon />
      </button>
      <div className='mb-1'>
        {!isElectron() &&
          googleClientId &&
          cloudSync &&
          syncStatus === 'unauthenticated' && <SyncIcon status={syncStatus} />}
      </div>
      <button
        type='button'
        className={`-mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-light ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating) {
            goBack();
          }
        }}
      >
        <span className='sr-only'>Open sidebar</span>
        <BackIcon height='1em' />
      </button>
      <button
        type='button'
        className={`-mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-light ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating) {
            goForward();
          }
        }}
      >
        <span className='sr-only'>Open sidebar</span>
        <ForwardIcon height='1em' />
      </button>
      <h1 className='flex-1 text-center text-base font-normal px-2 py-0 max-h-20 overflow-y-auto'>
        {chatTitle}
      </h1>
      <div className='ml-14'>
        <CloneChat />
      </div>
      <button
        type='button'
        className={`ml-4 text-custom-white transition-opacity ${
          generating
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer opacity-100'
        }`}
        onClick={() => {
          if (!generating) {
            addChat(chats?.[currentChatIndex]?.folder);
            bottomMessageRef?.current?.focus();
          }
        }}
      >
        <div className='-ml-0.5 -mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-light'>
          <PlusIcon className='h-6 w-6' />
        </div>
      </button>
    </div>
  );
};

export default MobileBar;
