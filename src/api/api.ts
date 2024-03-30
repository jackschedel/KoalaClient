import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface, ModelDefinition } from '@type/chat';
import { isAzureEndpoint, uuidv4 } from '@utils/api';

const getHeaders = (apiKey?: string, customHeaders?: Record<string, string>): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...customHeaders };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
};

const buildEndpoint = (endpoint: string, modelDef: ModelDefinition, apiKey?: string): string => {
  if (isAzureEndpoint(endpoint) && apiKey) {
    const modelName = modelDef.model;
    const apiVersion = '2023-03-15-preview';
    const path = `openai/deployments/${modelName}/chat/completions?api-version=${apiVersion}`;
    if (!endpoint.endsWith(path)) endpoint += endpoint.endsWith('/') ? path : `/${path}`;
  }
  return endpoint;
};

const handleErrorResponse = async (response: Response): Promise<never> => {
  const text = await response.text();
  if (response.status === 404 || response.status === 405) {
    const errorMessage = text.includes('model_not_found')
      ? `${text}\nMessage from KoalaClient:\nPlease ensure that you have access to the GPT-4 API!`
      : 'Message from KoalaClient:\nInvalid API endpoint! We recommend you to check your free API endpoint.';
    throw new Error(errorMessage);
  } else if (response.status === 429 || !response.ok) {
    let error = text;
    if (text.includes('insufficient_quota')) error += '\nMessage from KoalaClient:\nWe recommend changing your API endpoint or API key';
    if (response.status === 429) error += '\nRate limited!';
    throw new Error(error);
  }
  throw new Error(text);
};

export const getChatCompletion = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  modelDef: ModelDefinition,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers = getHeaders(apiKey, customHeaders);
  const finalEndpoint = buildEndpoint(endpoint, modelDef, apiKey);

  config.user = uuidv4();
  delete (config as any).model_selection;

  const response = await fetch(finalEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, ...config }),
  });

  if (!response.ok) throw new Error(await response.text());

  return response.json();
};

export const getChatCompletionStream = async (
  endpoint: string,
  messages: MessageInterface[],
  config: ConfigInterface,
  modelDef: ModelDefinition,
  apiKey?: string,
  customHeaders?: Record<string, string>
) => {
  const headers = getHeaders(apiKey, customHeaders);
  const finalEndpoint = buildEndpoint(endpoint, modelDef, apiKey);

  config.user = uuidv4();
  delete (config as any).model_selection;

  const response = await fetch(finalEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, ...config, stream: true }),
  });

  if (!response.ok) await handleErrorResponse(response);

  return response.body;
};

export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};

export const fetchOpenAIModels = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    const openaiModels = data.data.filter((model: { owned_by: string; }) => model.owned_by === 'openai');
    return openaiModels.map((model: { name: any; }) => model.name);
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};
