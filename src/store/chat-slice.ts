import { StoreSlice } from './store';
import { ChatInterface, FolderCollection, MessageInterface } from '@type/chat';
import { RefObject } from 'react';

export interface ChatSlice {
  messages: MessageInterface[];
  chats?: ChatInterface[];
  currentChatIndex: number;
  generating: boolean;
  error: string;
  folders: FolderCollection;
  bottomMessageRef: RefObject<HTMLTextAreaElement> | null;
  isRecording: boolean;
  setBottomMessageRef: (
    bottomMessageRef: RefObject<HTMLTextAreaElement> | null
  ) => void;
  setMessages: (messages: MessageInterface[]) => void;
  setChats: (chats: ChatInterface[]) => void;
  setCurrentChatIndex: (currentChatIndex: number) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string) => void;
  setFolders: (folders: FolderCollection) => void;
  setConfirmEditSubmission: (confirmEditSubmission: boolean) => void;
  setIsRecording: (isRecording: boolean) => void;
}

export const createChatSlice: StoreSlice<ChatSlice> = (set) => ({
  messages: [],
  currentChatIndex: -1,
  generating: false,
  error: '',
  folders: {},
  bottomMessageRef: null,
  isRecording: false,
  setIsRecording: (isRecording: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      isRecording: isRecording,
    }));
  },
  setBottomMessageRef: (
    bottomMessageRef: RefObject<HTMLTextAreaElement> | null
  ) => {
    set((prev: ChatSlice) => ({
      ...prev,
      bottomMessageRef: bottomMessageRef,
    }));
  },
  setMessages: (messages: MessageInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      messages: messages,
    }));
  },
  setChats: (chats: ChatInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      chats: chats,
    }));
  },
  setCurrentChatIndex: (currentChatIndex: number) => {
    set((prev: ChatSlice) => ({
      ...prev,
      currentChatIndex: currentChatIndex,
    }));
  },
  setGenerating: (generating: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      generating: generating,
    }));
  },
  setError: (error: string) => {
    set((prev: ChatSlice) => ({
      ...prev,
      error: error,
    }));
  },
  setFolders: (folders: FolderCollection) => {
    set((prev: ChatSlice) => ({
      ...prev,
      folders: folders,
    }));
  },
  setConfirmEditSubmission: (confirmEditSubmission: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      confirmEditSubmission: confirmEditSubmission,
    }));
  },
});
