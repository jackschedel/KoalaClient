import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';

import useAddChat from '@hooks/useAddChat';
import useGoBack from '@hooks/useGoBack';
import useGoForward from '@hooks/useGoForward';
import useCopyCodeBlock from '@hooks/useCopyCodeBlock';
import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import useSubmit from '@hooks/useSubmit';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import isElectron from '@utils/electron';
import GlobalContext from '@hooks/GlobalContext';

function App() {
  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const setHideSideMenu = useStore((state) => state.setHideSideMenu);
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const addChat = useAddChat();
  const goBack = useGoBack();
  const goForward = useGoForward();
  const copyCodeBlock = useCopyCodeBlock();
  const { handleSubmit } = useSubmit();

  const [sharedTextareaRef, setSharedTextareaRef] =
    useState<React.RefObject<HTMLTextAreaElement> | null>(null);

  const setRef = (newRef: React.RefObject<HTMLTextAreaElement> | null) => {
    setSharedTextareaRef(newRef);
  };

  const handleGenerate = () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const content = sharedTextareaRef?.current?.value;
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (!content) {
      return;
    }

    updatedMessages.push({ role: 'user', content: content });
    if (sharedTextareaRef && sharedTextareaRef.current) {
      sharedTextareaRef.current.value = '';
    }

    setChats(updatedChats);
    handleSubmit();
  };

  const pasteSubmit = async () => {
    try {
      if (useStore.getState().generating) return;
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );
      const updatedMessages = updatedChats[currentChatIndex].messages;

      const text = await navigator.clipboard.readText();
      if (!text) {
        return;
      }

      updatedMessages.push({ role: 'user', content: text });
      if (sharedTextareaRef && sharedTextareaRef.current) {
        sharedTextareaRef.current.value = '';
      }

      setChats(updatedChats);
      handleSubmit();
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

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

    // ctrl+g - Focus textarea
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      sharedTextareaRef?.current?.focus();
    }

    // ctrl+s - Save bottom message + generate
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleGenerate();
    }

    // ctrl+p - New chat from clipboard (insta-generate)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      console.log('test');
      addChat();
      pasteSubmit();
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

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // Mouse button 3 (back)
    if (e.button === 3) {
      e.preventDefault();
      goBack();
    }

    // Mouse button 4 (forward)
    if (e.button === 4) {
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

  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 3 || e.button === 4) {
        handleMouseUp(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ ref: sharedTextareaRef, setRef }}>
      <div
        tabIndex={0}
        className='overflow-hidden w-full h-full relative'
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
      >
        <Menu />
        <Chat />
        <ApiPopup />
        <Toast />
      </div>
    </GlobalContext.Provider>
  );
}

export default App;
