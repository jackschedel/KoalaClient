import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';
import { ModelChoice } from '@type/chat';

import countTokens from '@utils/messageUtils';
import { modelCost } from '@constants/chat';

const TokenCount = React.memo(() => {
  const [updateOverride, setUpdateOverride] = useState(true);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const messages = useStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex].messages : [],
    shallow
  );

  let model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex].config.model
      : 'gpt-3.5-turbo'
  );

  // stop modelcount null index if bad model value (i.e. from 2.0.9)
  if (!model) {
    model = 'gpt-3.5-turbo';
  }

  const cost = useMemo(() => {
    const price =
      modelCost[model].prompt.price *
      (tokenCount / modelCost[model].prompt.unit);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating || updateOverride) {
      setUpdateOverride(!generating);
      setTokenCount(countTokens(messages, model));
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
