//App.tsx

import React, { useEffect } from 'react';
import useStore from '@store/store';
import i18n from './i18n';
import { keyboardShortcuts, KeyboardShortcut, KeyboardModifiers } from '@constants/KeyboardShortcuts';
import Chat from '@components/Chat';
import Menu from '@components/Menu';

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

  if (isElectron())
    window.electronAPI.setCloseToTray(useStore((state) => state.closeToTray))

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

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Shortcut handling
  const handleKeyDown = (event: KeyboardEvent) => {
    const shortcuts = Object.values(keyboardShortcuts);
    const shortcut = shortcuts.find((s) => {
      const modifiers = s.modifiers;
      const key = s.key.toUpperCase();
      const isModifierPressed =
        (modifiers & KeyboardModifiers.CTRL && event.ctrlKey) ||
        (modifiers & KeyboardModifiers.SHIFT && event.shiftKey) ||
        (modifiers & KeyboardModifiers.NONE && !event.ctrlKey && !event.shiftKey);
      const isKeyMatch = key === event.key.toUpperCase();
      return isModifierPressed && isKeyMatch;
    });
    if (shortcut) {
      event.preventDefault();
      //call shortcut action block:
      shortcut.actionBlock();
    }
  };


  return (
    <div className='overflow-hidden w-full h-full relative'>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </div>
  );
}

export default App;
