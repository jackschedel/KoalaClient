import React, { useEffect, useRef, useState } from 'react';

import CopyIcon from '@icon/CopyIcon';
import TickIcon from '@icon/TickIcon';
import CodeBar from './CodeBar';

import mermaid from 'mermaid';
import useStore from '@store/store';
import PannableDiv from './PannableDiv';


const MermaidBlock = ({
   chartDefinition,
}: {
   chartDefinition: string
}) => {

   function hashWith(str: string) {
      let hashOut = (Number(new Date().getUTCMilliseconds().toString().slice(-8)) * 33)
      for (let i = 0; i < str.length; i++) {
         hashOut += (str.charCodeAt(i) * 27);
         if (Math.random() < 0.33)
            hashOut += (i * 27)
      }
      return (hashOut).toString(36).padStart(3, 'x');
   };

   const mermaidContainerRef = useRef<HTMLDivElement>(null);
   const isGenerating = useStore.getState().generating;

   const lang = 'mermaid'


   useEffect(() => {
      if (mermaidContainerRef.current) {

         mermaid.initialize({
            startOnLoad: true,
            securityLevel: 'strict',
            theme: 'dark',
            logLevel: 'fatal',
            arrowMarkerAbsolute: false,
            fontSize: 14,
            flowchart: {
               htmlLabels: false,
               curve: 'basis',
               rankSpacing: 25,
               useMaxWidth: true,
               nodeSpacing: 20,
               diagramPadding: 10,

            },
            gantt: {
               fontSize: 12
            }
         });



         mermaid.parse(chartDefinition, { suppressErrors: true })
            .then(isSyntaxValid => {
               try {

                  if (!mermaidContainerRef.current)
                     throw ("chart failed - null reference")

                  if (chartDefinition.trim() === '') { } // empty chart - do nothing
                  else if (!isSyntaxValid) {
                     if (isGenerating) { }  // still generating - leave existing chart
                     else
                        mermaidContainerRef.current.innerHTML = chartDefinition ?? "" // fallback to raw
                  } else  // syntax valid - try render
                     mermaid.render(`mermaidChart_${hashWith(chartDefinition)}`, chartDefinition).then(resultSvg => {
                        if (mermaidContainerRef.current) {
                           mermaidContainerRef.current.innerHTML = resultSvg.svg
                        }
                     })

                  // chart failed - falling back to raw code



               } catch (err: any) {
                  if (!mermaidContainerRef.current)
                     throw (err)
                  mermaidContainerRef.current.innerHTML = chartDefinition ?? "" // fallback to raw

               }
            });





      }
   }, [chartDefinition]);

   return (
      <div className="bg-gray-900 rounded-md">
         <CodeBar lang='mermaid' blockRef={mermaidContainerRef} code={chartDefinition} />
         <div className=''>
            <PannableDiv>
               <div className="" ref={mermaidContainerRef}></div>
            </PannableDiv>
         </div>
      </div>
   );

};



export default MermaidBlock;
