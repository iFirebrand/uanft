import { QueryClientProvider, QueryClient } from "react-query";
import React from 'react';
import { ThemeProvider } from '@mui/material';
import * as theme from './theme';

const queryClient = new QueryClient();

const AppProviders = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      {children}
  
    </ThemeProvider>
    </QueryClientProvider>
  
);

export default AppProviders;