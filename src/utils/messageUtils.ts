import { MessageInterface, ModelChoice, TotalTokenUsed } from "@type/chat";

import useStore from "@store/store";

import { Tiktoken } from "@dqbd/tiktoken/lite";
import { modelMaxToken } from "@constants/chat";
const cl100k_base = await import("@dqbd/tiktoken/encoders/cl100k_base.json");

const encoder = new Tiktoken(
  cl100k_base.bpe_ranks,
  {
    ...cl100k_base.special_tokens,
    "<|im_start|>": 100264,
    "<|im_end|>": 100265,
    "<|im_sep|>": 100266,
  },
  cl100k_base.pat_str,
);

// https://github.com/dqbd/tiktoken/issues/23#issuecomment-1483317174
export const getChatGPTEncoding = (
  messages: MessageInterface[],
  model: ModelChoice,
) => {
  const isGpt3 = model === "gpt-3.5-turbo";

  const msgSep = isGpt3 ? "\n" : "";
  const roleSep = isGpt3 ? "\n" : "<|im_sep|>";

  const serialized = [
    messages
      .map(({ role, content }) => {
        return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
      })
      .join(msgSep),
    `<|im_start|>assistant${roleSep}`,
  ].join(msgSep);

  return encoder.encode(serialized, "all");
};

const countTokens = (messages: MessageInterface[], model: ModelChoice) => {
  if (messages.length === 0) return 0;
  return getChatGPTEncoding(messages, model).length;
};

export const limitMessageTokens = (
  messages: MessageInterface[],
  context_limit: number = 4096,
  model: ModelChoice,
  max_model_token: number = modelMaxToken[model],
  token_limit: number,
): MessageInterface[] => {
  const limitedMessages: MessageInterface[] = [];
  let tokenCount = 0;

  if (max_model_token < context_limit) {
    context_limit = max_model_token;
  }

  let wholeTokenCount = 0;
  for (let i = 0; i < messages.length; i++) {
    wholeTokenCount += countTokens([messages[i]], model);
  }

  if (token_limit < context_limit + wholeTokenCount) {
    context_limit = max_model_token - token_limit;
  }

  const isSystemFirstMessage = messages[0]?.role === "system";
  let retainSystemMessage = false;

  // Check if the first message is a system message and if it fits within the token limit
  if (isSystemFirstMessage) {
    const systemTokenCount = countTokens([messages[0]], model);
    if (systemTokenCount < context_limit) {
      tokenCount += systemTokenCount;
      retainSystemMessage = true;
    }
  }

  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // until the token limit is reached (excludes first message)
  for (let i = messages.length - 1; i >= 1; i--) {
    const count = countTokens([messages[i]], model);
    if (count + tokenCount > context_limit) break;
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
    if (firstMessageTokenCount + tokenCount < context_limit) {
      limitedMessages.unshift({ ...messages[0] });
    }
  }

  return limitedMessages;
};

export const updateTotalTokenUsed = (
  model: ModelChoice,
  promptMessages: MessageInterface[],
  completionMessage: MessageInterface,
) => {
  const setTotalTokenUsed = useStore.getState().setTotalTokenUsed;
  const updatedTotalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().totalTokenUsed),
  );

  const newPromptTokens = countTokens(promptMessages, model);
  const newCompletionTokens = countTokens([completionMessage], model);
  const { promptTokens = 0, completionTokens = 0 } =
    updatedTotalTokenUsed[model] ?? {};

  updatedTotalTokenUsed[model] = {
    promptTokens: promptTokens + newPromptTokens,
    completionTokens: completionTokens + newCompletionTokens,
  };
  setTotalTokenUsed(updatedTotalTokenUsed);
};

export default countTokens;
