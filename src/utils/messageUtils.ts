import { MessageInterface, ModelDefinition, TotalTokenUsed } from '@type/chat';

import { useCallback } from 'react';
import useStore from '@store/store';

import { Tiktoken } from '@dqbd/tiktoken/lite';
const cl100k_base = await import('@dqbd/tiktoken/encoders/cl100k_base.json');

const encoder = new Tiktoken(
  cl100k_base.bpe_ranks,
  {
    ...cl100k_base.special_tokens,
    '<|im_start|>': 100264,
    '<|im_end|>': 100265,
    '<|im_sep|>': 100266,
  },
  cl100k_base.pat_str
);

export const tokenCostToCost = (
  tokenCost: TotalTokenUsed[number],
  model: number,
  modelDefs: ModelDefinition[]
) => {
  if (!tokenCost) return 0;

  const modelDef = modelDefs[model];
  if (!modelDef) return 0;

  const completionCost =
    (modelDef.completion_cost_1000 / 1000) * tokenCost.completionTokens;
  const promptCost =
    (modelDef.completion_cost_1000 / 1000) * tokenCost.promptTokens;
  return completionCost + promptCost;
};

// https://github.com/dqbd/tiktoken/issues/23#issuecomment-1483317174
export const getChatGPTEncoding = (
  messages: MessageInterface[],
  model: string
) => {
  const isGpt3 = model === 'gpt-3.5-turbo';

  const msgSep = isGpt3 ? '\n' : '';
  const roleSep = isGpt3 ? '\n' : '<|im_sep|>';

  const serialized = [
    messages
      .map(({ role, content }) => {
        return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
      })
      .join(msgSep),
    `<|im_start|>assistant${roleSep}`,
  ].join(msgSep);

  return encoder.encode(serialized, 'all');
};

const countTokens = (messages: MessageInterface[], model: string) => {
  if (messages.length === 0) return 0;
  return getChatGPTEncoding(messages, model).length;
};

export const limitMessageTokens = (
  messages: MessageInterface[],
  model: string,
  max_context: number = 4096,
  max_tokens: number = 2048
): MessageInterface[] => {
  const limitedMessages: MessageInterface[] = [];
  max_context -= max_tokens;
  let tokenCount = 0;

  const isSystemFirstMessage = messages[0]?.role === 'system';
  let retainSystemMessage = false;

  // Check if the first message is a system message and if it fits within the token limit
  if (isSystemFirstMessage) {
    const systemTokenCount = countTokens([messages[0]], model);
    if (systemTokenCount < max_context) {
      tokenCount += systemTokenCount;
      retainSystemMessage = true;
    }
  }

  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // until the token limit is reached (excludes first message)
  for (let i = messages.length - 1; i >= 1; i--) {
    const count = countTokens([messages[i]], model);
    if (count + tokenCount > max_context) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }

  // Process first message
  if (retainSystemMessage) {
    // Insert the system message in the third position from the end
    limitedMessages.splice(-3, 0, { ...messages[0] });
  } else if (!isSystemFirstMessage) {
    // Check if the first message (non-system) can fit within the limit
    const firstMessageTokenCount = countTokens([messages[0]], model);
    if (firstMessageTokenCount + tokenCount < max_context) {
      limitedMessages.unshift({ ...messages[0] });
    }
  }

  return limitedMessages;
};

export const useUpdateTotalTokenUsed = () => {
  const setTotalTokenUsed = useStore((state) => state.setTotalTokenUsed);
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const modelDefs = useStore((state) => state.modelDefs);

  const updateTotalTokenUsed = useCallback(
    (
      model: number,
      promptMessages: MessageInterface[],
      completionMessage: MessageInterface
    ) => {
      const updatedTotalTokenUsed = JSON.parse(JSON.stringify(totalTokenUsed));
      const modelName = modelDefs[model].model;

      const newPromptTokens = countTokens(promptMessages, modelName);
      const newCompletionTokens = countTokens([completionMessage], modelName);
      const { promptTokens = 0, completionTokens = 0 } =
        updatedTotalTokenUsed[model] ?? {};

      updatedTotalTokenUsed[model] = {
        promptTokens: promptTokens + newPromptTokens,
        completionTokens: completionTokens + newCompletionTokens,
      };

      setTotalTokenUsed(updatedTotalTokenUsed);
    },
    [setTotalTokenUsed, totalTokenUsed, modelDefs]
  );

  return updateTotalTokenUsed;
};

export default countTokens;
