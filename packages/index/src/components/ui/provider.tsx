'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { defaultSystem } from '@chakra-ui/react';

export function Provider(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem} cssVarsRoot="body" suppressHydrationWarning>
      {props.children}
    </ChakraProvider>
  );
}
