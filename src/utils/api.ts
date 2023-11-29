export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('openai.azure.com');
};

export const uuidv4 = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
    ((c === 'x' ? Math.random() * 16 : (Math.random() * 16 & 0x3 | 0x8)) | 0).toString(16)
  );