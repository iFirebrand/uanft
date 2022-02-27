import { QueryClientProvider, QueryClient } from "react-query";
import React from 'react';
import { ThemeProvider } from '@mui/material';
import * as theme from './theme';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const AppProviders = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      {children}
  
    </ThemeProvider>
    <ToastContainer
      position="bottom-right"
      newestOnTop
      closeButton={true}
    />
    </QueryClientProvider>
  
);

export default AppProviders;