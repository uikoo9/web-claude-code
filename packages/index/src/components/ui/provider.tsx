'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useState } from 'react';

export function Provider(props: { children: React.ReactNode }) {
  const [cache] = useState(() =>
    createCache({
      key: 'chakra',
      prepend: true,
    })
  );

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={defaultSystem}>
        {props.children}
      </ChakraProvider>
    </CacheProvider>
  );
}
