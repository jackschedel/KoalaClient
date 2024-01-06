import React, { useEffect } from 'react';
import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';

import useAddChat from '@hooks/useAddChat';
import useGoBack from '@hooks/useGoBack';
import useGoForward from '@hooks/useGoForward';
import useCopyCodeBlock from '@hooks/useCopyCodeBlock';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import isElectron from '@utils/electron';

function App() {
  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const addChat = useAddChat();
  const goBack = useGoBack();
  const goForward = useGoForward();
  const copyCodeBlock = useCopyCodeBlock();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Put any general app-wide keybinds here:

    // ctrl+e - Toggle side menu
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      setHideSideMenu(!hideSideMenu);
    }

    // ctrl+n - New chat
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      addChat();
    }

    // ctrl+o - Copy code block
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      copyCodeBlock();
    }

    // ctrl+left - Previous chat
    if (e.ctrlKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    }

    // ctrl+left - Next chat
    if (e.ctrlKey && e.key === 'ArrowRight') {
      e.preventDefault();
      goForward();
    }
  };

  if (isElectron()) {
    window.electronAPI.setCloseToTray(useStore((state) => state.closeToTray));
  }

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    // legacy local storage
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');

    if (apiKey) {
      // legacy local storage
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme) {
      // legacy local storage
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }

    if (oldChats) {
      // legacy local storage
      try {
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0) {
          setChats(chats);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        console.log(e);
        initialiseNewChat();
      }
      localStorage.removeItem('chats');
    } else {
      // existing local storage
      const chats = useStore.getState().chats;
      const currentChatIndex = useStore.getState().currentChatIndex;
      if (!chats || chats.length === 0) {
        initialiseNewChat();
      }
      if (
        chats &&
        !(currentChatIndex >= 0 && currentChatIndex < chats.length)
      ) {
        setCurrentChatIndex(0);
      }
    }
  }, []);

  return (
    <div
      tabIndex={0}
      className='overflow-hidden w-full h-full relative'
      onKeyDown={handleKeyDown}
    >
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </div>
  );
}

export default App;
