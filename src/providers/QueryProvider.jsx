import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <RTLProvider theme={rtlTheme}> */}
      {children}
      {/* </RTLProvider> */}
    </QueryClientProvider>
  );
}