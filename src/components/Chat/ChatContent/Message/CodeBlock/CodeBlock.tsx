import React, { useRef, useState } from 'react';

import CopyIcon from '@icon/CopyIcon';
import TickIcon from '@icon/TickIcon';
import CodeBar from './CodeBar';

const CodeBlock = ({
  lang,
  codeChildren,
}: {
  lang: string;
  codeChildren: React.ReactNode & React.ReactNode[];
}) => {
  const codeRef = useRef<HTMLElement>(null);

  return (
    <div className='bg-custom-black rounded-md'>
      <CodeBar lang={lang} blockRef={codeRef} />
      <div className='p-4 overflow-y-auto'>
        <code ref={codeRef} className={`!whitespace-pre hljs language-${lang}`}>
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

export default CodeBlock;
