import React, { useEffect, useRef, useState } from 'react';

import CopyIcon from '@icon/CopyIcon';
import TickIcon from '@icon/TickIcon';
import CodeBar from './CodeBar';

import mermaid from 'mermaid';


const MermaidBlock = ({
   chartDefinition,
}: {
   chartDefinition: string
}) => {

   const mermaidContainerRef = useRef<HTMLDivElement>(null);
   const lang = 'mermaid'


   useEffect(() => {
      if (mermaidContainerRef.current) {
         mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
         });
         mermaid.mermaidAPI.render('mermaidSvg', chartDefinition).then(resultSvg => {
            if (mermaidContainerRef.current) {
               mermaidContainerRef.current.innerHTML = resultSvg.svg
            }
         })


      }
   }, [chartDefinition]);

   return (
      <div className="bg-gray-900 rounded-md">
         <CodeBar lang='mermaid' blockRef={mermaidContainerRef} code={chartDefinition} />
         <div className=''>

            <div className="flex flex-col justify-center items-center " id="mermaidContainer" ref={mermaidContainerRef}></div>
         </div>
      </div>
   );

};



export default MermaidBlock;
