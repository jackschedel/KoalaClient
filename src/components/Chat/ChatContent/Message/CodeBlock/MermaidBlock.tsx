import React, { useEffect, useRef, useState } from 'react';

import CodeBar from './CodeBar';

import useStore from '@store/store';
import PannableDiv from './PannableDiv';
import Mermaid from 'mermaid';

const MermaidBlock = ({
  children,
}: {
  children: React.ReactNode & React.ReactNode[];
}) => {
  const chartDefinition = children.toString();

  const chartId = `mermaidChart_${hashWith(chartDefinition)}`;
  const forcedFontSize = 16;

  function hashWith(str: string) {
    // micro hash derived from: content, time, & rng
    let hashOut =
      Number(new Date().getUTCMilliseconds().toString().slice(-8)) * 47;
    for (let i = 0; i < str.length; i++) {
      hashOut += str.charCodeAt(i) * 33;
      if (Math.random() < 0.4) hashOut += i * 33;
    }
    return hashOut.toString(36).padStart(4, 'x');
  }

  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const isGenerating = useStore.getState().generating;
  const [isPannable, setIsPannable] = useState(false);

  const lang = 'mermaid';

  useEffect(() => {
    if (mermaidContainerRef.current) {
      Mermaid.mermaidAPI.initialize({
        startOnLoad: true,
        securityLevel: 'loose',
        theme: 'dark',
        logLevel: 3,
        arrowMarkerAbsolute: false,
        fontSize: forcedFontSize,

        //htmlLabels: false
      });

      Mermaid.mermaidAPI
        .parseAsync(chartDefinition)
        .then((isSyntaxValid: boolean | void) => {
          try {
            if (!mermaidContainerRef.current)
              throw 'chart failed - null reference on mermaidContainerRef';

            if (chartDefinition.trim() === '')
              // empty chart (do nothing):
              return;
            else if (!isSyntaxValid) {
              if (isGenerating) {
                // still generating (leave existing chart):
                setIsPannable(false);
              } else {
                // invalid syntax (fallback to raw):
                mermaidContainerRef.current.innerHTML = chartDefinition ?? '';
                setIsPannable(false);
              }
            }
            // syntax valid (try render):
            else
              Mermaid.mermaidAPI
                .renderAsync(chartId, chartDefinition)
                .then((resultSvg) => {
                  if (mermaidContainerRef.current) {
                    mermaidContainerRef.current.innerHTML = resultSvg;
                    setIsPannable(true);
                  }
                });
          } catch (err: any) {
            if (!mermaidContainerRef.current) throw err;
            mermaidContainerRef.current.innerHTML = chartDefinition ?? ''; // error rendering (fallback to raw)
            throw err;
          }
        });
    }
  }, [chartDefinition, isPannable, isGenerating]);

  return (
    <div className='bg-gray-900 rounded-md'>
      <CodeBar
        lang='mermaid'
        blockRef={mermaidContainerRef}
        code={chartDefinition}
      />
      <div className=''>
        <PannableDiv isPannable={isPannable}>
          <div className='' ref={mermaidContainerRef}></div>
        </PannableDiv>
      </div>
      <style>
        {
          // override mermaid font setting (messes up zoom rendering)
          `#${chartId} .label { font-size: ${forcedFontSize}px !important; }`
        }
      </style>
    </div>
  );
};

export default MermaidBlock;
