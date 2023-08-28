import React from 'react';
import { useAtBottom, useScrollToBottom } from 'react-scroll-to-bottom';

import DownArrow from '@icon/DownArrow';

const ScrollToBottomButton = React.memo(() => {
  const scrollToBottom = useScrollToBottom();
  const [atBottom] = useAtBottom();

  return (
    <button
      className={`cursor-pointer absolute right-6 bottom-[60px] md:bottom-[60px] z-10 rounded-full bg-custom-white text-neutral-dark hover:opacity-100 opacity-50 ${
        atBottom ? 'hidden' : ''
      }`}
      aria-label='scroll to bottom'
      onClick={() =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      }
    >
      <DownArrow />
    </button>
  );
});

export default ScrollToBottomButton;
