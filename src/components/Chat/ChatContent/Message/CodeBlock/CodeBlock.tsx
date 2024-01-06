import React, { useRef } from 'react';

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
        <code
          ref={codeRef}
          className={`!whitespace-pre-wrap hljs language-${lang}`}
        >
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

export default CodeBlock;
