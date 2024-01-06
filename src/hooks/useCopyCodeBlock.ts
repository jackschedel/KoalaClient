import useStore from '@store/store';

const useCopyCodeBlock = () => {
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const chats = useStore((state) => state.chats) ?? [];

  const copyCodeBlock = () => {
    if (chats.length == 0) return;

    const currentChat = chats[currentChatIndex].messages;

    if (currentChat.length == 0) return;

    const latestMessage = currentChat[currentChat.length - 1].content;

    const codeBlockRegex = /```(\w+)?\s*([^`]+)```/s;

    const match = codeBlockRegex.exec(latestMessage);

    let toCopy;
    if (match && match[2]) {
      toCopy = match[2].trim();
    } else {
      toCopy = latestMessage;
    }

    navigator.clipboard.writeText(toCopy);
  };

  return copyCodeBlock;
};

export default useCopyCodeBlock;
