'use client';

/* * */

import { SWRConfig } from 'swr';
import { MantineProvider } from '@mantine/core';
import AppstateProvider from '@/contexts/Appstate';
import CurrentOrderProvider from '@/contexts/CurrentOrder';

/* * */

export default function Providers({ children }) {
  //

  //
  // A. SWR Configuration

  const swrOptions = {
    refreshInterval: 5000,
    fetcher: async (...args) => {
      const res = await fetch(...args);
      if (!res.ok) {
        const errorDetails = await res.json();
        const error = new Error(errorDetails.message || 'An error occurred while fetching data.');
        error.description = errorDetails.description || 'No additional information was provided by the API.';
        error.status = res.status;
        throw error;
      }
      return res.json();
    },
  };

  //
  // B. Render components

  return (
    <SWRConfig value={swrOptions}>
      <MantineProvider defaultColorScheme="light">
        <AppstateProvider>
          <CurrentOrderProvider>{children}</CurrentOrderProvider>
        </AppstateProvider>
      </MantineProvider>
    </SWRConfig>
  );

  //
}
