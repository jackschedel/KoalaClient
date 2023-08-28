import CopyIcon from '@icon/CopyIcon';
import TickIcon from '@icon/TickIcon';
import React, { useState } from 'react';

const CodeBar = React.memo(
  ({
    lang,
    blockRef,
    code,
  }: {
    lang: string;
    blockRef: React.RefObject<HTMLElement>;
    code?: string;
  }) => {
    async function copyText(copyMe: string) {
      navigator.clipboard.writeText(copyMe).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      });
    }

    const [isCopied, setIsCopied] = useState<boolean>(false);
    return (
      <div className='flex items-center relative text-custom-white bg-neutral-dark px-4 py-2 text-xs font-sans'>
        <span className=''>{lang}</span>
        <button
          className='flex ml-auto gap-2'
          aria-label='copy codeblock'
          onClick={async () => {
            if (lang === 'mermaid' && code) copyText(code);
            else {
              const codeString = blockRef.current?.textContent;
              if (codeString) copyText(codeString);
            }
          }}
        >
          {isCopied ? (
            <>
              <TickIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy code
            </>
          )}
        </button>
      </div>
    );
  }
);

export default CodeBar;
