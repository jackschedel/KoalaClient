import useStore from '@store/store';

const useGoForward = () => {
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const goForward = () => {
    if (currentChatIndex > 0) {
      setCurrentChatIndex(currentChatIndex - 1);
    }
  };

  return goForward;
};

export default useGoForward;
