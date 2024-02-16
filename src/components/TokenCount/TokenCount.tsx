import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import countTokens from '@utils/messageUtils';

const TokenCount = React.memo(() => {
  const [updateOverride, setUpdateOverride] = useState(true);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const messages = useStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex].messages : [],
    shallow
  );

  const modelDefs = useStore((state) => state.modelDefs);

  const model_num = useStore((state) => {
    const currentModelNum =
      state.chats?.[state.currentChatIndex]?.config?.model_selection ?? 0;
    return currentModelNum >= modelDefs.length ? 0 : currentModelNum;
  });

  const model = useStore((state) => state.modelDefs[model_num]);

  const cost = useMemo(() => {
    if (!model?.prompt_cost_1000) {
      return 0;
    }
    const price = model.prompt_cost_1000 * (tokenCount / 1000);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating || updateOverride) {
      setUpdateOverride(!generating);
      setTokenCount(countTokens(messages, model.model));
    }
  }, [messages, generating]);

  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-custom-white'>
        Tokens: {tokenCount} (${cost})
      </div>
    </div>
  );
});

export default TokenCount;
