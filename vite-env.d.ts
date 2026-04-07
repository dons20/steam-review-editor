/// <reference types="vite/client" />

declare global {
  interface Window {
    goatcounter?: {
      endpoint?: string;
      count?: (payload: {
        path: string;
        title?: string;
        referrer?: string;
        event?: boolean;
      }) => void;
    };
  }
}

export {};
