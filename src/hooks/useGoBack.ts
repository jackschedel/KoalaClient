import useStore from '@store/store';

const useGoBack = () => {
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const chats = useStore((state) => state.chats);

  const goBack = () => {
    if (currentChatIndex < (chats?.length ?? 0) - 1) {
      setCurrentChatIndex(currentChatIndex + 1);
    }
  };

  return goBack;
};

export default useGoBack;
