import React from 'react';

interface GlobalContextProps {
  ref: React.RefObject<HTMLTextAreaElement> | null;
  setRef: (newRef: React.RefObject<HTMLTextAreaElement> | null) => void;
}

const GlobalContext = React.createContext<GlobalContextProps>({
  ref: null,
  setRef: () => {},
});

export default GlobalContext;
